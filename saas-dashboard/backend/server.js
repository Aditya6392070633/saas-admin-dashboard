require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { ensureDB } = require("./db");
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");
const analyticsRoutes = require("./routes/analytics");
const billingRoutes = require("./routes/billing");

ensureDB();

const app = express();
app.use(cors());
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
