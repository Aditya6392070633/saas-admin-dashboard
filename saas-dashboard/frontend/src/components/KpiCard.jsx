export default function KpiCard({ label, value, sublabel, accent = "brand" }) {
  const accentClasses = {
    brand: "text-brand-600 dark:text-brand-500",
    green: "text-emerald-600 dark:text-emerald-400",
    red: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accentClasses[accent]}`}>{value}</p>
      {sublabel && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sublabel}</p>}
    </div>
  );
}
