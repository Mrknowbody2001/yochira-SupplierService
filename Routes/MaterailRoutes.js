// routes/materialRoutes.js
import express from "express";
import {
  getAllMaterials,
  // searchRawMaterials,
} from "../Controllers/SupplierMaterialMappingCtrl.js";

const materialRoute = express.Router();

// Get all materials
materialRoute.get("/all-materials", getAllMaterials);

// Search materials
// materialRoute.get("/search", searchRawMaterials);

export default materialRoute;
