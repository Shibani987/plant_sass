import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart, selectCartTotal } from "../../features/cart/cartSlice";
import { api, getApiError } from "../../services/api";
import { formatINR } from "../../utils/currency";

const Checkout = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Razorpay checkout could not load"));
    document.body.appendChild(script);
  });

  const submit = async (event) => {
    event.preventDefault();
    setMessage("Creating order...");
    try {
      const payload = {
        items: items
          .filter((item) => !["static-", "trendy-"].some((prefix) => String(item.id).startsWith(prefix)))
          .map((item) => ({ product: item.id, quantity: item.quantity })),
        shippingAddress: form,
      };

      if (payload.items.length) {
        const { data: order } = await api.post("/orders", payload);
        const { data: paymentOrder } = await api.post("/payments/razorpay/order", { orderId: order._id });
        await loadRazorpay();
        await new Promise((resolve, reject) => {
          const checkout = new window.Razorpay({
            key: paymentOrder.keyId,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
            name: "Plant SaaS",
            description: "Plant order payment",
            order_id: paymentOrder.orderId,
            prefill: { name: form.fullName, email: form.email, contact: form.phone },
            handler: async (response) => {
              try {
                await api.post("/payments/razorpay/verify", {
                  orderId: order._id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                dispatch(clearCart());
                setMessage("Payment successful. Your order is confirmed.");
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            modal: { ondismiss: () => reject(new Error("Payment was cancelled")) },
            theme: { color: "#3c7a3a" },
          });
          checkout.on("payment.failed", () => reject(new Error("Payment failed")));
          checkout.open();
        });
        return;
      } else {
        setMessage("Demo checkout completed for static products. Connect MongoDB products for real orders.");
      }
      dispatch(clearCart());
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f3] text-[#172312]">
      <header className="border-b border-[#dbe5d1] bg-white px-5 py-5">
        <div className="mx-auto max-w-4xl">
          <Link to="/cart" className="font-black">Cart</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="text-3xl font-black">Checkout</h1>
        <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          <section className="grid gap-4 rounded-lg border border-[#dbe5d1] bg-white p-5 sm:grid-cols-2">
            {Object.keys(form).map((key) => (
              <label key={key} className={key === "line1" ? "block text-sm sm:col-span-2" : "block text-sm"}>
                {key.replace(/([A-Z])/g, " $1")}
                <input
                  className="mt-2 w-full rounded-md border border-[#cedbc3] px-3 py-3 outline-none"
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  required={["fullName", "email", "line1", "city", "country"].includes(key)}
                />
              </label>
            ))}
          </section>
          <aside className="h-fit rounded-lg border border-[#dbe5d1] bg-white p-5">
            <h2 className="font-black">Payment</h2>
            <p className="mt-2 text-sm text-[#65705f]">Razorpay Checkout will open after order creation when keys are configured.</p>
            <div className="mt-4 flex justify-between text-sm">
              <span>Total</span>
              <strong>{formatINR(total + total * 0.05 + (total > 7500 ? 0 : 80))}</strong>
            </div>
            <button className="mt-5 w-full rounded-md bg-[#3c7a3a] px-4 py-3 font-bold text-white" disabled={!items.length} type="submit">
              Place order
            </button>
            {message && <p className="mt-4 text-sm text-[#52604d]">{message}</p>}
          </aside>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
