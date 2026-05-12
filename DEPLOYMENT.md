# Lilly Lux Lashes Deployment

## What Runs

Deploy the `beauty-booking-backend` folder as the Node app.

The backend now serves:

- `/` for the public website
- `/manifest.webmanifest`, `/sw.js`, and `/offline.html` for the installable mobile web app
- `/admin` for the admin dashboard
- `/api/health` for a health check
- `/api/config` for the Stripe publishable key
- `/api/create-card-setup` and `/api/book-appointment` for booking
- `/api/appointments` and `/api/charge-no-show` for admin actions

## Required Environment Variables

Set these in your hosting provider:

```text
PORT=3000
NODE_ENV=production
STRIPE_SECRET_KEY=sk_test_or_live_value
STRIPE_PUBLISHABLE_KEY=pk_test_or_live_value
ADMIN_TOKEN=make-this-long-and-private
ALLOWED_ORIGINS=https://your-live-domain.example
```

Most hosts set `PORT` automatically. If they do, do not override it unless the host tells you to.
Set `ALLOWED_ORIGINS` to the exact public site origin, with no trailing slash. If the backend serves the website directly at the same domain, use that same origin.

## Local Run

```bash
cd beauty-booking-backend
npm install
npm start
```

Then open:

- Public site: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin`
- Health check: `http://localhost:3000/api/health`

## Important Production Notes

The current app stores appointments in `appointments.json`. That is okay for testing, but many hosts erase or replace local files during redeploys. For real production, move appointments into a database such as Supabase, Neon Postgres, MongoDB Atlas, or PlanetScale.

Use Stripe test keys while testing. Switch both Stripe keys to live keys only when the booking flow has been tested end to end.

The public site is also configured as an installable mobile web app. It must be served over HTTPS for phone installation and service worker caching to work in production.

Security cannot be guaranteed at 100%, but the app should not be deployed until:

- `ADMIN_TOKEN` is long, private, and not reused anywhere else.
- `.env`, `node_modules`, and `appointments.json` are not committed.
- The public site uses HTTPS.
- Stripe live keys are used only after a full test-key booking and no-show charge test.
- Appointment storage is moved to a production database before relying on it for real client records.
