import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import api from "../api";

export default function Subscriptions() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/customers", { params: { pageSize: 100 } }).then((res) => {
      setCustomers(res.data.data);
      setLoading(false);
    });
  }, []);

  const plans = ["Starter", "Growth", "Scale"];
  const planStats = plans.map((plan) => {
    const inPlan = customers.filter((c) => c.plan === plan);
    const active = inPlan.filter((c) => c.status === "active");
    const mrr = active.reduce((sum, c) => sum + Number(c.mrr || 0), 0);
    return { plan, total: inPlan.length, active: active.length, mrr };
  });

  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    trialing: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    churned: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Subscriptions" />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {planStats.map((p) => (
              <div key={p.plan} className="card p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">{p.plan} Plan</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-500 mt-1">
                  ${p.mrr.toLocaleString()}<span className="text-sm text-slate-400">/mo</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {p.active} active · {p.total} total subscribers
                </p>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">All Subscriptions</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Customer</th>
                  <th className="text-left font-medium px-4 py-3">Plan</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3">MRR</th>
                  <th className="text-left font-medium px-4 py-3">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="text-slate-700 dark:text-slate-200">
                      <td className="px-4 py-3">
                        <div className="font-medium">{c.company}</div>
                        <div className="text-xs text-slate-400">{c.email}</div>
                      </td>
                      <td className="px-4 py-3">{c.plan}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">${c.mrr}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
