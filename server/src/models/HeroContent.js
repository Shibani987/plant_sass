import mongoose from "mongoose";

const heroContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "featured", unique: true },
    plantId: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("HeroContent", heroContentSchema);