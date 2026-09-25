# Field Operations Management & Verification Platform

![توثيق إدارة العمليات الميدانية](./توثيق-إدارة-العمليات-الميدانية.png)

An Arabic-first, RTL platform for recording field operations, issuing QR-verified electronic receipts, and monitoring current operational data through a dashboard with a public no-login verification portal.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.13-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.22.3-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma%20datasource-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.11-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Overview

Field Operations Management & Verification Platform (منصة توثيق العمليات الميدانية) is a full-stack MVP for organizations that need to capture field activity and produce verifiable electronic receipts. The Arabic-first frontend is RTL and provides public pages alongside authenticated field and administration workflows.

An authenticated field user records an operation from the field. The backend assigns a unique receipt number, generates a QR code containing the verification URL, and exposes the receipt for viewing or PDF download. Anyone can verify a receipt by entering its number or opening the QR link without logging in. Authenticated users can view operations and dashboard metrics; administrators can manage users, services, announcements, and reports.

## Key Features

- JWT authentication with server-side role-based access control for `SUPER_ADMIN`, `ADMIN`, and `FIELD_USER`, plus public unauthenticated verification.
- Mobile-oriented field entry form using active services from the backend.
- Concurrency-safe, year-scoped receipt numbering using a locked `ReceiptSequence` row, for example `RCP-2026-000001`.
- QR code generation for each receipt and printable receipt views.
- Public verification portal at `/verify` and `/verify/[receiptNumber]`; verification attempts are logged.
- Authenticated dashboard with current summary metrics and Recharts trend and distribution charts.
- Filtered report summary with Excel and PDF export for administrators.
- User, service, and announcement management screens and REST resources.
- Arabic RTL user interface, Arabic validation messages, and Arabic receipt/report PDF rendering.

## Tech Stack

| Area | Exact packages and technologies |
|---|---|
| Frontend | Next.js `14.2.13`, React `18.3.1`, TypeScript `5.6.2`, Tailwind CSS `3.4.11`, Recharts `2.12.7`, React Hook Form `7.53.0`, `@hookform/resolvers` `3.9.0`, Zod `3.23.8`, Axios `1.7.7`, Lucide React `0.445.0` |
| Backend | Node.js, Express `4.22.3`, TypeScript `5.6.2`, `dotenv` `16.4.5`, `cookie-parser` `^1.4.7`, `express-rate-limit` `7.4.0`, Helmet `7.1.0`, CORS `2.8.5` |
| Database | PostgreSQL through Prisma ORM `5.20.0` and `@prisma/client` `5.20.0` |
| Security | `bcryptjs` `2.4.3`, `jsonwebtoken` `9.0.2`, Zod `3.23.8`, Helmet `7.1.0`, CORS `2.8.5`, `express-rate-limit` `7.4.0`, `cookie-parser` `^1.4.7` |
| Exports | ExcelJS `^3.4.0`, PDFKit `0.15.0`, `qrcode` `1.5.4` |

## Architecture

The backend follows a clean layered flow:

`routes -> controllers -> services -> repositories -> Prisma -> PostgreSQL`

Routes register HTTP endpoints and middleware. Controllers parse requests and produce responses. Services contain business rules such as receipt creation, verification, and exports. Repositories own Prisma queries. Validators define Zod input schemas, while shared middleware handles authentication, authorization, rate limiting, and errors.

The frontend uses Next.js App Router pages under `app/`, reusable UI and layout components under `components/`, feature-specific UI under `features/`, data hooks under `hooks/`, and API/auth/formatting utilities under `lib/`.

```text
project-root/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── assets/fonts/Cairo-Regular.ttf
│       ├── config/                 # environment and Prisma client
│       ├── controllers/            # HTTP request handlers
│       ├── middleware/             # auth and centralized errors
│       ├── prisma/seed.ts
│       ├── repositories/           # database access
│       ├── routes/                 # REST route registration
│       ├── services/               # business logic and exports
│       ├── utils/                  # JWT, QR, receipt, PDF, Excel, formatting
│       └── validators/             # Zod request schemas
├── frontend/
│   ├── app/
│   │   ├── dashboard/{announcements,operations,reports,services,settings,users}/
│   │   ├── field/{new-operation,operations}/
│   │   ├── login/
│   │   └── verify/[receiptNumber]/
│   ├── components/{charts,layout,ui}/
│   ├── features/{announcements,auth,dashboard,operations,verification}/
│   ├── hooks/                       # dashboard, operation, service data hooks
│   ├── lib/                         # API client, auth, toast, formatting
│   └── types/
└── README.md
```

## Screenshots

Replace the placeholders below with repository images or hosted screenshots.

| Screen | Screenshot |
|---|---|
| Homepage | ![Homepage](./home-page.png) |
| Login | ![Login](./login-page.png) |
| Field entry form | ![Field entry form](./Field-entry-form.png) |
| Receipt with QR | ![Receipt with QR](./Receipt-with-QR.png) |
| Dashboard | ![Dashboard](./dashboard-page.png) |
| Verification portal | ![Verification portal](./verification-portal.png) |

## Getting Started

### Prerequisites

- Node.js 20 or newer
- PostgreSQL
- npm

### Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fieldops?schema=public"
JWT_SECRET="change-this-to-a-long-random-string-in-production"
JWT_EXPIRES_IN="8h"
JWT_COOKIE_NAME="fieldops_token"
FRONTEND_URL="http://localhost:3000"
PUBLIC_APP_URL="http://localhost:3000"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
```

Create `frontend/.env.local` from `frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

`DATABASE_URL` and `JWT_SECRET` are required by the backend configuration. `PUBLIC_APP_URL` is used when building receipt verification URLs. `FRONTEND_URL` configures credentialed CORS.

### Database Setup

```bash
cd backend
npm install
npx prisma generate
npm run prisma:migrate -- --name init
npm run seed
```

The seed creates three demo users, five services, two announcements, and 40 sample operations when the database has no operations. The seed command is idempotent for users and services.

### Run Locally

Run each application in a separate terminal:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:4000` and the frontend on `http://localhost:3000` by default. The backend health endpoint is `GET /health`.

## API Overview

All paths below are relative to the backend API base URL, normally `http://localhost:4000/api`. `Public` means no JWT is required. Other endpoints require authentication, with additional role gates shown where applicable.

| Resource | Method | Endpoint | Access |
|---|---:|---|---|
| Auth | POST | `/auth/login` | Public |
| Auth | POST | `/auth/logout` | Public |
| Auth | GET | `/auth/me` | Authenticated |
| Users | GET, POST | `/users` | `SUPER_ADMIN` |
| Users | PUT | `/users/:id` | `SUPER_ADMIN` |
| Users | POST | `/users/:id/reset-password` | `SUPER_ADMIN` |
| Services | GET | `/services/active` | Authenticated |
| Services | GET, POST | `/services` | `SUPER_ADMIN` |
| Services | PUT, DELETE | `/services/:id` | `SUPER_ADMIN` |
| Operations | GET | `/operations`, `/operations/:id` | Authenticated |
| Operations | GET | `/operations/:id/receipt`, `/operations/:id/receipt/pdf` | Authenticated |
| Operations | POST | `/operations` | Authenticated; service rules apply |
| Operations | PUT | `/operations/:id` | `SUPER_ADMIN`, `ADMIN`, `FIELD_USER` |
| Operations | DELETE | `/operations/:id` | `SUPER_ADMIN`, `ADMIN` |
| Dashboard | GET | `/dashboard/summary` | Authenticated |
| Dashboard | GET | `/dashboard/operations-trend` | Authenticated |
| Dashboard | GET | `/dashboard/revenue-trend` | Authenticated |
| Dashboard | GET | `/dashboard/service-distribution` | Authenticated |
| Dashboard | GET | `/dashboard/status-distribution` | Authenticated |
| Announcements | GET | `/announcements/public` | Public |
| Announcements | GET, POST | `/announcements` | `SUPER_ADMIN` |
| Announcements | PUT, DELETE | `/announcements/:id` | `SUPER_ADMIN` |
| Verification | GET | `/verification/:receiptNumber` | Public |
| Reports | GET | `/reports/summary` | `SUPER_ADMIN`, `ADMIN` |
| Reports | GET | `/reports/export/excel` | `SUPER_ADMIN`, `ADMIN` |
| Reports | GET | `/reports/export/pdf` | `SUPER_ADMIN`, `ADMIN` |

## Demo Accounts

The seed script creates these accounts. All three use the password `Demo@12345`.

| Role | Email |
|---|---|
| `SUPER_ADMIN` | `admin@example.com` |
| `ADMIN` | `supervisor@example.com` |
| `FIELD_USER` | `field@example.com` |

Change or remove these credentials before production use.

## Deployment

### Frontend on Vercel

Deploy the `frontend/` directory as the project root, set `NEXT_PUBLIC_API_URL` to the deployed backend `/api` URL, and deploy with the existing Next.js build configuration.

### Backend on Render or another Node host

Provision managed PostgreSQL and set the backend environment variables, especially `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and `PUBLIC_APP_URL`. Build with:

```bash
npm install
npx prisma generate
npm run build
```

Run migrations during the release/deploy step with `npm run prisma:deploy`, then start with `npm start`. Configure the host's public port through `PORT` and ensure `FRONTEND_URL` exactly matches the deployed frontend origin because the API uses credentialed CORS.

## Security Notes

- Passwords are hashed with `bcryptjs` using cost factor 12.
- JWTs are signed with `jsonwebtoken`, checked for expiry, and loaded against the database so inactive users are rejected. Browser clients receive an httpOnly cookie; a Bearer token is also accepted.
- Backend middleware enforces roles independently of frontend visibility: `SUPER_ADMIN`, `ADMIN`, and `FIELD_USER` gates are applied in route and service flows.
- Helmet adds HTTP security headers, and CORS is configured for the single `FRONTEND_URL` origin with credentials.
- `express-rate-limit` applies a global API limit and a stricter 20-request/15-minute limit to login.
- Zod schemas validate request input, and the centralized error handler maps validation and known Prisma errors without exposing stack traces or raw SQL details.
- Verification responses are built from a public-safe receipt payload, while every verification attempt is recorded with receipt number, result, IP address, and user agent when available.


