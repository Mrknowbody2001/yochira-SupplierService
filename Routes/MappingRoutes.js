// routes/mappingRoutes.js
import express from "express";
import {
  createMapping,
  deleteMapping,
  getAllMappings,
  getMaterialsBySupplier,
  removeMaterialFromMapping,
} from "../Controllers/SupplierMaterialMappingCtrl.js";

const mappingRouter = express.Router();

// Create new mapping
mappingRouter.post("/create", createMapping);

// Get all mappings
mappingRouter.get("/", getAllMappings);

// Get mapping by supplier ID
mappingRouter.get("/supplier/:supplierId", getMaterialsBySupplier);

// Delete mapping by mapping ID
mappingRouter.delete("/:id", deleteMapping);

// Remove specific material from a supplier mapping
mappingRouter.put("/removeMaterial-Mapping", removeMaterialFromMapping);

export default mappingRouter;
