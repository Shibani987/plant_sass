import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Store from "../models/Store.js";
import { protect } from "../middleware/authMiddleware.js";
import { signToken } from "../utils/token.js";

const router = express.Router();

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, role = "customer", storeName } = req.body;

    if (!["vendor", "customer"].includes(role)) {
      res.status(400);
      throw new Error("Only vendor or customer registration is allowed");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error("Email already registered");
    }

    const user = await User.create({ name, email, password, role });

    let store = null;
    if (role === "vendor") {
      const slug = `${storeName || name}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      store = await Store.create({
        owner: user._id,
        name: storeName || `${name}'s Store`,
        slug,
        description: "Fresh plants and garden essentials.",
        status: "pending",
        settings: { supportEmail: email },
      });
    }

    res.status(201).json({ user: publicUser(user), store, token: signToken(user) });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const store = user.role === "vendor" ? await Store.findOne({ owner: user._id }) : null;
    res.json({ user: publicUser(user), store, token: signToken(user) });
  }),
);

router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const store = req.user.role === "vendor" ? await Store.findOne({ owner: req.user._id }) : null;
    res.json({ user: publicUser(req.user), store });
  }),
);

export default router;
