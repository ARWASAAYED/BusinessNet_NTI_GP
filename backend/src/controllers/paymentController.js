const stripeService = require("../services/stripeService");
const Promotion = require("../models/promotion");

/**
 * Handle Payment Intent Creation
 */
exports.initializePayment = async (req, res, next) => {
  try {
    const { amount, promotionType, targetId } = req.body;

    if (!amount || amount < 5) {
      return res.status(400).json({
        success: false,
        message: "Minimum promotion budget is $5",
      });
    }

    // Create Payment Intent with Stripe
    const paymentIntent = await stripeService.createPaymentIntent(amount, "usd", {
      userId: req.user._id.toString(),
      promotionType,
      targetId,
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Payment Init Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Could not initialize payment",
    });
  }
};

/**
 * Handle Stripe Webhook
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeService.constructEvent(req.body, sig);
  } catch (err) {
    console.error("Webhook Signature Verification Failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("💰 Payment succeeded:", paymentIntent.id);
      
      // Here you would complete the promotion logic:
      // Update the promotion status in DB to 'active'
      // Use paymentIntent.metadata.targetId
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
