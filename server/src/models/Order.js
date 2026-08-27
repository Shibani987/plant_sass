import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [orderItemSchema],
    totals: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      line1: String,
      city: String,
      postalCode: String,
      country: String,
    },
    payment: {
      provider: { type: String, enum: ["razorpay"], default: "razorpay" },
      intentId: String,
      gatewayOrderId: String,
      status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

orderSchema.index({ store: 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
