import crypto from "node:crypto";
import dotenv from "dotenv";
import express from "express";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import { authorize, protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();
dotenv.config();

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

router.post(
  "/razorpay/order",
  protect,
  authorize("customer"),
  asyncHandler(async (req, res) => {
    if (!razorpay) {
      res.status(503);
      throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env");
    }

    const order = await Order.findById(req.body.orderId);
    if (!order || String(order.customer) !== String(req.user._id)) {
      res.status(404);
      throw new Error("Order not found");
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totals.grandTotal * 100),
      currency: "INR",
      receipt: String(order._id),
    });

    order.payment.provider = "razorpay";
    order.payment.intentId = razorpayOrder.id;
    order.payment.gatewayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      localOrderId: String(order._id),
    });
  }),
);

router.post(
  "/razorpay/verify",
  protect,
  authorize("customer"),
  asyncHandler(async (req, res) => {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpay || !process.env.RAZORPAY_KEY_SECRET) {
      res.status(503);
      throw new Error("Razorpay is not configured");
    }

    const order = await Order.findById(orderId);

    if (!order || String(order.customer) !== String(req.user._id)) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (!razorpayOrderId || razorpayOrderId !== order.payment.gatewayOrderId) {
      res.status(400);
      throw new Error("Payment order does not match this order");
    }

    const digest = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    const receivedSignature = Buffer.from(razorpaySignature || "");

    if (receivedSignature.length !== Buffer.byteLength(digest) || !crypto.timingSafeEqual(Buffer.from(digest), receivedSignature)) {
      res.status(400);
      throw new Error("Invalid Razorpay payment signature");
    }

    order.status = "confirmed";
    order.payment.provider = "razorpay";
    order.payment.intentId = razorpayPaymentId;
    order.payment.status = "paid";
    await order.save();
    res.json({ verified: true, orderId: String(order._id) });
  }),
);

router.post(
  "/razorpay/webhook",
  asyncHandler(async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret || !req.rawBody || typeof signature !== "string") {
      res.status(503);
      throw new Error("Razorpay webhook is not configured");
    }

    const digest = crypto.createHmac("sha256", webhookSecret).update(req.rawBody).digest("hex");
    const receivedSignature = Buffer.from(signature);
    const expectedSignature = Buffer.from(digest);
    if (receivedSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(expectedSignature, receivedSignature)) {
      res.status(400);
      throw new Error("Invalid Razorpay webhook signature");
    }

    const event = JSON.parse(req.rawBody.toString("utf8"));
    if (["payment.captured", "order.paid"].includes(event.event)) {
      const payment = event.payload?.payment?.entity;
      const gatewayOrderId = payment?.order_id || event.payload?.order?.entity?.id;
      if (gatewayOrderId) {
        await Order.findOneAndUpdate(
          { "payment.gatewayOrderId": gatewayOrderId },
          {
            status: "confirmed",
            "payment.status": "paid",
            ...(payment?.id ? { "payment.intentId": payment.id } : {}),
          },
        );
      }
    }

    res.json({ received: true });
  }),
);

export default router;
