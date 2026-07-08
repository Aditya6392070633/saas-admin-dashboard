import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import KpiCard from "../components/KpiCard.jsx";
import api from "../api";

const PLAN_COLORS = ["#4f6ef7", "#22c55e", "#f59e0b"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/overview").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Dashboard" />
        <main className="p-6 space-y-6">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading analytics...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total Customers" value={data.totalCustomers} accent="brand" />
                <KpiCard
                  label="Active Subscriptions"
                  value={data.activeSubscriptions}
                  accent="green"
                />
                <KpiCard
                  label="Monthly Recurring Revenue"
                  value={`$${data.mrr.toLocaleString()}`}
                  sublabel="From active subscriptions"
                  accent="brand"
                />
                <KpiCard
                  label="Churn Rate"
                  value={`${data.churnRate}%`}
                  sublabel="Last billing cycle"
                  accent="red"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card p-5 lg:col-span-2">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
                    Revenue Trend (Last 6 Months)
                  </h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, fontSize: 13 }}
                        formatter={(value) => [`$${value}`, "Revenue"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4f6ef7"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="card p-5">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
                    Customers by Plan
                  </h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={data.customersByPlan}
                        dataKey="count"
                        nameKey="plan"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {data.customersByPlan.map((entry, i) => (
                          <Cell key={entry.plan} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
