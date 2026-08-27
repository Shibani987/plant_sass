import express from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import TrendyContent from "../models/TrendyContent.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await TrendyContent.find().sort({ createdAt: 1 }).lean());
  }),
);

router.post(
  "/upload",
  protect,
  authorize("super_admin"),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Image file required");
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "plant-saas/trendy" });
    res.status(201).json({ url: uploadResult.secure_url });
  }),
);

router.post(
  "/",
  protect,
  authorize("super_admin"),
  asyncHandler(async (req, res) => {
    const { itemId, image, alt, title, description, price, reverse = false } = req.body;

    if (!Number.isInteger(Number(itemId)) || !image?.trim() || !alt?.trim() || !title?.trim() || !description?.trim() || !price?.trim()) {
      res.status(400);
      throw new Error("itemId, image, alt, title, description and price are required");
    }

    const content = await TrendyContent.create({
      key: `trendy-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      itemId: Number(itemId),
      image,
      alt,
      title,
      description,
      price,
      reverse: Boolean(reverse),
    });
    res.status(201).json(content);
  }),
);

router.delete(
  "/:id",
  protect,
  authorize("super_admin"),
  asyncHandler(async (req, res) => {
    const content = await TrendyContent.findByIdAndDelete(req.params.id);
    if (!content) {
      res.status(404);
      throw new Error("Trendy plant not found");
    }
    res.json({ deleted: true });
  }),
);

export default router;