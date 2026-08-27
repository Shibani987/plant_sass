# Plant SaaS E-Commerce Platform

A multi-tenant plant e-commerce SaaS platform. The original static storefront is still available as the public landing page, and the app now includes customer shopping, vendor inventory management, super admin oversight, tenant-aware backend APIs, payments, uploads, email hooks, and analytics.

## Tech Stack

- Frontend: React, Redux Toolkit, React Router DOM, Tailwind CSS, Recharts
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Integrations: Razorpay, Cloudinary, Nodemailer
- Security: JWT, Bcrypt.js, Helmet.js, RBAC middleware

## Main Features

- Customer registration, login, product marketplace, cart, checkout, and order history
- Vendor registration with automatic store creation
- Vendor dashboard with revenue cards, chart, product creation, inventory table, and orders
- Super admin dashboard with platform analytics and vendor store approval/suspension
- Tenant isolation through store-scoped products, orders, analytics, and vendor authorization
- Razorpay Checkout order creation and signature verification
- Cloudinary upload routes for product/store media
- Nodemailer order confirmation utility

## Setup

```bash
npm install
copy .env.example .env
npm run seed:admin
npm run dev:full
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5000`.

## Useful Scripts

```bash
npm run dev
npm run server:dev
npm run dev:full
npm run build
npm run lint
npm run seed:admin
```

## Important Environment Notes

- `MONGO_URI` is required for backend data.
- `JWT_SECRET` should be changed before deployment.
- Razorpay, Cloudinary, and SMTP keys are optional for local UI testing, but required for real payment, upload, and email delivery.
- New vendor stores start as `pending`; a super admin must mark them `active` before their products appear publicly.
- Set `CLIENT_URL` to the deployed frontend URL and `VITE_API_URL` to the deployed backend API URL before building for Vercel.
- Configure the Razorpay webhook endpoint as `https://your-api-domain.com/api/payments/razorpay/webhook` and copy its secret to `RAZORPAY_WEBHOOK_SECRET`.
- Order creation uses a MongoDB transaction for stock reservation, so production MongoDB must support transactions (MongoDB Atlas does).
- Use production Razorpay keys only in the deployed backend environment. Never commit `.env`; rotate any credentials exposed during local setup.

## Git, CI/CD, and Deployment

This repository contains the frontend and backend in one Vercel project:

- Vercel: deploys the React frontend and the Express API. `api/[...path].js` exposes the backend under `/api/*`, while `vercel.json` keeps React Router fallback working.
- Render: `render.yaml` remains available as an alternative backend deployment. MongoDB, Razorpay, Cloudinary, and SMTP remain server-side environment variables.
- GitHub Actions: `.github/workflows/ci.yml` runs lint, frontend build, and production dependency audit on every pull request and `main` push.

### First GitHub push

```bash
git add .
git commit -m "Prepare Plant SaaS for deployment"
git push -u origin main
```

Never add `.env` to Git. The current `.env` is ignored, but any credentials previously exposed outside GitHub should be rotated before launch.

### Deployment order

1. Push the repository to GitHub and wait for the Actions workflow to pass.
2. Import the repository into Vercel with the project root as the Root Directory.
3. Add all backend variables from `.env.example` to Vercel. Set `CLIENT_URL` to the Vercel URL and `VITE_API_URL` to `/api`.
4. Deploy. Test `https://your-project.vercel.app/api/health` before testing login or checkout.
5. Configure Razorpay's webhook to `https://your-project.vercel.app/api/payments/razorpay/webhook`.
