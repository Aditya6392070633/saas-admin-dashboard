import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Settings" />
        <main className="p-6 space-y-6 max-w-2xl">
          <form onSubmit={handleSave} className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile</h2>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Role</label>
              <input
                value={user?.role || ""}
                disabled
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-400 capitalize"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium"
            >
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </form>

          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preferences</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Dark Mode</p>
                <p className="text-xs text-slate-400">Toggle the dashboard color theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-7 rounded-full transition-colors relative ${theme === "dark" ? "bg-brand-500" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Email Notifications</p>
                <p className="text-xs text-slate-400">Get notified about new customers and payments</p>
              </div>
              <button
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-12 h-7 rounded-full transition-colors relative ${emailNotifs ? "bg-brand-500" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${emailNotifs ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
