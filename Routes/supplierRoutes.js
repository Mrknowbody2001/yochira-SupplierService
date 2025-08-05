import express from "express";
const router = express.Router();
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getOneSupplier,
  getSupplierId,
  updateSupplier,
} from "../Controllers/supplierController.js";
import supplierValidator from "../Middlewares/supplierValidator.js";
import { get } from "mongoose";

router.post(
  "/create",
  supplierValidator, // ✅ pass the array directly.....
  createSupplier
);
router.delete("/delete", deleteSupplier);

router.put("/update/:id", supplierValidator, updateSupplier);

router.get("/getAllSuppliers", getAllSuppliers);

router.get("/getOneSupplier/:id", getOneSupplier);

// get supplerId
router.get("/supplierId", getSupplierId);

export default router;
