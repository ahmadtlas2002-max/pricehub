require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

app.use(cors());
app.use(express.json());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("PriceHub Stripe server is running ✅");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY is missing" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const lineItems = items.map(item => {
      const name = item.name || "Product";
      const price = Number(item.price || 0);

      if (price <= 0) {
        throw new Error("Invalid product price: " + name);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: { name },
          unit_amount: Math.round(price * 100)
        },
        quantity: 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
     success_url: "https://ahmadtlas2002-max.github.io/pricehub/success.html",
      cancel_url: "https://ahmadtlas2002-max.github.io/pricehub/?payment=cancel"
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("PriceHub server running on port " + PORT);
});
