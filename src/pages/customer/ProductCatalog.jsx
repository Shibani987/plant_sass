import { ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../features/cart/cartSlice";
import { api, getApiError } from "../../services/api";
import { formatINR } from "../../utils/currency";

const ProductCatalog = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => {
        setProducts(
          data.map((product) => ({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.images?.[0],
            tags: product.tags || [],
            storeName: product.store?.name,
            storeId: product.store?._id,
          })),
        );
        setStatus("succeeded");
      })
      .catch((requestError) => {
        setError(getApiError(requestError));
        setStatus("failed");
      });
  }, []);

  const filtered = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );

  return (
    <div className="min-h-screen bg-[#f6f8f3] text-[#172312]">
      <header className="border-b border-[#dbe5d1] bg-white px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="text-xl font-black">Plant SaaS</Link>
          <Link className="flex items-center gap-2 rounded-md bg-[#172312] px-4 py-2 text-sm text-white" to="/cart">
            <ShoppingCart className="h-4 w-4" />
            Cart {cartCount}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#4b7a36]">Marketplace</p>
            <h1 className="text-3xl font-black">Plants from verified vendors</h1>
          </div>
          <input
            className="w-full rounded-md border border-[#cedbc3] bg-white px-3 py-3 outline-none sm:w-80"
            placeholder="Search plants"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {status === "loading" && <p className="mt-8 rounded-lg bg-white p-6 text-[#5b6656]">Loading products...</p>}
        {status === "failed" && <p className="mt-8 rounded-lg bg-white p-6 text-[#9b2c2c]">{error}</p>}
        {status === "succeeded" && filtered.length === 0 && (
          <p className="mt-8 rounded-lg bg-white p-6 text-[#5b6656]">No vendor products found yet.</p>
        )}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <article key={product.id} className="rounded-lg border border-[#dbe5d1] bg-white p-4">
              <div className="flex h-48 items-center justify-center rounded-md bg-[#edf3e7]">
                {product.image ? <img className="max-h-44 object-contain" src={product.image} alt={product.name} /> : null}
              </div>
              <p className="mt-4 text-xs font-bold uppercase text-[#65845a]">{product.storeName}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black">{product.name}</h2>
                {product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e7f1df] px-2 py-1 text-xs font-bold text-[#3c7a3a]">{tag}</span>)}
              </div>
              <p className="mt-2 min-h-12 text-sm text-[#5b6656]">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <strong>{formatINR(product.price)}</strong>
                <button className="rounded-md bg-[#3c7a3a] px-4 py-2 text-sm font-bold text-white" onClick={() => dispatch(addToCart(product))}>
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductCatalog;
