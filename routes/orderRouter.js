import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import { isAuth, isAdmin, mailgun, payOrderEmailTemplate } from "../utils.js";
import Stripe from "stripe";

const orderRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get all orders
orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    res.json(orders);
  })
);

// Get logged-in user's orders
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  })
);

// Create a new order
orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      orderItems,
      clientAddress,
      paymentMethod,
      servicePrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ error: "No order items" });
      return;
    }

    const order = new Order({
      orderItems,
      clientAddress,
      paymentMethod,
      servicePrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  })
);

// Get a specific order by ID
orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  })
);

// Update order to paid
orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      // Send email notification to the user
      mailgun.messages().send(
        {
          from: "YourAdminName <admin@example.com>",
          to: `${order.user.name} <${order.user.email}>`,
          subject: `Order ${order._id} Paid`,
          html: payOrderEmailTemplate(order),
        },
        (error, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );

      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  })
);

// Process payment
orderRouter.post(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100, // Stripe expects the amount in cents
      currency: "usd", // Adjust the currency as per your requirements
      payment_method: req.body.paymentMethodId,
      confirm: true,
    });

    if (paymentIntent.status === "succeeded") {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: paymentIntent.created,
        email_address: req.body.email,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(500).json({ error: "Payment failed" });
    }
  })
);

export default orderRouter;
