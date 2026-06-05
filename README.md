# AI Buttons — MERN Daily Animated Button Generator

A full-stack MERN app that uses **Google Gemini** to generate **25 fresh animated CSS buttons every day**, merges them with previous collections, and lets users browse, filter by category, like, and add buttons to a flip-card cart that shows the source code on the back.

> Stack: **MongoDB Atlas · Express · React (Vite) · Tailwind CSS · Node-Cron · JWT · DOMPurify · Gemini API**

---

## ✨ Features

- 🤖 **Daily AI generation** — Node-Cron triggers Gemini at 00:05 server time and produces 25 new buttons.
- 🛡️ **Safety pipeline** — every AI output is validated, sanitized (DOMPurify + CSS whitelist), and falls back to yesterday's set if generation fails.
- 🗂️ **Categories** — hover, gradient, 3d, neon, glassmorphism, ripple, morph, outline, social, loader.
- ❤️ **Likes + Cart** — JWT-protected; cart uses a CSS flip animation (preview on front, full code on back).
- ⚡ **Performance** — Mongo indexes on `createdAt`, `category`, `likes`; lazy-loaded previews; pure-CSS animations.
- 🔐 **Security** — bcrypt password hashing, JWT auth middleware, express-rate-limit, helmet, input escaping, output sanitization.
- 👑 **Admin** — approve/reject queue + analytics on likes & cart adds.
- ☁️ **Free-tier ready** — Vercel (client) + Render (server) + Mongo Atlas free cluster.

---

## 📁 Project Layout

```
ai-buttons/
├── server/                  # Express API
│   ├── src/
│   │   ├── config/          # db + env
│   │   ├── models/          # Mongoose schemas (User, Button)
│   │   ├── middleware/      # auth, errors, rate-limit
│   │   ├── routes/          # auth, buttons, cart, admin
│   │   ├── controllers/     # business logic
│   │   ├── services/        # geminiService, sanitizer, fallback
│   │   ├── jobs/            # daily cron
│   │   └── utils/           # templates, validators, seed
│   ├── package.json
│   └── .env.example
└── client/                  # React + Vite + Tailwind
    ├── src/
    │   ├── components/      # ButtonCard, FlipCard, Navbar, Filters
    │   ├── pages/           # Home, Categories, Cart, Login, Register, Admin
    │   ├── context/         # AuthContext, CartContext
    │   ├── hooks/           # useButtons, useApi
    │   └── utils/           # api client
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env       # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run seed               # optional: seeds 25 starter buttons
npm run dev                # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                # http://localhost:5173
```

---

## 🔑 Environment Variables (`server/.env`)

| Key                 | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `PORT`              | API port (default 5000)                            |
| `MONGO_URI`         | Mongo Atlas connection string                      |
| `JWT_SECRET`        | Secret for signing tokens                          |
| `GEMINI_API_KEY`    | Google AI Studio key                               |
| `CRON_SCHEDULE`     | Cron expression, default `5 0 * * *`               |
| `CLIENT_ORIGIN`     | CORS origin, default `http://localhost:5173`      |
| `ADMIN_EMAIL`       | Email that gets `isAdmin: true` on register        |

---

## 🛠 API Routes

| Method | Path                       | Auth | Purpose                              |
| ------ | -------------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/register`       | ❌   | Create account                        |
| POST   | `/api/auth/login`          | ❌   | Returns JWT                           |
| GET    | `/api/auth/me`             | ✅   | Current user                          |
| GET    | `/api/buttons`             | ❌   | Newest 25                             |
| GET    | `/api/buttons/all?page=n`  | ❌   | Paginated older sets (25/page)        |
| GET    | `/api/buttons/category/:c` | ❌   | Filter by category                    |
| POST   | `/api/buttons/:id/like`    | ✅   | Toggle like                           |
| POST   | `/api/cart/add`            | ✅   | Add button to cart                    |
| POST   | `/api/cart/remove`         | ✅   | Remove from cart                      |
| GET    | `/api/cart`                | ✅   | Get populated cart                    |
| POST   | `/api/admin/generate`      | 👑   | Manually trigger daily generation     |
| GET    | `/api/admin/pending`       | 👑   | Approval queue                        |
| POST   | `/api/admin/:id/approve`   | 👑   | Approve button                        |
| DELETE | `/api/admin/:id`           | 👑   | Reject/delete                         |

---

## 🚢 Deployment

- **Frontend** → Vercel (root: `client/`, build: `npm run build`, output: `dist`)
- **Backend** → Render web service (root: `server/`, start: `npm start`)
- **DB** → MongoDB Atlas free M0
- Add env vars in dashboards. Set `CLIENT_ORIGIN` to your Vercel URL.

---

## 🧠 How the daily generation works

```
00:05  ─►  cron fires  ─►  geminiService.generateButtons(25)
                                │
                                ├─ JSON-parse + schema validate
                                ├─ sanitizeCSS  (whitelist props)
                                ├─ sanitizeHTML (DOMPurify, no <script>)
                                ├─ on failure  ──► reuse last good batch
                                └─ insert with batchDate = today
```

The Home page simply queries `find().sort({ createdAt: -1 }).limit(25)` so the newest batch always floats to the top.

---

## 🗺 Roadmap

- Community submissions w/ moderation queue
- Social share cards (OG image of preview)
- Premium tier: bundle download, advanced effects
- Docker + GitHub Actions CI/CD
