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

This repository contains both applications:

- Vercel: deploys the React frontend from the repository root using `vercel.json`.
- Render: deploys the Express API using `render.yaml`. MongoDB, Razorpay, Cloudinary, and SMTP remain backend environment variables.
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
2. Create a Render Web Service from the repository. Render can use `render.yaml`, then set all `sync: false` values in the service environment.
3. Set the deployed Render API URL as Vercel's `VITE_API_URL` and deploy the project root.
4. Set the Render `CLIENT_URL` to the final Vercel URL.
5. Configure Razorpay's webhook to `https://your-api-domain.com/api/payments/razorpay/webhook`.
