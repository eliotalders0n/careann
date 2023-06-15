import express from "express";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

const usersRouter = express.Router();

// API routes

// firebase ID
usersRouter.get("/:fid", async (req, res) => {
  try {
    const user = await User.findOne({ fid: req.params.fid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by id
usersRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//   Create new User
usersRouter.post("/create", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    age,
    gender,
    fid,
  } = req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      address,
      age,
      gender,
      fid,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return success response
    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.log(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a user
usersRouter.put("/update/:fid", async (req, res) => {
  try {
    const { fid } = req.params;
    const { password, care_needs, social, health_status, ...userData } = req.body;

    // Hash the updated password if it exists
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate({ fid }, userData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the care needs, social, and health status objects
    updatedUser.care_needs = care_needs;
    updatedUser.social = social;
    updatedUser.health_status = health_status;
    await updatedUser.save();
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete a user
usersRouter.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default usersRouter;
