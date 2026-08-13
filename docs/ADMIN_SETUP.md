# Admin Setup

Approval management lives at `/admin`.

## Local Routes

- `/admin`: review submissions, approve, reject, request changes, and lock the current month.
- `/admin/analytics`: review reservation funnel and participant activity.
- `/admin/sign-in`: Clerk sign-in page.
- `/admin/sign-up`: Clerk sign-up page.

## Required Local Environment

Put local values in `.env.local` and restart the dev server after changes.

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=month-history-museum

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/sign-up
```

MongoDB enables real month/event imports and admin review actions. Without `MONGODB_URI`, the admin page shows static fallback data and disables mutations.

Clerk protects admin routes only when both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set. The sign-in and sign-up pages remain public so admins can reach them.

## Clerk Dashboard Settings

Use the Clerk dashboard to copy the publishable key and secret key. Configure the app URLs to use the local admin auth paths:

- Sign-in URL: `/admin/sign-in`
- Sign-up URL: `/admin/sign-up`

Participant accounts are still deferred; Clerk is only for admin access right now.
