## Admin dashboard for product management

A password-protected `/admin` area where you can manage products end-to-end: create new ones, edit prices, swap images, and delete. Locked behind your personal Supabase login so the storefront stays no-login for shoppers.

### What you'll get

**Auth**

- A `/admin/login` page with email + password.
- One admin account (yours), created by me directly in Supabase — no public signup.
- A `user_roles` table + `has_role()` security-definer function so only the `admin` role can read/write products. Anyone else hitting `/admin` is redirected to login.
- Logout button in the admin header.

**Admin home** — `/admin`

- Table of all products: thumbnail, name, category, price, compare-at, stock, featured/new flags.
- Search by name, filter by category.
- Buttons: **New product**, **Edit**, **Delete** (with confirm dialog).

**Product editor** — `/admin/products/new` and `/admin/products/:id`

- Fields: name, slug (auto from name, editable), category (dropdown from `categories` table), description, price, compare-at price, stock qty, is_featured, is_new_arrival.
- **Image manager**: drag-drop or click to upload (multi-file). Thumbnails of current images with remove (×) button and drag-to-reorder. First image = primary.
- Save / Cancel.

**Bulk price tool** — `/admin/bulk-prices`

- One-screen table with every product and an inline price input. Edit any number of rows, click **Save all** to update at once.

### Technical details

- **Auth**: Supabase email/password. New `user_roles` table (`user_id`, `role` enum `admin|user`) with RLS; `has_role(uid, role)` security-definer function.
- **RLS migration on `products**`: add `INSERT`, `UPDATE`, `DELETE` policies gated by `has_role(auth.uid(), 'admin')`. Public `SELECT` stays as-is so the storefront keeps working.
- **Storage RLS on `product-images` bucket**: `INSERT` / `UPDATE` / `DELETE` only for admin role. Public read stays.
- **Routes** added to `App.tsx`: `/admin/login`, `/admin` (list), `/admin/products/new`, `/admin/products/:id`, `/admin/bulk-prices`. Wrapped in an `AdminGuard` that checks session + admin role.
- **Files created**:
  - `src/pages/admin/AdminLogin.tsx`, `AdminProductsList.tsx`, `AdminProductEdit.tsx`, `AdminBulkPrices.tsx`
  - `src/components/admin/AdminGuard.tsx`, `AdminLayout.tsx`, `ImageUploader.tsx`
  - `src/hooks/useAdminAuth.ts`
  - Migration: `user_roles` table + `has_role` + product/storage policies
- **Image upload**: uses Supabase Storage `product-images` bucket (already public). Files saved as `products/{productId}/{uuid}.{ext}`. URLs stored in `products.images[]`.
- **Out of scope**: editing categories, mystery box, orders. Storefront UI unchanged — it just reads the same `products` table.

### After I build it

I'll create your admin user directly in Supabase (you give me the email + a temp password, you change it on first login).

### Memory updates

The "no admin panel" rule in business-model memory will be updated to allow this single admin area.  
The admin panels ui you build will be bottom of home page a unhighlighted button called "admin". by clickig it email and password requie and then admin logs in to the dashboard where admin can directly control over supabase with simple ui and ux

&nbsp;