import mongoose from "mongoose";

const o2ContentSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description1: { type: String, required: true },
    description2: { type: String, required: true },
    image: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

o2ContentSchema.index({ store: 1, displayOrder: 1 });

o2ContentSchema.index({ isPublished: 1, displayOrder: 1 });

export default mongoose.model("O2Content", o2ContentSchema);
