const Stripe = require("stripe");
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

/**
 * Create a Stripe Payment Intent
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code (e.g., 'usd')
 * @param {object} metadata - Additional info
 */
exports.createPaymentIntent = async (amount, currency = "usd", metadata = {}) => {
  try {
    if (!stripe) {
      throw new Error("STRIPE_SECRET_KEY is missing in .env");
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      metadata,
    });
    return paymentIntent;
  } catch (error) {
    console.error("Stripe Error:", error);
    throw new Error(error.message);
  }
};

/**
 * Construct Stripe Event from Webhook Payload
 * @param {string} payload - Raw body text
 * @param {string} sig - Webhook signature
 */
exports.constructEvent = (payload, sig) => {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is missing");
  }
  return stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};
