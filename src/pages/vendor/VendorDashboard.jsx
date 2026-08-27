import { ImagePlus, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../../components/dashboard/MetricCard";
import DashboardLayout from "../../layouts/DashboardLayout";
import { api, getApiError } from "../../services/api";
import { formatINR } from "../../utils/currency";

const emptyProduct = {
  name: "",
  description: "",
  category: "Plants",
  price: "",
  stock: "",
  images: [],
  tags: [],
  isPublished: true,
};

const emptyO2Content = {
  title: "",
  description1: "",
  description2: "",
  image: "",
  displayOrder: 0,
  isPublished: true,
};

const VendorDashboard = () => {
  const [analytics, setAnalytics] = useState({ cards: {}, timeseries: [] });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [o2Content, setO2Content] = useState([]);
  const [o2Form, setO2Form] = useState(emptyO2Content);
  const [editingO2Id, setEditingO2Id] = useState(null);
  const [isO2Uploading, setIsO2Uploading] = useState(false);

  const loadDashboard = () => {
    Promise.allSettled([
      api.get("/analytics/vendor"),
      api.get("/products/vendor"),
      api.get("/orders/vendor"),
      api.get("/o2/vendor"),
    ])
      .then(([analyticsResult, productsResult, ordersResult, o2Result]) => {
        if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value.data);
        if (productsResult.status === "fulfilled") setProducts(productsResult.value.data);
        if (ordersResult.status === "fulfilled") setOrders(ordersResult.value.data);
        if (o2Result.status === "fulfilled") setO2Content(o2Result.value.data);
        const failedResult = [analyticsResult, productsResult, ordersResult, o2Result].find((result) => result.status === "rejected");
        if (failedResult) setMessage(getApiError(failedResult.reason));
      })
  };

  const saveO2Content = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...o2Form, displayOrder: Number(o2Form.displayOrder) };
      if (editingO2Id) {
        await api.put(`/o2/${editingO2Id}`, payload);
      } else {
        await api.post("/o2", payload);
      }
      setO2Form(emptyO2Content);
      setEditingO2Id(null);
      setMessage(editingO2Id ? "O2 content updated." : "O2 content published.");
      loadDashboard();
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  const uploadO2Image = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setIsO2Uploading(true);
    try {
      const { data } = await api.post("/products/upload", formData);
      setO2Form((current) => ({ ...current, image: data.url }));
      setMessage("O2 image uploaded.");
    } catch (error) {
      setMessage(getApiError(error));
    } finally {
      setIsO2Uploading(false);
      event.target.value = "";
    }
  };

  const editO2Content = (item) => {
    setEditingO2Id(item._id);
    setO2Form({
      title: item.title,
      description1: item.description1,
      description2: item.description2,
      image: item.image,
      displayOrder: item.displayOrder,
      isPublished: item.isPublished,
    });
  };

  const deleteO2Content = async (id) => {
    if (!window.confirm("Delete this O2 content?")) return;
    try {
      await api.delete(`/o2/${id}`);
      setMessage("O2 content deleted.");
      loadDashboard();
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      };
      if (editingId) {
        const { data } = await api.put(`/products/${editingId}`, payload);
        setProducts((current) => current.map((item) => (item._id === editingId ? data : item)));
      } else {
        await api.post("/products", payload);
      }
      setProduct(emptyProduct);
      setEditingId(null);
      setMessage(editingId ? "Product updated." : "Product created.");
      loadDashboard();
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  const editProduct = (item) => {
    setEditingId(item._id);
    setProduct({
      name: item.name,
      description: item.description || "",
      category: item.category || "Plants",
      price: item.price,
      stock: item.stock,
      images: item.images || [],
      tags: item.tags || [],
      isPublished: item.isPublished,
    });
    setMessage("Editing product.");
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      if (editingId === id) {
        setEditingId(null);
        setProduct(emptyProduct);
      }
      setMessage("Product deleted.");
      loadDashboard();
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  const toggleTag = (tag) => {
    setProduct((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag],
    }));
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    setMessage("Uploading image...");

    try {
      const { data } = await api.post("/products/upload", formData);
      setProduct((current) => ({ ...current, images: [...current.images, data.url] }));
      setMessage("Image uploaded.");
    } catch (error) {
      setMessage(getApiError(error));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (url) => {
    setProduct((current) => ({
      ...current,
      images: current.images.filter((image) => image !== url),
    }));
  };

  return (
    <DashboardLayout title="Vendor Dashboard">
      {message && <p className="mb-5 rounded-lg bg-white px-4 py-3 text-sm text-[#52604d]">{message}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Revenue" value={formatINR(analytics.cards.revenue)} />
        <MetricCard label="Orders" value={analytics.cards.orders || 0} />
        <MetricCard label="Products" value={analytics.cards.products || 0} />
        <MetricCard label="Store Status" value={analytics.cards.storeStatus || "pending"} />
      </div>

      <section className="mt-6 rounded-lg border border-[#dbe5d1] bg-white p-5">
        <h2 className="text-lg font-black">Revenue Trend</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.timeseries}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3c7a3a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <form onSubmit={saveProduct} className="h-fit rounded-lg border border-[#dbe5d1] bg-white p-5">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#3c7a3a]" />
            <h2 className="text-lg font-black">{editingId ? "Edit Product" : "Add Product"}</h2>
          </div>
          {["name", "description", "category", "price", "stock"].map((field) => (
            <label key={field} className="mt-4 block text-sm capitalize">
              {field}
              <input
                className="mt-2 w-full rounded-md border border-[#cedbc3] px-3 py-3 outline-none"
                value={product[field]}
                type={["price", "stock"].includes(field) ? "number" : "text"}
                onChange={(event) => setProduct({ ...product, [field]: event.target.value })}
                required={field !== "description"}
              />
            </label>
          ))}
          <div className="mt-4">
            <p className="text-sm">Product Images</p>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#9fba8b] bg-[#f6f8f3] px-3 py-4 text-sm font-bold text-[#3c7a3a]">
              <ImagePlus className="h-5 w-5" />
              {isUploading ? "Uploading..." : "Upload image"}
              <input
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={uploadImage}
                type="file"
              />
            </label>
            {product.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {product.images.map((image) => (
                  <div key={image} className="group relative aspect-square overflow-hidden rounded-md border border-[#dbe5d1] bg-[#edf3e7]">
                    <img className="h-full w-full object-cover" src={image} alt="Product preview" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute right-1 top-1 rounded-md bg-white/90 p-1 text-[#9b2c2c] opacity-0 shadow-sm transition group-hover:opacity-100"
                      onClick={() => removeImage(image)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input checked={product.isPublished} type="checkbox" onChange={(event) => setProduct({ ...product, isPublished: event.target.checked })} />
            Published
          </label>
          <div className="mt-4">
            <p className="text-sm">Product tags</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {["Trending", "Best Seller"].map((tag) => (
                <label key={tag} className="flex items-center gap-2 text-sm">
                  <input checked={product.tags.includes(tag)} type="checkbox" onChange={() => toggleTag(tag)} />
                  {tag}
                </label>
              ))}
            </div>
          </div>
          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#3c7a3a] px-4 py-3 font-bold text-white" type="submit">
            <Save className="h-4 w-4" />
            {editingId ? "Update product" : "Save product"}
          </button>
          {editingId && (
            <button type="button" className="mt-2 w-full rounded-md border border-[#cedbc3] px-4 py-3 text-sm font-bold" onClick={() => { setEditingId(null); setProduct(emptyProduct); }}>
              Cancel edit
            </button>
          )}
        </form>

        <section className="rounded-lg border border-[#dbe5d1] bg-white">
          <div className="border-b border-[#edf1e8] p-5">
            <h2 className="text-lg font-black">Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[#f6f8f3] text-[#64705f]">
                <tr>
                  <th className="px-5 py-3">Image</th>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Tags</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item._id} className="border-t border-[#edf1e8]">
                    <td className="px-5 py-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-[#edf3e7]">
                        {item.images?.[0] ? <img className="h-full w-full object-cover" src={item.images[0]} alt={item.name} /> : null}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold">{item.name}</td>
                    <td className="px-5 py-3">{item.category}</td>
                    <td className="px-5 py-3">{formatINR(item.price)}</td>
                    <td className="px-5 py-3">{item.stock}</td>
                    <td className="px-5 py-3">{item.isPublished ? "Published" : "Draft"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.tags || []).length > 0 ? item.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e7f1df] px-2 py-1 text-xs font-bold text-[#3c7a3a]">{tag}</span>) : <span className="text-xs text-[#8a9584]">No tags</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button type="button" aria-label={`Edit ${item.name}`} title="Edit product" className="rounded-md border border-[#cedbc3] p-2 text-[#3c7a3a]" onClick={() => editProduct(item)}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" aria-label={`Delete ${item.name}`} title="Delete product" className="rounded-md border border-[#e5caca] p-2 text-[#9b2c2c]" onClick={() => deleteProduct(item._id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-[#dbe5d1] bg-white p-5">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-[#3c7a3a]" />
          <h2 className="text-lg font-black">Best O2 Content</h2>
        </div>
        <form onSubmit={saveO2Content} className="mt-4 grid gap-4 lg:grid-cols-2">
          <input className="rounded-md border border-[#cedbc3] px-3 py-3" placeholder="Heading" value={o2Form.title} onChange={(event) => setO2Form({ ...o2Form, title: event.target.value })} required />
          <input className="rounded-md border border-[#cedbc3] px-3 py-3" type="number" min="0" placeholder="Display order" value={o2Form.displayOrder} onChange={(event) => setO2Form({ ...o2Form, displayOrder: event.target.value })} />
          <textarea className="min-h-24 rounded-md border border-[#cedbc3] px-3 py-3" placeholder="First paragraph" value={o2Form.description1} onChange={(event) => setO2Form({ ...o2Form, description1: event.target.value })} required />
          <textarea className="min-h-24 rounded-md border border-[#cedbc3] px-3 py-3" placeholder="Second paragraph" value={o2Form.description2} onChange={(event) => setO2Form({ ...o2Form, description2: event.target.value })} required />
          <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-[#9fba8b] bg-[#f6f8f3] px-3 py-4 text-sm font-bold text-[#3c7a3a]">
            <ImagePlus className="mr-2 h-5 w-5" />
            {isO2Uploading ? "Uploading..." : o2Form.image ? "Image selected" : "Upload O2 image"}
            <input accept="image/*" className="hidden" disabled={isO2Uploading} onChange={uploadO2Image} type="file" />
          </label>
          <label className="flex items-center gap-2 text-sm"><input checked={o2Form.isPublished} type="checkbox" onChange={(event) => setO2Form({ ...o2Form, isPublished: event.target.checked })} /> Published</label>
          <div className="flex flex-wrap gap-2 lg:col-span-2">
            <button className="rounded-md bg-[#3c7a3a] px-4 py-3 font-bold text-white" type="submit">{editingO2Id ? "Update O2 content" : "Publish O2 content"}</button>
            {editingO2Id && <button type="button" className="rounded-md border border-[#cedbc3] px-4 py-3 font-bold" onClick={() => { setEditingO2Id(null); setO2Form(emptyO2Content); }}>Cancel edit</button>}
          </div>
        </form>
        {o2Content.length > 0 && <div className="mt-5 space-y-2">
          {o2Content.map((item) => <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#edf1e8] p-3 text-sm">
            <span className="font-bold">{item.title}</span><span>Order: {item.displayOrder}</span><span>{item.isPublished ? "Published" : "Draft"}</span>
            <div className="flex gap-2"><button type="button" className="rounded-md border border-[#cedbc3] px-3 py-1 font-bold" onClick={() => editO2Content(item)}>Edit</button><button type="button" className="rounded-md border border-[#e5caca] px-3 py-1 font-bold text-[#9b2c2c]" onClick={() => deleteO2Content(item._id)}>Delete</button></div>
          </div>)}
        </div>}
      </section>

      <section className="mt-6 rounded-lg border border-[#dbe5d1] bg-white">
        <div className="border-b border-[#edf1e8] p-5">
          <h2 className="text-lg font-black">Orders</h2>
        </div>
        {orders.length === 0 && <p className="p-5 text-sm text-[#65705f]">No orders yet.</p>}
        {orders.map((order) => (
          <div key={order._id} className="flex flex-wrap justify-between gap-3 border-b border-[#edf1e8] p-5 text-sm last:border-b-0">
            <strong>{order.customer?.name || "Customer"}</strong>
            <span>{formatINR(order.totals?.grandTotal)}</span>
            <span>{order.status}</span>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
};

export default VendorDashboard;
