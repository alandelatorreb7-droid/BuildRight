# BuildRight — Construction Cost Estimator

A full-stack construction cost estimator for **El Paso, TX** with 2024–2025 market prices.

**Stack:** React + Vite · Node.js + Express · PostgreSQL

---

## Features

- **Public quoting tool** — browse 11 categories, add items with quantities, subtotals by Materials / Labor / Other
- **Profit margin slider** — adjustable 0–50%
- **Print & clipboard export** of complete quote
- **Cubic yard calculator** built into the Concrete section
- **Admin panel** at `/admin` — add, edit, delete, and toggle items without touching code
- **150+ line items** seeded with El Paso 2024–2025 pricing

---

## Quick Start (Local)

### 1 — Prerequisites

- Node.js 18+
- PostgreSQL 15+ running locally

### 2 — Create the database

```
psql -U postgres -c "CREATE DATABASE buildright;"
```

### 3 — Configure server environment

```
cd server
copy .env.example .env
```

Edit `server/.env`:

```
DATABASE_URL=postgresql://postgres:YOUR_PG_PASSWORD@localhost:5432/buildright
PORT=3001
ADMIN_PASSWORD=buildright2024
CLIENT_URL=http://localhost:5173
```

### 4 — Install dependencies & seed the database

```
cd server
npm install
npm run db:setup
```

### 5 — Start the API server

```
npm run dev
```

API will be at `http://localhost:3001`

### 6 — Start the React client (new terminal)

```
cd client
npm install
npm run dev
```

App will be at `http://localhost:5173`

---

## Admin Panel

Go to `http://localhost:5173/admin` and enter the password from `ADMIN_PASSWORD` in `server/.env`.

Default password: **buildright2024**

From the admin panel you can:
- Add new price items
- Edit name, price, unit, category, type, description
- Toggle items active/hidden
- Delete items

---

## Project Structure

```
BuildRight/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuotePage.jsx         # Main estimator page
│   │   │   ├── QuoteBuilder.jsx      # Quote cart + totals
│   │   │   ├── ConcreteCalculator.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── Header.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── server/               # Express API
│   ├── db/
│   │   ├── schema.sql    # Table definitions
│   │   ├── seed.sql      # El Paso pricing data
│   │   ├── setup.js      # Run schema + seed
│   │   └── index.js      # pg Pool
│   ├── routes/
│   │   ├── items.js
│   │   ├── categories.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## Deploying to Production

### Option A — Railway (easiest)

1. Push repo to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Add a PostgreSQL plugin
4. Deploy the `server/` folder as a Node service, set `DATABASE_URL` from Railway's env
5. Deploy `client/` as a Static site (build command: `npm run build`, publish dir: `dist`)
6. Set `VITE_API_URL` or update the Vite proxy to point at your Railway API URL

### Option B — VPS (DigitalOcean / Linode)

1. Install Node.js + PostgreSQL on server
2. Clone repo, run `npm run db:setup` in `server/`
3. Use PM2 to run the API: `pm2 start server/index.js --name buildright-api`
4. Build client: `cd client && npm run build`
5. Serve `client/dist/` with Nginx, proxy `/api` to `localhost:3001`

### Nginx proxy snippet

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
}
location / {
    root /var/www/buildright/client/dist;
    try_files $uri /index.html;
}
```

---

## Changing the Admin Password

Edit `ADMIN_PASSWORD` in `server/.env` and restart the server. No database change needed.

---

## Adding More Price Items

Either use the Admin panel at `/admin`, or add rows directly to the seed file and re-run:

```
cd server && npm run db:setup
```

> ⚠️ `db:setup` truncates and re-seeds all data. Back up any admin-entered items first.

---

*Prices are estimates based on El Paso, TX market conditions 2024–2025. Always verify with local suppliers and subcontractors.*
