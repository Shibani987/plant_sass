import express from "express";
import asyncHandler from "express-async-handler";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { loadVendorStore } from "../middleware/tenantMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import User from "../models/User.js";

const router = express.Router();

const revenuePipeline = (match) => [
  { $match: match },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      revenue: { $sum: "$totals.grandTotal" },
      orders: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
];

router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const [products, orders, revenue, timeseries] = await Promise.all([
      Product.countDocuments({ store: req.store._id }),
      Order.countDocuments({ store: req.store._id }),
      Order.aggregate([{ $match: { store: req.store._id, "payment.status": "paid" } }, { $group: { _id: null, total: { $sum: "$totals.grandTotal" } } }]),
      Order.aggregate(revenuePipeline({ store: req.store._id, "payment.status": "paid" })),
    ]);

    res.json({
      cards: {
        products,
        orders,
        revenue: revenue[0]?.total || 0,
        storeStatus: req.store.status,
      },
      timeseries,
    });
  }),
);

router.get(
  "/admin",
  protect,
  authorize("super_admin"),
  asyncHandler(async (_req, res) => {
    const [vendors, customers, stores, products, orders, revenue, timeseries] = await Promise.all([
      User.countDocuments({ role: "vendor" }),
      User.countDocuments({ role: "customer" }),
      Store.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { "payment.status": "paid" } }, { $group: { _id: null, total: { $sum: "$totals.grandTotal" } } }]),
      Order.aggregate(revenuePipeline({ "payment.status": "paid" })),
    ]);

    res.json({
      cards: {
        vendors,
        customers,
        stores,
        products,
        orders,
        revenue: revenue[0]?.total || 0,
      },
      timeseries,
    });
  }),
);

export default router;
