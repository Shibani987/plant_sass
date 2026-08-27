import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { loadVendorStore } from "../middleware/tenantMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

const hydrateItems = async (items, session) => {
  if (!Array.isArray(items) || !items.length || items.some((item) => !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1)) {
    throw new Error("Each product quantity must be a positive whole number");
  }

  const productIds = items.map((item) => item.product);
  if (new Set(productIds.map(String)).size !== productIds.length) {
    throw new Error("Duplicate products are not allowed in an order");
  }

  const products = await Product.find({ _id: { $in: productIds }, isPublished: true }).populate("store").session(session);

  if (products.length !== items.length) {
    throw new Error("One or more products are unavailable");
  }

  const storeId = String(products[0].store._id);
  if (!products.every((product) => product.store?.status === "active" && String(product.store._id) === storeId)) {
    throw new Error("Checkout supports one vendor store per order");
  }

  return {
    store: products[0].store,
    items: items.map((item) => {
      const product = products.find((entry) => String(entry._id) === String(item.product));
      return {
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        quantity: Number(item.quantity),
        price: product.price,
      };
    }),
  };
};

router.post(
  "/",
  protect,
  authorize("customer"),
  asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    let order;
    let store;

    try {
      await session.withTransaction(async () => {
        const hydrated = await hydrateItems(req.body.items || [], session);
        store = hydrated.store;
        const items = hydrated.items;
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal > 7500 ? 0 : 80;
        const tax = Number((subtotal * 0.05).toFixed(2));

        for (const item of items) {
          const result = await Product.updateOne(
            { _id: item.product, store: store._id, isPublished: true, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { session },
          );
          if (result.modifiedCount !== 1) throw new Error(`${item.name} is out of stock`);
        }

        [order] = await Order.create([{
          store: store._id,
          customer: req.user._id,
          items,
          totals: {
            subtotal,
            shipping,
            tax,
            grandTotal: subtotal + shipping + tax,
          },
          shippingAddress: req.body.shippingAddress,
        }], { session });
      });
    } finally {
      await session.endSession();
    }

    await sendEmail({
      to: req.body.shippingAddress?.email || req.user.email,
      subject: "Order received",
      html: `<p>Your order ${order._id} has been received by ${store.name}.</p>`,
    });

    res.status(201).json(order);
  }),
);

router.get(
  "/mine",
  protect,
  authorize("customer"),
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ customer: req.user._id }).populate("store", "name slug").sort("-createdAt");
    res.json(orders);
  }),
);

router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ store: req.store._id }).populate("customer", "name email").sort("-createdAt");
    res.json(orders);
  }),
);

router.get(
  "/admin",
  protect,
  authorize("super_admin"),
  asyncHandler(async (_req, res) => {
    const orders = await Order.find().populate("store", "name slug").populate("customer", "name email").sort("-createdAt");
    res.json(orders);
  }),
);

router.patch(
  "/:id/status",
  protect,
  authorize("vendor", "super_admin"),
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("store");
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (req.user.role !== "super_admin" && String(order.store.owner) !== String(req.user._id)) {
      res.status(403);
      throw new Error("Order access denied");
    }

    order.status = req.body.status;
    await order.save();
    res.json(order);
  }),
);

export default router;
