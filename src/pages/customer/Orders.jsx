import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { api } from "../../services/api";
import { formatINR } from "../../utils/currency";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/mine").then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  }, []);

  return (
    <DashboardLayout title="My Orders">
      <div className="rounded-lg border border-[#dbe5d1] bg-white">
        {orders.length === 0 && <p className="p-5 text-sm text-[#65705f]">No orders yet.</p>}
        {orders.map((order) => (
          <article key={order._id} className="border-b border-[#edf1e8] p-5 last:border-b-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-black">Order {order._id}</h2>
              <span className="rounded-md bg-[#e9f3df] px-3 py-1 text-sm text-[#245b24]">{order.status}</span>
            </div>
            <p className="mt-2 text-sm text-[#65705f]">{order.store?.name} - {formatINR(order.totals?.grandTotal)}</p>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
