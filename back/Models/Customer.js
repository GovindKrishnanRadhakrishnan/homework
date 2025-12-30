import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, default: "customer" }, // admin or customer

    age: { type: Number, required: true },

    height: { type: Number, required: true }, // in cm

    weight: { type: Number, required: true }, // in kg
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
