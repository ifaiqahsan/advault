# AdVault — Direct Sponsorship & Ad Booking Portal (MERN)

Creators sell ad space. Sponsors pick a date, upload an ad, and pay with Stripe (test mode).
The money is only **held** until the creator approves; approve = **capture**, reject = **cancel**.

```
advault/
├── .gitignore
├── README.md
├── client/                     React (Vite + Tailwind v4 + React Router)
│   ├── .env.example            → copy to client/.env
│   ├── vite.config.js          dev proxy: /api and /uploads → http://localhost:5000
│   └── src/
│       ├── utils/api.js        fetch wrapper that adds the JWT
│       ├── context/AuthContext.jsx   register / login / logout through the API
│       ├── context/DataContext.jsx   loads data from the API (same function names as before)
│       └── pages/sponsor/Checkout.jsx  real Stripe Elements card form
└── server/                     Node + Express + MongoDB
    ├── .env.example            → copy to server/.env
    ├── server.js               app setup, middleware, routes, DB connection
    ├── seed.js                 demo data (npm run seed)
    ├── config/db.js
    ├── models/                 User, Creator, Tier, Booking, Notification
    ├── routes/                 auth, creators, tiers, availability, bookings, track
    ├── middleware/             auth.js (JWT + roles), upload.js (multer), errorHandler.js
    ├── utils/                  email.js (Nodemailer), stripe.js
    └── uploads/                ad images saved here and served at /uploads
```

---

## 1. One-time setup (Windows PowerShell)

### a) Get your keys
| What | Where | Goes into |
|---|---|---|
| MongoDB string | [cloud.mongodb.com](https://cloud.mongodb.com) → your cluster → **Connect** → **Drivers** → copy. Replace `<password>` and add `/advault` before the `?`. Under **Network Access** add `0.0.0.0/0` (or your IP). | `server/.env` → `MONGO_URI` |
| Stripe secret key | [dashboard.stripe.com](https://dashboard.stripe.com) → make sure **Test mode** is on → Developers → API keys → `sk_test_...` | `server/.env` → `STRIPE_SECRET_KEY` |
| Stripe publishable key | same page → `pk_test_...` | `client/.env` → `VITE_STRIPE_PUBLISHABLE_KEY` |
| Gmail App Password | Google Account → Security → turn on **2-Step Verification** → search **App passwords** → create one (16 letters, no spaces) | `server/.env` → `EMAIL_USER`, `EMAIL_PASS` |

### b) Create the two .env files and install
```powershell
cd C:\path\to\advault          # your repo folder

cd server
copy .env.example .env
notepad .env                   # paste your values, save
npm install

cd ..\client
copy .env.example .env
notepad .env                   # paste pk_test_... key, save
npm install
```

> **EMAIL_OVERRIDE_TO**: the demo accounts (creator@advault.com, sponsor@advault.com) are not real inboxes.
> Put your own Gmail here and **every** email is delivered to you, with the real receiver shown in the subject.
> Leave it empty when you test with real registered accounts.

---

## 2. Run it (3 commands, 2 terminals)

```powershell
# Terminal 1
cd server
npm run seed        # wipes the DB and loads demo data (run once, or any time to reset)
npm run dev         # API on http://localhost:5000  (nodemon restarts on save)

# Terminal 2
cd client
npm run dev         # website on http://localhost:5173
```

Demo logins: **creator@advault.com / creator123** and **sponsor@advault.com / sponsor123**
(every seeded creator email also works with `creator123`; a 2nd sponsor is `sponsor2@advault.com / sponsor123`).

Stripe test cards: **4242 4242 4242 4242** (works), **4000 0000 0000 0002** (declined). Any future expiry, any CVC.

---

## 3. Two-minute demo script

1. **Guest** — open http://localhost:5173 → Creators → open *TechBytes Weekly*. The calendar shows open / locked / booked dates from MongoDB.
2. **Sponsor** — Log in as sponsor. Pick *Footer Classified* (text only) or a tier with an image → choose an open date → write the ad (try 200 words: the server refuses it) → upload a PNG under 1 MB → pay with **4242…** → you land on the Receipt.
   - Stripe dashboard → Payments: the payment shows **Uncaptured**.
   - Your inbox: "Receipt: $… authorized".
3. **Creator** — Log out, log in as creator → **Review queue** → open the new ad.
   - **Approve** → Stripe now shows **Succeeded**, sponsor gets "approved" email, date stays booked for everyone.
   - or **Reject** with a note → Stripe shows **Canceled**, sponsor gets "declined" email, the date becomes open again.
   - or **Request revision** with a note → sponsor gets an email → as sponsor go to *My Bookings* → **Edit and resubmit** → it is back to *Pending*.
4. **Calendar** — Creator → Availability → click a date → Lock. Log in as sponsor: that date can't be booked.
5. **Click tracking** — Creator → Analytics → **Test link** opens `http://localhost:5173/api/track/<id>`, which counts the click and redirects to the sponsor's site. The count goes up.
6. Stop and restart both servers → everything is still there (it's in MongoDB, not localStorage).

---

## 4. API (all JSON; errors look like `{ "message": "..." }`)

| Method & URL | Who | What |
|---|---|---|
| POST `/api/auth/register` | anyone | `{name,email,password,role}` → `{token,user}` |
| POST `/api/auth/login` | anyone | `{email,password}` → `{token,user}` |
| GET `/api/auth/me` | logged in | current user |
| GET `/api/creators`, `/api/creators/:id` | public | marketplace list / detail |
| PUT `/api/creators/me` | creator | save my media profile |
| GET `/api/tiers`, `/api/tiers/creator/:creatorId` | public | tiers |
| POST `/api/tiers`, PUT/DELETE `/api/tiers/:id` | creator (own tiers only) | tier CRUD |
| GET `/api/availability`, `/api/availability/:creatorId` | public | `{ "YYYY-MM-DD": "locked" \| "booked" }` (missing = open) |
| PUT `/api/availability/lock` `{date}`, PUT `/api/availability/open-all` | creator | lock/unlock dates |
| POST `/api/bookings/upload` (form-data field `image`) | sponsor | PNG/JPG < 1 MB → `{url}` |
| POST `/api/bookings/intent` | sponsor | validates + creates Stripe hold → `{clientSecret}` |
| POST `/api/bookings/confirm` `{paymentIntentId,...}` | sponsor | saves booking (pending / authorized) |
| GET `/api/bookings/mine`, `/api/bookings/notifications` | logged in | my bookings / my emails |
| PUT `/api/bookings/:id/review` `{status,note}` | creator | approve (capture) / reject (cancel) / revision |
| PUT `/api/bookings/:id/resubmit` | sponsor | send fixed creative |
| GET `/api/track/:bookingId` | public | +1 click, redirect to target URL |

Testing in Postman / Thunder Client: call login, copy `token`, then add header `Authorization: Bearer <token>`.

---

## 5. Which course topic each part uses (CS4032 Web Programming)

| Part of AdVault | Course topic (week) | In plain words |
|---|---|---|
| Every request/response, status codes 200/201/400/401/403/404/409, the 302 redirect in click tracking | HTTP protocol (1) | The server answers with a code that tells the browser what happened. |
| Tailwind pages, responsive layout | CSS, Flexbox, Frameworks (2–3) | Already in the frontend. |
| `async/await`, `Promise.all`, `fetch` in `api.js` and all routes | JS async / promises / event loop (4) | Waiting for the database or Stripe without freezing the server. |
| Contexts, components, `useState`/`useEffect` | React & UI components (5–6) | `DataContext` is shared state; every page reads from it. |
| One global store for data (`DataContext`) | Redux / state management (7) | Same idea as a Redux store, built with React Context. |
| `server.js`, Express on Node | Web servers & server-side programming (7) | Node runs our JavaScript server on port 5000. |
| `multer` saving to `server/uploads`, `express.static` | File system & RESTful routing (8) | Files are written to disk and served back by URL. |
| JWT in `localStorage` + `Authorization` header | State management: cookies, sessions (8) | HTTP forgets you between requests; the token "remembers" who you are. |
| `cors`, `express.json`, `protect`, `allow('creator')`, `errorHandler` | Express & middlewares (9) | Little functions that run before/after every route. |
| Mongoose models, `find/create/findByIdAndUpdate/delete` | NoSQL MongoDB, CRUD (11) | Tiers are full Create-Read-Update-Delete. |
| `/api/...` URLs with GET/POST/PUT/DELETE | SOA, Web services, RESTful services (13) | Each resource has its own URL; the verb says the action. Stripe itself is a web service we call. |
| `.env` files, `.gitignore`, CORS origin, Vite proxy | Deployment / server configuration (14) | Secrets and settings stay out of the code. |
| bcrypt hashes, JWT signatures, role checks, price read from DB, file type/size check, React escaping text | Security (14–15) | Never trust the browser; never store real passwords. |
| Stripe Elements: card number goes straight to Stripe over HTTPS | Security: SSL / certificates (14) | Our server never sees card numbers. |

**Escrow flow:** `capture_method: "manual"` makes Stripe only *authorize* the card (hold). `capture` takes the money, `cancel` releases it.
Note: Stripe keeps a card hold for about **7 days**, so approve or reject new bookings within a week.
