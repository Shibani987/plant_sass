import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

await connectDb();

const email = process.env.ADMIN_EMAIL || "admin@example.com";
const password = process.env.ADMIN_PASSWORD || "admin123";
const name = process.env.ADMIN_NAME || "Super Admin";

const existing = await User.findOne({ email });

if (existing) {
  existing.role = "super_admin";
  existing.name = name;
  if (password) existing.password = password;
  await existing.save();
  console.log(`Updated super admin: ${email}`);
} else {
  await User.create({ name, email, password, role: "super_admin" });
  console.log(`Created super admin: ${email}`);
}

process.exit(0);
