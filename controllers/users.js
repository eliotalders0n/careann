import User from "../models/UserModel.js";

// Read

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserCaregiver = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const caregiver = await Promise.all(
      user.caregiver.map((id) => User.findById(id))
    );

    const formattedCaregiver = caregiver.map({
      _id,
      firstName,
      lastName,
      age,
      phone,
      address,
      gender,
      image,
      email,
    });
    res.status(200).json(formattedCaregiver);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
