import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import KpiCard from "../components/KpiCard.jsx";
import api from "../api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/overview"),
      api.get("/customers", { params: { pageSize: 100 } }),
    ]).then(([overviewRes, customersRes]) => {
      setData(overviewRes.data);
      setCustomers(customersRes.data.data);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Navbar title="Analytics" />
          <main className="p-6">
            <p className="text-slate-500 dark:text-slate-400">Loading analytics...</p>
          </main>
        </div>
      </div>
    );
  }

  // Revenue per plan (derived client-side from customers list)
  const revenueByPlan = {};
  customers.forEach((c) => {
    if (c.status === "active") {
      revenueByPlan[c.plan] = (revenueByPlan[c.plan] || 0) + Number(c.mrr || 0);
    }
  });
  const planRevenueData = Object.entries(revenueByPlan).map(([plan, revenue]) => ({ plan, revenue }));

  const firstMonth = data.revenueByMonth[0]?.revenue || 1;
  const lastMonth = data.revenueByMonth[data.revenueByMonth.length - 1]?.revenue || 1;
  const growthPct = (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(1);

  const avgRevenuePerCustomer = data.activeSubscriptions > 0
    ? (data.mrr / data.activeSubscriptions).toFixed(2)
    : "0.00";

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Analytics" />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Revenue Growth (6mo)" value={`${growthPct}%`} accent="green" />
            <KpiCard label="Avg. Revenue / Customer" value={`$${avgRevenuePerCustomer}`} accent="brand" />
            <KpiCard label="Active Subscriptions" value={data.activeSubscriptions} accent="brand" />
            <KpiCard label="Churn Rate" value={`${data.churnRate}%`} accent="red" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
                Revenue Trend (Area)
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} formatter={(v) => [`$${v}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#4f6ef7" fill="#4f6ef7" fillOpacity={0.15} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
                Revenue by Plan
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={planRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="plan" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} formatter={(v) => [`$${v}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#4f6ef7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
