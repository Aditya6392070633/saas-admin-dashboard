import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import api from "../api";

function invoiceNumber(id, index) {
  return `INV-${new Date().getFullYear()}-${String(index + 1).padStart(4, "0")}`;
}

export default function Invoices() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/customers", { params: { pageSize: 100 } }).then((res) => {
      setCustomers(res.data.data);
      setLoading(false);
    });
  }, []);

  const invoices = customers.map((c, i) => ({
    id: c.id,
    number: invoiceNumber(c.id, i),
    customer: c.company,
    amount: c.mrr,
    date: c.createdAt,
    status: c.status === "active" ? "Paid" : c.status === "trialing" ? "Pending" : "Void",
  }));

  const statusColors = {
    Paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    Void: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Invoices" />
        <main className="p-6 space-y-4">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Invoice #</th>
                  <th className="text-left font-medium px-4 py-3">Customer</th>
                  <th className="text-left font-medium px-4 py-3">Amount</th>
                  <th className="text-left font-medium px-4 py-3">Date</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-right font-medium px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="text-slate-700 dark:text-slate-200">
                      <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                      <td className="px-4 py-3">{inv.customer}</td>
                      <td className="px-4 py-3">${inv.amount}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(inv.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-brand-600 dark:text-brand-500 hover:underline text-xs font-medium">
                          View PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Invoices are generated automatically from each billing cycle. This demo derives them from customer records —
            in production, connect this to your real Stripe invoice history.
          </p>
        </main>
      </div>
    </div>
  );
}
