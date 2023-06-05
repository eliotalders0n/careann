import mongoose from "mongoose";

const careNeedsSchema = mongoose.Schema(
  {
    type_of_care: { type: String, required: false },
    ammount: { type: String, required: false },
    frequency: { type: Number, required: false },
    goals: { type: String, required: false },
    care_plan: { type: String, required: false },
  },
  {
    timestamps: false,
  }
);

const socialSchema = mongoose.Schema(
  {
    language: { type: String, required: false },
    religion: { type: String, required: false },
    race: { type: Number, required: false },
    family: { type: String, required: false },
  },
  {
    timestamps: false,
  }
);

const healthStatusSchema = mongoose.Schema(
  {
    medicalHistory: { type: String, required: false },
    currentMedication: { type: String, required: false },
    allergies: {
      type: Array,
      required: false,
      ref: "Category",
    },
    chronicCondtion: { type: String, required: false },
    disability: { type: Number, default: 0, required: false },
  },
  {
    timestamps: false,
  }
);

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    age: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    gender: { type: String, required: false },
    image: { type: String, required: false },
    images: [String],
    emergency_contact: { type: String, required: false },
    email: { type: String, required: false, unique: false },
    password: { type: String, required: false },
    care_needs: [careNeedsSchema],
    social: [socialSchema],
    health_status: [healthStatusSchema],
  },
  {
    timestamps: false,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
