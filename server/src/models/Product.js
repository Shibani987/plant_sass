import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: String,
    sku: String,
    price: Number,
    stock: { type: Number, default: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    category: { type: String, default: "Plants", index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: [String],
    tags: { type: [String], default: [] },
    variants: [variantSchema],
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

productSchema.index({ store: 1, name: 1 });
productSchema.index({ store: 1, isPublished: 1 });

export default mongoose.model("Product", productSchema);
