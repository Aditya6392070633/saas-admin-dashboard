const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/customers?search=&page=&pageSize=
router.get("/", (req, res) => {
  const db = readDB();
  const { search = "", page = 1, pageSize = 8 } = req.query;

  let results = db.customers;
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
    );
  }

  const total = results.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const paged = results.slice(start, start + Number(pageSize));

  res.json({ data: paged, total, page: Number(page), pageSize: Number(pageSize) });
});

// POST /api/customers  (admin only)
router.post("/", requireRole("admin"), (req, res) => {
  const { name, email, company, plan = "Starter", status = "active", mrr = 0 } = req.body;
  if (!name || !email || !company) {
    return res.status(400).json({ message: "name, email, and company are required" });
  }

  const db = readDB();
  const customer = {
    id: uuidv4(),
    name,
    email,
    company,
    plan,
    status,
    mrr: Number(mrr),
    createdAt: new Date().toISOString(),
  };
  db.customers.push(customer);
  writeDB(db);
  res.status(201).json(customer);
});

// PUT /api/customers/:id  (admin only)
router.put("/:id", requireRole("admin"), (req, res) => {
  const db = readDB();
  const idx = db.customers.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Customer not found" });

  db.customers[idx] = { ...db.customers[idx], ...req.body };
  writeDB(db);
  res.json(db.customers[idx]);
});

// DELETE /api/customers/:id  (admin only)
router.delete("/:id", requireRole("admin"), (req, res) => {
  const db = readDB();
  const idx = db.customers.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Customer not found" });

  db.customers.splice(idx, 1);
  writeDB(db);
  res.status(204).send();
});

module.exports = router;
