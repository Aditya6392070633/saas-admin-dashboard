import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import api from "../api";

const plans = [
  { name: "Starter", price: 29, features: ["1 project", "Basic analytics", "Email support"] },
  { name: "Growth", price: 99, features: ["10 projects", "Advanced analytics", "Priority support", "Team roles"], popular: true },
  { name: "Scale", price: 299, features: ["Unlimited projects", "Real-time analytics", "Dedicated support", "Custom integrations"] },
];

export default function Billing() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [message, setMessage] = useState("");

  async function handleUpgrade(planName) {
    setLoadingPlan(planName);
    setMessage("");
    try {
      const res = await api.post("/billing/create-checkout-session", { plan: planName });
      setMessage(res.data.message + " (In production, this redirects to a real Stripe Checkout page.)");
    } catch (err) {
      setMessage("Something went wrong creating the checkout session.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title="Billing & Plans" />
        <main className="p-6 space-y-6">
          {message && (
            <div className="card p-4 text-sm text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border-brand-200">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-6 flex flex-col ${plan.popular ? "ring-2 ring-brand-500" : ""}`}
              >
                {plan.popular && (
                  <span className="self-start mb-2 px-2 py-1 text-xs font-semibold rounded-full bg-brand-500 text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{plan.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">/month</span>
                </p>

                <ul className="mt-4 space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={loadingPlan === plan.name}
                  className={`mt-5 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-brand-500 hover:bg-brand-600 text-white"
                      : "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  } disabled:opacity-60`}
                >
                  {loadingPlan === plan.name ? "Processing..." : `Upgrade to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          <div className="card p-5 text-sm text-slate-500 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Note</p>
            <p>
              This billing flow is mocked for demo purposes — no real payment is processed.
              In production, the "Upgrade" button calls a real Stripe Checkout Session and
              redirects the customer to Stripe's hosted payment page.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
