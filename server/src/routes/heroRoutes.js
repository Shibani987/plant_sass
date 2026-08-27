import express from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import HeroContent from "../models/HeroContent.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "plant-saas/hero" });
    res.status(201).json({ url: uploadResult.secure_url });
  }),
);

router.get(
  "/featured",
  asyncHandler(async (_req, res) => {
    const content = await HeroContent.find().sort({ createdAt: -1 }).lean();
    res.json(content);
  }),
);

router.post(
  "/featured",
  protect,
  authorize("super_admin"),
  asyncHandler(async (req, res) => {
    const { plantId, name, category, image } = req.body;

    if (!Number.isInteger(Number(plantId)) || !name?.trim() || !category?.trim() || !image?.trim()) {
      res.status(400);
      throw new Error("plantId, name, category and image are required");
    }

    const content = await HeroContent.create({
      key: `featured-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      plantId: Number(plantId),
      name,
      category,
      image,
    });
    res.status(201).json(content);
  }),
);

router.put(
  "/featured",
  protect,
  authorize("super_admin"),
  asyncHandler(async (req, res) => {
    const { plantId, name, category, image } = req.body;

    if (!Number.isInteger(Number(plantId)) || !name?.trim() || !category?.trim() || !image?.trim()) {
      res.status(400);
      throw new Error("plantId, name, category and image are required");
    }

    const content = await HeroContent.findOneAndUpdate(
      { key: "featured" },
      { key: "featured", plantId: Number(plantId), name, category, image },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    res.json(content);
  }),
);

router.delete(
  "/featured/:id",
  protect,
  authorize("super_admin"),
  asyncHandler(async (req, res) => {
    const content = await HeroContent.findByIdAndDelete(req.params.id);
    if (!content) {
      res.status(404);
      throw new Error("Featured hero plant not found");
    }
    res.json({ deleted: true });
  }),
);

export default router;