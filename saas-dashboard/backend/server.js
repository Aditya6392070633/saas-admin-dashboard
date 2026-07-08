require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { ensureDB, readDB } = require("./db");
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");
const analyticsRoutes = require("./routes/analytics");
const billingRoutes = require("./routes/billing");

ensureDB();

// Auto-seed demo data if the DB is empty. This matters on hosts like Render's
// free tier, where the local filesystem can reset on redeploy — without this,
// the app would come up with no login and no data after every deploy.
const existing = readDB();
if (existing.users.length === 0) {
  console.log("No data found — seeding demo data automatically...");
  require("./seed");
}

const app = express();

// In production, set FRONTEND_URL to your deployed Vercel URL, e.g.
// https://your-app.vercel.app — this restricts which sites can call the API.
// If FRONTEND_URL is not set (local dev), all origins are allowed.
const allowedOrigin = process.env.FRONTEND_URL;
app.use(
  cors(
    allowedOrigin
      ? { origin: allowedOrigin }
      : {} // allow all origins in local dev
  )
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/billing", billingRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SaaS Dashboard API running on http://localhost:${PORT}`);
});
