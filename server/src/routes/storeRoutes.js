import express from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import Store from "../models/Store.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const stores = await Store.find({ status: "active" }).populate("owner", "name email");
    res.json(stores);
  }),
);

router.get(
  "/mine",
  protect,
  authorize("vendor"),
  asyncHandler(async (req, res) => {
    const store = await Store.findOne({ owner: req.user._id });
    res.json(store);
  }),
);

router.get(
  "/admin/all",
  protect,
  authorize("super_admin"),
  asyncHandler(async (_req, res) => {
    const stores = await Store.find().populate("owner", "name email");
    res.json(stores);
  }),
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const store = await Store.findOne({ slug: req.params.slug, status: "active" });
    if (!store) {
      res.status(404);
      throw new Error("Store not found");
    }
    res.json(store);
  }),
);

router.put(
  "/mine",
  protect,
  authorize("vendor"),
  asyncHandler(async (req, res) => {
    const store = await Store.findOneAndUpdate(
      { owner: req.user._id },
      {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        settings: req.body.settings,
      },
      { new: true, runValidators: true },
    );
    res.json(store);
  }),
);

router.post(
  "/mine/media",
  protect,
  authorize("vendor"),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Image file required");
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "plant-saas/stores" });
    res.status(201).json({ url: uploadResult.secure_url });
  }),
);

router.patch(
  "/:id/status",
  protect,
  authorize("super_admin"),
  asyncHandler(async (req, res) => {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    res.json(store);
  }),
);

export default router;
