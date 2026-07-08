import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

const reports = [
  { title: "Monthly Revenue Report", desc: "MRR, new customers, and churn for the current month.", icon: "📈" },
  { title: "Customer Growth Report", desc: "New sign-ups vs. churned customers over time.", icon: "👥" },
  { title: "Subscription Breakdown", desc: "Distribution of customers across Starter, Growth, and Scale.", icon: "🥧" },
  { title: "Quarterly Business Review", desc: "A full summary suitable for stakeholders.", icon: "📊" },
];

export default function Reports() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Reports" />
        <main className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reports.map((r) => (
              <div key={r.title} className="card p-5 flex flex-col">
                <div className="text-2xl mb-2">{r.icon}</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{r.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-1">{r.desc}</p>
                <button className="mt-4 self-start px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Generate Report
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Report generation is a placeholder in this demo. In production, wire these buttons to a PDF export
            endpoint or a scheduled email report.
          </p>
        </main>
      </div>
    </div>
  );
}
