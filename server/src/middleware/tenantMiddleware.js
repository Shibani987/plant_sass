import asyncHandler from "express-async-handler";
import Store from "../models/Store.js";

export const loadVendorStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findOne({ owner: req.user._id });

  if (!store) {
    res.status(404);
    throw new Error("Vendor store not found");
  }

  req.store = store;
  next();
});

export const ensureStoreAccess = asyncHandler(async (req, res, next) => {
  if (req.user.role === "super_admin") return next();

  const store = await Store.findById(req.params.storeId || req.body.storeId);
  if (!store || String(store.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Store access denied");
  }

  req.store = store;
  next();
});
