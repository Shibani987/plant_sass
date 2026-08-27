import express from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { loadVendorStore } from "../middleware/tenantMiddleware.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = { isPublished: true };
    if (req.query.store) {
      const store = await Store.findOne({ slug: req.query.store });
      filter.store = store?._id;
    }
    const products = await Product.find(filter).populate("store", "name slug status");
    res.json(products.filter((product) => product.store?.status === "active"));
  }),
);

router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const products = await Product.find({ store: req.store._id }).sort("-createdAt");
    res.set("Cache-Control", "no-store");
    res.json(products);
  }),
);

router.post(
  "/",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const product = await Product.create({
      store: req.store._id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      images: req.body.images || [],
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      variants: req.body.variants || [],
      isPublished: req.body.isPublished ?? true,
    });
    res.status(201).json(product);
  }),
);

router.post(
  "/upload",
  protect,
  authorize("vendor"),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Image file required");
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "plant-saas/products" });
    res.status(201).json({ url: uploadResult.secure_url });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("store", "name slug status");
    if (!product || !product.isPublished || product.store?.status !== "active") {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  }),
);

router.put(
  "/:id",
  protect,
  authorize("vendor", "super_admin"),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("store");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (req.user.role !== "super_admin" && String(product.store.owner) !== String(req.user._id)) {
      res.status(403);
      throw new Error("Product access denied");
    }

    Object.assign(product, req.body);
    if (Object.prototype.hasOwnProperty.call(req.body, "tags")) {
      product.tags = Array.isArray(req.body.tags) ? req.body.tags : [];
    }
    await product.save();
    res.json(product);
  }),
);

router.delete(
  "/:id",
  protect,
  authorize("vendor", "super_admin"),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("store");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (req.user.role !== "super_admin" && String(product.store.owner) !== String(req.user._id)) {
      res.status(403);
      throw new Error("Product access denied");
    }

    await product.deleteOne();
    res.json({ deleted: true });
  }),
);

export default router;
