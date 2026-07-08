import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api";

const emptyForm = { name: "", email: "", company: "", plan: "Starter", status: "active", mrr: 29 };

export default function Customers() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const pageSize = 8;

  async function load() {
    setLoading(true);
    const res = await api.get("/customers", { params: { search, page, pageSize } });
    setRows(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(row) {
    setEditingId(row.id);
    setForm({ name: row.name, email: row.email, company: row.company, plan: row.plan, status: row.status, mrr: row.mrr });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (editingId) {
      await api.put(`/customers/${editingId}`, form);
    } else {
      await api.post("/customers", form);
    }
    setModalOpen(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this customer? This cannot be undone.")) return;
    await api.delete(`/customers/${id}`);
    load();
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    trialing: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    churned: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Customers" />
        <main className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <input
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search by name, email, or company..."
              className="w-full sm:w-80 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {isAdmin && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                + Add Customer
              </button>
            )}
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Company</th>
                  <th className="text-left font-medium px-4 py-3">Plan</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3">MRR</th>
                  {isAdmin && <th className="text-right font-medium px-4 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No customers found</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="text-slate-700 dark:text-slate-200">
                      <td className="px-4 py-3">
                        <div className="font-medium">{row.name}</div>
                        <div className="text-xs text-slate-400">{row.email}</div>
                      </td>
                      <td className="px-4 py-3">{row.company}</td>
                      <td className="px-4 py-3">{row.plan}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">${row.mrr}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => openEditModal(row)} className="text-brand-600 dark:text-brand-500 hover:underline text-xs font-medium">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(row.id)} className="text-rose-600 dark:text-rose-400 hover:underline text-xs font-medium">
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Page {page} of {totalPages} · {total} total</span>
            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form onSubmit={handleSave} className="card w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {editingId ? "Edit Customer" : "Add Customer"}
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Company</label>
              <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Plan</label>
                <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}
                  className="mt-1 w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                  <option>Starter</option>
                  <option>Growth</option>
                  <option>Scale</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-1 w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                  <option value="active">Active</option>
                  <option value="trialing">Trialing</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">MRR ($)</label>
                <input type="number" min="0" value={form.mrr} onChange={(e) => setForm({ ...form, mrr: e.target.value })}
                  className="mt-1 w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit"
                className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium">
                {editingId ? "Save Changes" : "Add Customer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
