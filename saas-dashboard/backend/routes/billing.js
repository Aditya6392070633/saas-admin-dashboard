const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

/**
 * This route mocks a Stripe Checkout Session so the demo works with zero
 * Stripe account setup. To go live:
 *
 *   const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
 *   const session = await stripe.checkout.sessions.create({
 *     mode: "subscription",
 *     line_items: [{ price: priceId, quantity: 1 }],
 *     success_url: `${process.env.CLIENT_URL}/billing?success=true`,
 *     cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
 *   });
 *   return res.json({ url: session.url });
 */
router.post("/create-checkout-session", (req, res) => {
  const { plan } = req.body;
  const validPlans = ["Starter", "Growth", "Scale"];
  if (!validPlans.includes(plan)) {
    return res.status(400).json({ message: "Invalid plan selected" });
  }

  // Simulate the redirect URL Stripe would normally return
  const mockSessionId = `mock_sess_${Date.now()}`;
  res.json({
    message: `Mock checkout session created for the ${plan} plan.`,
    sessionId: mockSessionId,
    // In production this would be a real Stripe-hosted checkout URL
    url: `/billing?mock_checkout=success&plan=${plan}`,
  });
});

// Mock webhook endpoint — in production, Stripe calls this after payment
router.post("/webhook", (req, res) => {
  res.json({ received: true, note: "This is a mock endpoint for demo purposes." });
});

module.exports = router;
