import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../../components/dashboard/MetricCard";
import DashboardLayout from "../../layouts/DashboardLayout";
import { api, getApiError } from "../../services/api";
import { formatINR } from "../../utils/currency";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({ cards: {}, timeseries: [] });
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [heroForm, setHeroForm] = useState({ plantId: "", name: "", category: "Indoor Plant", image: "" });
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroItems, setHeroItems] = useState([]);
  const [trendyItems, setTrendyItems] = useState([]);
  const [trendyImageFile, setTrendyImageFile] = useState(null);
  const [trendyForm, setTrendyForm] = useState({ itemId: "", image: "", alt: "", title: "", description: "", price: "", reverse: false });

  const load = () => {
    Promise.allSettled([api.get("/analytics/admin"), api.get("/stores/admin/all"), api.get("/hero/featured"), api.get("/trendy")])
      .then(([analyticsResult, storesResult, heroResult, trendyResult]) => {
        if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value.data);
        if (storesResult.status === "fulfilled") setStores(storesResult.value.data);
        if (heroResult.status === "fulfilled") setHeroItems(Array.isArray(heroResult.value.data) ? heroResult.value.data : []);
        if (trendyResult.status === "fulfilled") setTrendyItems(Array.isArray(trendyResult.value.data) ? trendyResult.value.data : []);
        const failedResult = [analyticsResult, storesResult, heroResult, trendyResult].find((result) => result.status === "rejected");
        if (failedResult) setMessage(getApiError(failedResult.reason));
      });
  };

  const updateHero = async (event) => {
    event.preventDefault();
    try {
      let image = heroForm.image;
      if (heroImageFile) {
        const formData = new FormData();
        formData.append("image", heroImageFile);
        const uploadResponse = await api.post("/hero/upload", formData);
        image = uploadResponse.data.url;
      }
      const { data } = await api.post("/hero/featured", { ...heroForm, image });
      setHeroItems((items) => [data, ...items]);
      setHeroForm({ plantId: "", name: "", category: "Indoor Plant", image: "" });
      setHeroImageFile(null);
      setMessage("Featured hero plant added.");
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  const removeHero = async (id) => {
    try {
      await api.delete(`/hero/featured/${id}`);
      setHeroItems((items) => items.filter((item) => item._id !== id));
      setMessage("Featured hero plant removed.");
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  const updateTrendy = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", trendyImageFile);
      const uploadResponse = await api.post("/trendy/upload", formData);
      const { data } = await api.post("/trendy", { ...trendyForm, image: uploadResponse.data.url });
      setTrendyItems((items) => [...items, data]);
      setTrendyForm({ itemId: "", image: "", alt: "", title: "", description: "", price: "", reverse: false });
      setTrendyImageFile(null);
      setMessage("Trendy plant card added.");
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  const removeTrendy = async (id) => {
    try {
      await api.delete(`/trendy/${id}`);
      setTrendyItems((items) => items.filter((item) => item._id !== id));
      setMessage("Trendy plant card removed.");
    } catch (error) {
      setMessage(getApiError(error));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/stores/${id}/status`, { status });
    load();
  };

  return (
    <DashboardLayout title="Super Admin Dashboard">
      {message && <p className="mb-5 rounded-lg bg-white px-4 py-3 text-sm text-[#52604d]">{message}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Revenue" value={formatINR(analytics.cards.revenue)} />
        <MetricCard label="Orders" value={analytics.cards.orders || 0} />
        <MetricCard label="Vendors" value={analytics.cards.vendors || 0} />
        <MetricCard label="Customers" value={analytics.cards.customers || 0} />
        <MetricCard label="Stores" value={analytics.cards.stores || 0} />
        <MetricCard label="Products" value={analytics.cards.products || 0} />
      </div>

      <section className="mt-6 rounded-lg border border-[#dbe5d1] bg-white p-5">
        <h2 className="text-lg font-black">Platform Sales</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.timeseries}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3c7a3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[#dbe5d1] bg-white p-5">
        <h2 className="text-lg font-black">Our Trendy Plants</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={updateTrendy}>
          <input className="rounded-md border border-[#cedbc3] px-3 py-2" type="number" placeholder="Plant ID" required value={trendyForm.itemId} onChange={(event) => setTrendyForm({ ...trendyForm, itemId: event.target.value })} />
          <input className="rounded-md border border-[#cedbc3] px-3 py-2" placeholder="Image alt text" required value={trendyForm.alt} onChange={(event) => setTrendyForm({ ...trendyForm, alt: event.target.value })} />
          <input className="rounded-md border border-[#cedbc3] px-3 py-2" placeholder="Card title" required value={trendyForm.title} onChange={(event) => setTrendyForm({ ...trendyForm, title: event.target.value })} />
          <input className="rounded-md border border-[#cedbc3] px-3 py-2" placeholder="Price" required value={trendyForm.price} onChange={(event) => setTrendyForm({ ...trendyForm, price: event.target.value })} />
          <textarea className="rounded-md border border-[#cedbc3] px-3 py-2 md:col-span-2" placeholder="Description" required value={trendyForm.description} onChange={(event) => setTrendyForm({ ...trendyForm, description: event.target.value })} />
          <label className="text-sm font-semibold text-[#52604d]">
            Upload card image
            <input className="mt-1 w-full rounded-md border border-[#cedbc3] px-3 py-2" type="file" accept="image/*" required onChange={(event) => setTrendyImageFile(event.target.files?.[0] || null)} />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#52604d]"><input type="checkbox" checked={trendyForm.reverse} onChange={(event) => setTrendyForm({ ...trendyForm, reverse: event.target.checked })} /> Reverse image position</label>
          <button className="w-fit rounded-md bg-[#315c2d] px-5 py-2 font-semibold text-white" type="submit">Upload Trendy Card</button>
        </form>
        {trendyItems.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trendyItems.map((item) => (
            <div key={item._id} className="flex items-center gap-3 rounded-md border border-[#dbe5d1] p-3">
              <img className="h-14 w-14 rounded object-cover" src={item.image} alt={item.alt} />
              <div className="min-w-0 flex-1"><p className="truncate font-bold">{item.title}</p><p className="text-xs text-[#64705f]">ID: {item.itemId}</p></div>
              <button className="text-sm font-semibold text-red-700" type="button" onClick={() => removeTrendy(item._id)}>Delete</button>
            </div>
          ))}
        </div>}
      </section>

      <section className="mt-6 rounded-lg border border-[#dbe5d1] bg-white">
        <div className="border-b border-[#edf1e8] p-5">
          <h2 className="text-lg font-black">Vendor Stores</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f6f8f3] text-[#64705f]">
              <tr>
                <th className="px-5 py-3">Store</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store._id} className="border-t border-[#edf1e8]">
                  <td className="px-5 py-3 font-bold">{store.name}</td>
                  <td className="px-5 py-3">{store.owner?.name}</td>
                  <td className="px-5 py-3">{store.slug}</td>
                  <td className="px-5 py-3">{store.status}</td>
                  <td className="px-5 py-3">
                    <select className="rounded-md border border-[#cedbc3] px-2 py-2" value={store.status} onChange={(event) => updateStatus(store._id, event.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[#dbe5d1] bg-white p-5">
        <h2 className="text-lg font-black">Home Hero Featured Plant</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={updateHero}>
          <label className="text-sm font-semibold text-[#52604d]">
            Plant ID
            <input className="mt-1 w-full rounded-md border border-[#cedbc3] px-3 py-2" type="number" required value={heroForm.plantId} onChange={(event) => setHeroForm({ ...heroForm, plantId: event.target.value })} />
          </label>
          <label className="text-sm font-semibold text-[#52604d]">
            Plant name
            <input className="mt-1 w-full rounded-md border border-[#cedbc3] px-3 py-2" required value={heroForm.name} onChange={(event) => setHeroForm({ ...heroForm, name: event.target.value })} />
          </label>
          <label className="text-sm font-semibold text-[#52604d]">
            Category
            <input className="mt-1 w-full rounded-md border border-[#cedbc3] px-3 py-2" required value={heroForm.category} onChange={(event) => setHeroForm({ ...heroForm, category: event.target.value })} />
          </label>
          <label className="text-sm font-semibold text-[#52604d] md:col-span-2">
            Upload plant image
            <input className="mt-1 w-full rounded-md border border-[#cedbc3] px-3 py-2" type="file" accept="image/*" onChange={(event) => setHeroImageFile(event.target.files?.[0] || null)} />
            {heroForm.image && <span className="mt-1 block text-xs font-normal text-[#64705f]">Current Cloudinary image is saved. Choose a new file to replace it.</span>}
          </label>
          <button className="w-fit rounded-md bg-[#315c2d] px-5 py-2 font-semibold text-white" type="submit">Upload and Save Hero Plant</button>
        </form>
        {heroItems.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {heroItems.map((item) => (
            <div key={item._id} className="flex items-center gap-3 rounded-md border border-[#dbe5d1] p-3">
              <img className="h-14 w-14 rounded object-cover" src={item.image} alt={item.name} />
              <div className="min-w-0 flex-1"><p className="truncate font-bold">{item.name}</p><p className="text-xs text-[#64705f]">ID: {item.plantId}</p></div>
              <button className="text-sm font-semibold text-red-700" type="button" onClick={() => removeHero(item._id)}>Delete</button>
            </div>
          ))}
        </div>}
      </section>
    </DashboardLayout>
  );
};

export default AdminDashboard;
