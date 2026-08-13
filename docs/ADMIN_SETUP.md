# Admin Setup

Editorial operations live at `/admin`.

## Local Routes

- `/admin`: review imported months, event counts, source coverage, and review queues.
- `/admin/analytics`: inherited reservation analytics route; not part of the primary historical workflow.
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

MongoDB enables real month/event import overview data. Without `MONGODB_URI`, the admin page shows static fallback data.

Clerk protects admin routes only when both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set. The sign-in and sign-up pages remain public so admins can reach them.

## Clerk Dashboard Settings

Use the Clerk dashboard to copy the publishable key and secret key. Configure the app URLs to use the local admin auth paths:

- Sign-in URL: `/admin/sign-in`
- Sign-up URL: `/admin/sign-up`

Public visitor accounts are still deferred; Clerk is only for admin/editorial access right now.
