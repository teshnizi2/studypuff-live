# StudyPuff Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` (local) or configure the same variables in your host (Vercel / Render / etc.).
3. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from **Project Settings → API**.
4. Set **`NEXT_PUBLIC_SITE_URL`** to your canonical site origin with no trailing slash, e.g. `https://studypuff.example.com`. Used as a fallback when request headers do not include `Host` (some edge cases). Local dev can use `http://localhost:3001` if you use port 3001.
5. Run the SQL migration in `supabase/migrations/20260428_studypuff_auth_admin_mvp.sql`.
6. Enable **Email** provider in Supabase Auth (email/password).
7. Create the first account through `/register`, then promote it in SQL:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

Only the **anon** key is used by the Next.js application. Do not expose a Supabase **service role** key to browser code.

---

## Google sign-in (OAuth)

This app uses Supabase Auth with the **Google** provider and PKCE. After Google redirects to Supabase, the user returns to **`/auth/callback`** on your site, which exchanges the code for a session cookie.

### 1. Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → **Credentials**.
2. Create **OAuth client ID** → type **Web application**.
3. **Authorized JavaScript origins**: add your production origin, e.g. `https://your-domain.com`. For local dev, add `http://localhost:3001` (or the port you use).
4. **Authorized redirect URIs**: add the **Supabase callback URL** shown in the Supabase Dashboard for the Google provider (shape like `https://<project-ref>.supabase.co/auth/v1/callback`). This is **not** your app URL; it is Supabase’s endpoint.
5. Save **Client ID** and **Client Secret**.

### 2. Supabase Dashboard

1. **Authentication → Providers → Google**: enable Google, paste Client ID and Client Secret.
2. **Authentication → URL configuration**:
   - **Site URL**: your production origin, e.g. `https://your-domain.com`.
   - **Redirect URLs**: add exactly:
     - `https://your-domain.com/auth/callback`
     - `http://localhost:3001/auth/callback` (or your dev origin) for local testing.

The app builds `redirectTo` as `{origin}/auth/callback?next=/dashboard` (or another safe relative path). Only paths starting with `/` are accepted after login.

### 3. Production checklist

- [ ] Google OAuth consent screen published (or in testing with test users).
- [ ] Supabase redirect allow list includes production `/auth/callback`.
- [ ] `NEXT_PUBLIC_SITE_URL` matches production origin (optional but recommended).
- [ ] TLS enabled on production (required for secure cookies).

### References

- [Supabase: Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase: Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
