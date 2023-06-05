import mongoose from "mongoose";

const reviewsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const availabilitySchema = mongoose.Schema(
  {
    hours: { type: String, required: true },
    days: { type: String, required: true },
    location: { type: Number, required: true },
    type_of_care: { type: String, required: true },
    level_pf_care: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const feedbackSchema = mongoose.Schema(
  {
    quality: { type: String, required: true },
    outcomes: { type: String, required: true },
    satisfaction: { type: Number, required: true },
    challenges: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const caregiverSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    image: { type: String, required: false },
    images: [String],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    availability: [availabilitySchema],
    feedback: [feedbackSchema],
    reviews: [reviewsSchema],
  },
  {
    timestamps: true,
  }
);

const Caregiver = mongoose.model("Caregiver", caregiverSchema);
export default Caregiver;
