import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, selectCartTotal, updateQuantity } from "../../features/cart/cartSlice";
import { formatINR } from "../../utils/currency";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f6f8f3] text-[#172312]">
      <header className="border-b border-[#dbe5d1] bg-white px-5 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/products" className="font-black">Marketplace</Link>
          <Link to="/checkout" className="rounded-md bg-[#172312] px-4 py-2 text-sm text-white">Checkout</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-black">Cart</h1>
          <span className="rounded-full bg-[#e7f1df] px-3 py-1 text-sm font-bold text-[#3c7a3a]">{itemCount} items</span>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            {items.length === 0 && <p className="rounded-lg bg-white p-6 text-[#5b6656]">Your cart is empty.</p>}
            {items.map((item) => (
              <article key={item.id} className="flex gap-4 rounded-lg border border-[#dbe5d1] bg-white p-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-[#edf3e7]">
                  {item.image ? <img className="max-h-20 object-contain" src={item.image} alt={item.name} /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black">{item.name}</h2>
                  <p className="text-sm text-[#65705f]">{formatINR(item.price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="rounded-md border border-[#cedbc3] p-2" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} type="button">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="rounded-md border border-[#cedbc3] p-2" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} type="button">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button className="ml-auto rounded-md border border-[#f0c9c9] p-2 text-[#9b2c2c]" onClick={() => dispatch(removeFromCart(item.id))} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
          <aside className="h-fit rounded-lg border border-[#dbe5d1] bg-white p-5">
            <h2 className="text-lg font-black">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <strong>{formatINR(total)}</strong>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Estimated tax</span>
              <strong>{formatINR(total * 0.05)}</strong>
            </div>
            <Link className="mt-5 block rounded-md bg-[#3c7a3a] px-4 py-3 text-center font-bold text-white" to="/checkout">
              Continue
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;
