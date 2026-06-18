// @vitest-environment node
//
// Integration test for atomic stock enforcement at order time.
// Runs the REAL migration (20260618000100_atomic_stock_decrement.sql) against an
// in-process Postgres (pglite) and drives the actual place_order /
// place_mystery_order RPCs — no external services, runs in CI.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const bootstrapSql = readFileSync(path.join(here, 'fixtures/stock-bootstrap.sql'), 'utf8');
const migrationSql = readFileSync(
  path.join(here, '../../supabase/migrations/20260618000100_atomic_stock_decrement.sql'),
  'utf8',
);

let db: PGlite;

const CUSTOMER = {
  address: 'House 1, Road 2, Dhaka',
  district: 'Dhaka',
  upazila: 'Gulshan',
};

// Distinct valid phones (^01[3-9][0-9]{8}$) so the per-phone rate limit never
// fires before the stock check — proving rejections come from stock, not limits.
const phone = (n: number) => `0131000${String(n).padStart(4, '0')}`;

async function freshDb(): Promise<PGlite> {
  const pg = new PGlite();
  await pg.exec(bootstrapSql);
  await pg.exec(migrationSql);
  return pg;
}

async function seedProduct(opts: { name: string; price: number; stock: number | null }): Promise<string> {
  const res = await db.query<{ id: string }>(
    `INSERT INTO public.products (name, price, slug, stock_qty)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [opts.name, opts.price, opts.name.toLowerCase().replace(/\s+/g, '-'), opts.stock],
  );
  return res.rows[0].id;
}

async function stockOf(id: string): Promise<number | null> {
  const res = await db.query<{ stock_qty: number | null }>(
    'SELECT stock_qty FROM public.products WHERE id = $1',
    [id],
  );
  return res.rows[0].stock_qty;
}

async function orderCount(): Promise<number> {
  const res = await db.query<{ n: number }>('SELECT count(*)::int AS n FROM public.orders');
  return res.rows[0].n;
}

function placeOrder(items: Array<{ id: string; quantity: number }>, n: number) {
  return db.query(
    'SELECT public.place_order($1::jsonb, $2, $3, $4, $5, $6) AS result',
    [JSON.stringify(items), 'Test Customer', phone(n), CUSTOMER.address, CUSTOMER.district, CUSTOMER.upazila],
  );
}

beforeEach(async () => {
  db = await freshDb();
});

afterEach(async () => {
  await db.close();
});

describe('atomic stock decrement', () => {
  it('stock 3 + 4 orders → 3 succeed, 4th rejected, stock lands at 0', async () => {
    const id = await seedProduct({ name: 'Gold Ring', price: 500, stock: 3 });

    for (let i = 1; i <= 3; i++) {
      const res = await placeOrder([{ id, quantity: 1 }], i);
      expect((res.rows[0] as { result: { order_number: string } }).result.order_number).toMatch(/^NR-/);
    }

    await expect(placeOrder([{ id, quantity: 1 }], 4)).rejects.toThrow(/out_of_stock/);

    expect(await stockOf(id)).toBe(0);
    expect(await orderCount()).toBe(3);
  });

  it('rejects when requested qty exceeds remaining stock and leaves stock untouched', async () => {
    const id = await seedProduct({ name: 'Pearl Necklace', price: 900, stock: 1 });

    await expect(placeOrder([{ id, quantity: 2 }], 1)).rejects.toThrow(/out_of_stock:Pearl Necklace/);

    expect(await stockOf(id)).toBe(1); // unchanged
    expect(await orderCount()).toBe(0); // no order written
  });

  it('all-or-nothing: a single short line item rolls back the whole order', async () => {
    const a = await seedProduct({ name: 'Bracelet', price: 300, stock: 5 });
    const b = await seedProduct({ name: 'Charm', price: 150, stock: 1 });

    await expect(
      placeOrder([{ id: a, quantity: 1 }, { id: b, quantity: 2 }], 1),
    ).rejects.toThrow(/out_of_stock:Charm/);

    expect(await stockOf(a)).toBe(5); // not decremented
    expect(await stockOf(b)).toBe(1);
    expect(await orderCount()).toBe(0);
  });

  it('untracked stock (NULL) sells freely without decrementing', async () => {
    const id = await seedProduct({ name: 'Made To Order Pendant', price: 1200, stock: null });

    // 99 is the per-line cap enforced by _order_resolve_items; untracked stock
    // means this still succeeds and nothing is decremented.
    const res = await placeOrder([{ id, quantity: 99 }], 1);
    expect((res.rows[0] as { result: { order_number: string } }).result.order_number).toMatch(/^NR-/);

    expect(await stockOf(id)).toBeNull();
    expect(await orderCount()).toBe(1);
  });

  it('aggregates duplicate line items for the same product', async () => {
    const id = await seedProduct({ name: 'Ear Cuff', price: 250, stock: 3 });

    // 2 + 2 = 4 requested against 3 in stock → must reject, stock untouched.
    await expect(
      placeOrder([{ id, quantity: 2 }, { id, quantity: 2 }], 1),
    ).rejects.toThrow(/out_of_stock/);
    expect(await stockOf(id)).toBe(3);

    // 2 + 1 = 3 → exactly fits.
    const res = await placeOrder([{ id, quantity: 2 }, { id, quantity: 1 }], 2);
    expect((res.rows[0] as { result: unknown }).result).toBeTruthy();
    expect(await stockOf(id)).toBe(0);
  });
});

describe('custom mystery box stock decrement', () => {
  function placeCustomBox(ids: string[], boxQty: number, n: number) {
    const arrayLiteral = `{${ids.join(',')}}`;
    return db.query(
      `SELECT public.place_mystery_order(
         NULL, $1::uuid[], $2::int,
         false, NULL, NULL, 'kraft', true,
         NULL::jsonb,
         'Test Customer', $3, $4, $5, $6) AS result`,
      [arrayLiteral, boxQty, phone(n), CUSTOMER.address, CUSTOMER.district, CUSTOMER.upazila],
    );
  }

  it('decrements each pick by the box quantity, and rejects when a pick is short', async () => {
    const ids = [
      await seedProduct({ name: 'Pick A', price: 200, stock: 1 }),
      await seedProduct({ name: 'Pick B', price: 200, stock: 1 }),
      await seedProduct({ name: 'Pick C', price: 200, stock: 1 }),
    ];

    // 2 boxes need 2 of each pick, only 1 each → reject, nothing decremented.
    await expect(placeCustomBox(ids, 2, 1)).rejects.toThrow(/out_of_stock/);
    for (const id of ids) expect(await stockOf(id)).toBe(1);

    // 1 box → each pick decrements to 0.
    const res = await placeCustomBox(ids, 1, 2);
    expect((res.rows[0] as { result: unknown }).result).toBeTruthy();
    for (const id of ids) expect(await stockOf(id)).toBe(0);
  });
});
