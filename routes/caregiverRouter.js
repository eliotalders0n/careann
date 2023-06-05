import express, { query } from "express";
import Caregiver from "../models/CaregiverModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";

const caregiverRouter = express.Router();

// Get all caregviers
caregiverRouter.get("/", async (req, res) => {
  try {
    const caregivers = await Caregiver.find();
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get caregiver by ID
caregiverRouter.get("/:id", async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ error: "Caregiver not found" });
    }
    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new caregiver
caregiverRouter.post("/", async (req, res) => {
  try {
    const newCaregiver = await Caregiver.create(req.body);
    res.status(201).json(newCaregiver);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a Caregiver
caregiverRouter.put("/:id", async (req, res) => {
  try {
    const updatedCaregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCaregiver) {
      return res.status(404).json({ error: "Caregiver not found" });
    }
    res.json(updatedCaregiver);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a caregiver
caregiverRouter.delete("/:id", async (req, res) => {
  try {
    const deletedCaregiver = await Caregiver.findByIdAndDelete(req.params.id);
    if (!deletedCaregiver) {
      return res.status(404).json({ error: "Caregiver not found" });
    }
    res.json(deletedCaregiver);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default caregiverRouter;
