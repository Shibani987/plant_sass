import mongoose from "mongoose";

const trendyContentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    itemId: { type: Number, required: true },
    image: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    reverse: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("TrendyContent", trendyContentSchema);