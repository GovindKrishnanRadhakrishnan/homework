import Customer from "../Models/Customer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// =======================
// REGISTER USER
// =======================
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, age, height, weight } = req.body;

    // Email check
    const exists = await Customer.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      age,
      height,
      weight,
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// =======================
// LOGIN USER
// =======================
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 3. Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Remove password before sending user
    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      age: user.age,
      height: user.height,
      weight: user.weight,
    };

    // 5. Send response
    res.status(200).json({
      success: true,
      token,
      user: safeUser,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};



export const getAllCustomers = async (req, res) => {
  try {
    const users = await Customer.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// =======================
// GET CUSTOMER BY ID
// =======================
export const getCustomerById = async (req, res) => {
  try {
    const user = await Customer.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// =======================
// UPDATE CUSTOMER
// =======================
export const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// =======================
// DELETE CUSTOMER
// =======================
export const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
