// routes/supplierRoutes.js
import express from "express";
const router = express.Router();
import {
  approvedSupplier,
  createSupplier,
  deleteSupplier,
  getAllApprovedSuppliers,
  getAllSuppliers,
  getOneSupplier,
  getSupplierId,
  updateSupplier,
} from "../Controllers/supplierController.js";
import supplierValidator from "../Middlewares/supplierValidator.js";
import { getMaterialsBySupplier } from "../Controllers/SupplierMaterialMappingCtrl.js";

// Create supplier
router.post("/create", supplierValidator, createSupplier);

// Delete supplier by ID
router.delete("/delete/:id", deleteSupplier);

// Update supplier by ID
router.put("/update/:id", supplierValidator, updateSupplier);

// Get all suppliers
router.get("/", getAllSuppliers);

// Get supplier by ID
router.get("/getOneSupplier/:id", getOneSupplier);

// Get next supplier ID
router.get("/supplierId/next", getSupplierId);

// Approve supplier by ID
router.put("/approve/:id", approvedSupplier);

// Get all approved suppliers
router.get("/getAllApprovedSuppliers", getAllApprovedSuppliers);

// Get mapped materials for an approved supplier
router.get("/:supplierId/materials", getMaterialsBySupplier);

export default router;
