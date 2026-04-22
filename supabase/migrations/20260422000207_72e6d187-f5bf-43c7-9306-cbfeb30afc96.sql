INSERT INTO public.user_roles (user_id, role)
VALUES ('55c2c0a8-d343-4cf6-8f74-76e89b5ad1c9', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;