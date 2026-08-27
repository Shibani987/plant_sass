import express from "express";
import asyncHandler from "express-async-handler";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { loadVendorStore } from "../middleware/tenantMiddleware.js";
import O2Content from "../models/O2Content.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const content = await O2Content.find({ isPublished: true })
      .populate("store", "name")
      .sort({ displayOrder: 1, createdAt: -1 });
    res.json(content);
  }),
);

router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const content = await O2Content.find({ store: req.store._id }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(content);
  }),
);

router.post(
  "/",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const content = await O2Content.create({
      store: req.store._id,
      title: req.body.title,
      description1: req.body.description1,
      description2: req.body.description2,
      image: req.body.image,
      displayOrder: req.body.displayOrder,
      isPublished: req.body.isPublished ?? true,
    });
    res.status(201).json(content);
  }),
);

router.put(
  "/:id",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const content = await O2Content.findOneAndUpdate(
      { _id: req.params.id, store: req.store._id },
      {
        title: req.body.title,
        description1: req.body.description1,
        description2: req.body.description2,
        image: req.body.image,
        displayOrder: req.body.displayOrder,
        isPublished: req.body.isPublished,
      },
      { new: true, runValidators: true },
    );
    if (!content) {
      res.status(404);
      throw new Error("O2 content not found");
    }
    res.json(content);
  }),
);

router.delete(
  "/:id",
  protect,
  authorize("vendor"),
  loadVendorStore,
  asyncHandler(async (req, res) => {
    const content = await O2Content.findOneAndDelete({ _id: req.params.id, store: req.store._id });
    if (!content) {
      res.status(404);
      throw new Error("O2 content not found");
    }
    res.json({ deleted: true });
  }),
);

export default router;
