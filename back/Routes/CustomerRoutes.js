import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../Controllers/CustomerController.js";

const router = express.Router();

// REGISTER
router.post("/register", registerCustomer);

// LOGIN
router.post("/login", loginCustomer);

// GET ALL CUSTOMERS
router.get("/", getAllCustomers);

// GET CUSTOMER BY ID
router.get("/:id", getCustomerById);

// UPDATE CUSTOMER
router.put("/:id", updateCustomer);

// DELETE CUSTOMER
router.delete("/:id", deleteCustomer);

export default router;
