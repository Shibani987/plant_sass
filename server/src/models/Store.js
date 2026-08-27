import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: String,
    logoUrl: String,
    bannerUrl: String,
    status: { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    address: {
      city: String,
      country: String,
    },
    settings: {
      currency: { type: String, default: "USD" },
      supportEmail: String,
    },
  },
  { timestamps: true },
);

storeSchema.index({ owner: 1, status: 1 });

export default mongoose.model("Store", storeSchema);
