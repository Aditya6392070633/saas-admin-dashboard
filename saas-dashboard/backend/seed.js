require("dotenv").config();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB, ensureDB } = require("./db");

ensureDB();

const db = { users: [], customers: [], subscriptions: [] };

// --- Demo users ---
const adminPasswordHash = bcrypt.hashSync("admin123", 10);
const userPasswordHash = bcrypt.hashSync("user123", 10);

db.users.push({
  id: uuidv4(),
  name: "Alex Morgan",
  email: "admin@demo.com",
  passwordHash: adminPasswordHash,
  role: "admin",
  createdAt: new Date().toISOString(),
});

db.users.push({
  id: uuidv4(),
  name: "Jamie Lee",
  email: "user@demo.com",
  passwordHash: userPasswordHash,
  role: "user",
  createdAt: new Date().toISOString(),
});

// --- Demo customers ---
const companies = [
  ["Nova Analytics", "nova"], ["Brightpath Media", "brightpath"], ["Vertex Logistics", "vertex"],
  ["Cedar & Co", "cedar"], ["Pulse Fitness", "pulse"], ["Lumen Studio", "lumen"],
  ["Anchor Legal", "anchor"], ["Solace Health", "solace"], ["Ridgeline Consulting", "ridgeline"],
  ["Fernwood Design", "fernwood"], ["Northbeam SaaS", "northbeam"], ["Cobalt Retail", "cobalt"],
  ["Harbor Finance", "harbor"], ["Willow Education", "willow"], ["Granite Security", "granite"],
  ["Sable Marketing", "sable"], ["Ember Robotics", "ember"], ["Driftwood Travel", "driftwood"],
];

const plans = [
  { name: "Starter", mrr: 29 },
  { name: "Growth", mrr: 99 },
  { name: "Scale", mrr: 299 },
];

const statuses = ["active", "active", "active", "active", "trialing", "churned"];

companies.forEach(([company, slug], i) => {
  const plan = plans[i % plans.length];
  const status = statuses[i % statuses.length];
  db.customers.push({
    id: uuidv4(),
    name: `${company.split(" ")[0]} Admin`,
    email: `contact@${slug}.com`,
    company,
    plan: plan.name,
    status,
    mrr: status === "active" ? plan.mrr : status === "trialing" ? 0 : plan.mrr,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 7).toISOString(),
  });
});

writeDB(db);

console.log("✅ Demo data seeded successfully!\n");
console.log("Login credentials:");
console.log("  Admin -> admin@demo.com / admin123");
console.log("  User  -> user@demo.com  / user123\n");
