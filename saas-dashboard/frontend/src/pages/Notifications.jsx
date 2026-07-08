import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

const initialNotifications = [
  { id: 1, title: "New customer signed up", desc: "Northbeam SaaS joined the Growth plan.", time: "2h ago", read: false },
  { id: 2, title: "Payment received", desc: "Vertex Logistics paid their Scale plan invoice.", time: "5h ago", read: false },
  { id: 3, title: "Subscription churned", desc: "Lumen Studio cancelled their Scale subscription.", time: "1d ago", read: true },
  { id: 4, title: "Trial ending soon", desc: "Pulse Fitness's trial ends in 3 days.", time: "2d ago", read: true },
];

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications);

  function markRead(id) {
    setItems(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setItems(items.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Notifications" />
        <main className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
            </p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-sm text-brand-600 dark:text-brand-500 hover:underline font-medium">
                Mark all as read
              </button>
            )}
          </div>

          <div className="card divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`px-4 py-4 flex items-start gap-3 cursor-pointer ${!n.read ? "bg-brand-50/50 dark:bg-brand-500/5" : ""}`}
              >
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-brand-500" : "bg-transparent"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{n.desc}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{n.time}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
