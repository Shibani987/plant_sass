import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import o2Routes from "./routes/o2Routes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import trendyRoutes from "./routes/trendyRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use("/api", apiLimiter);
app.use(express.json({
  limit: "2mb",
  verify: (req, _res, buffer) => {
    if (req.originalUrl === "/api/payments/razorpay/webhook") req.rawBody = Buffer.from(buffer);
  },
}));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "plant-saas-api" });
});

app.get("/api", (_req, res) => {
  res.json({ ok: true, service: "plant-saas-api", health: "/api/health" });
});

app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/trendy", trendyRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/o2", o2Routes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
