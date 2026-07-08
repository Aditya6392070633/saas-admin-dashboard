import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialTeam = [
  { id: 1, name: "Alex Morgan", email: "admin@demo.com", role: "Admin", status: "active" },
  { id: 2, name: "Jamie Lee", email: "user@demo.com", role: "Member", status: "active" },
  { id: 3, name: "Priya Sharma", email: "priya@demo.com", role: "Member", status: "invited" },
];

export default function Team() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [team, setTeam] = useState(initialTeam);
  const [inviteEmail, setInviteEmail] = useState("");

  function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail) return;
    setTeam([
      ...team,
      { id: Date.now(), name: inviteEmail.split("@")[0], email: inviteEmail, role: "Member", status: "invited" },
    ]);
    setInviteEmail("");
  }

  function handleRemove(id) {
    setTeam(team.filter((t) => t.id !== id));
  }

  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    invited: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Team" />
        <main className="p-6 space-y-6">
          {isAdmin && (
            <form onSubmit={handleInvite} className="card p-4 flex items-center gap-3 flex-wrap">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="flex-1 min-w-[220px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium"
              >
                + Invite Teammate
              </button>
            </form>
          )}

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Role</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  {isAdmin && <th className="text-right font-medium px-4 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {team.map((t) => (
                  <tr key={t.id} className="text-slate-700 dark:text-slate-200">
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.email}</div>
                    </td>
                    <td className="px-4 py-3">{t.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemove(t.id)}
                          className="text-rose-600 dark:text-rose-400 hover:underline text-xs font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
