import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Caregiver from "../models/CaregiverModel.js";

// Create caregiver
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      phone,
      address,
      gender,
      image,
      images,
      email,
      password,
      isAdmin,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newCaregiver = new Caregiver({
      firstName,
      lastName,
      age,
      phone,
      address,
      gender,
      image,
      images,
      email,
      password: passwordHash,
      isAdmin,
      availability: "nothing yet",
      feedback: "nothing yet",
      reviews: "nothing yet",
    });

    const savedCaregiver = await newCaregiver.save();
    res.status(201).json(savedCaregiver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logging in
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const caregiver = await Caregiver.findOne({ email: email });
    if (!caregiver) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, caregiver.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials. " });

    const token = jwt.sign({ id: caregiver._id }, process.env.JWT_SECRET);
    delete caregiver.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
