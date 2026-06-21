require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name
          },
          unit_amount: Math.round(Number(item.price || 0) * 100)
        },
        quantity: 1
      })),
      success_url: "https://ahmadtlas2002-max.github.io/pricehub/?payment=success",
      cancel_url: "https://ahmadtlas2002-max.github.io/pricehub/?payment=cancel"
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("PriceHub server running on port " + PORT);
});