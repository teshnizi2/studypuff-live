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

---

## Password reset (self-service)

Users who forget their password use **`/forgot-password`** (linked from the login
page). They enter an email or username; we send a recovery email; the link lands
on **`/auth/confirm`**, which verifies the token and opens **`/reset-password`**
where they set a new password.

This uses the **token-hash** flow so the link works on any device (the person can
request on a laptop and open it on their phone). For that to work you must point
the recovery email at our `/auth/confirm` route.

### 1. Email template

**Authentication → Email Templates → "Reset Password"** — make the link:

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">
  Reset your password
</a>
```

`{{ .RedirectTo }}` resolves to the URL the app passed
(`<origin>/auth/confirm?next=/reset-password`), so the link automatically points at
whatever origin made the request — `localhost:3001` in dev, the preview/prod host
otherwise — without ever changing the global Site URL.

The default template uses `{{ .ConfirmationURL }}`, which routes through Supabase's
verify endpoint and only works in the **same browser** that requested the reset.
Using `{{ .TokenHash }}` as above is what makes it cross-device.

### 2. URL configuration

**Authentication → URL Configuration → Redirect URLs** — the redirect target must
be allow-listed or `resetPasswordForEmail` is rejected and no email is sent. Add
(or confirm a wildcard covers) the confirm route for each origin you use:

- `http://localhost:3001/auth/confirm` (local dev)
- `https://www.studypuff.com/auth/confirm` (production)
- your Vercel preview origin + `/auth/confirm`, if you test on previews

A wildcard like `https://www.studypuff.com/**` and `http://localhost:3001/**`
covers these (and the existing `/auth/callback` used by Google).

> **Silent-fail gotcha:** to avoid leaking which accounts exist, the request form
> always shows "if an account matches, we sent a link" — even when the redirect URL
> is not allow-listed and the send actually failed. If a test email never arrives,
> check this allow list first.

### 3. Notes

- **Email rate limit:** the built-in Supabase email service is limited to roughly
  **3–4 messages per hour** and may land in spam. For production volume, configure
  custom SMTP under **Authentication → Email → SMTP Settings**.
- **No enumeration:** `/forgot-password` always shows the same "if an account
  matches, we sent a link" confirmation, so it cannot be used to discover which
  emails or usernames are registered.
- **No code/middleware changes needed** for new environments — only the two
  dashboard settings above.
