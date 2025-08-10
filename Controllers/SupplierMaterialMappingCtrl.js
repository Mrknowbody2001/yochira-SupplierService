// controllers/SupplierMaterialMappingCtrl.js

import RawMaterial from "../Models/RawMaterial.js"; // ✅ Your actual model
import Supplier from "../Models/Supplier.js";
import SupplierMaterialMapping from "../Models/SupplierMaterialMapping.js";
import { getApprovedSupplierMaterials } from "./supplierController.js"; // ✅ Make sure this exists

// ✅ Create or update mapping
export const createMapping = async (req, res) => {
  try {
    const { supplierId, materialIds } = req.body;

    // 1. Validate supplier
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // 2. Validate materials
    const materials = await RawMaterial.find({
      materialId: { $in: materialIds },
    });
    if (materials.length !== materialIds.length) {
      return res.status(404).json({ message: "One or more materials not found" });
    }

    // 3. Check if mapping already exists
    const existing = await SupplierMaterialMapping.findOne({ supplier: supplier._id });

    if (existing) {
      // Merge material IDs without duplicates
      const newMaterialIds = materials.map((m) => m._id.toString());
      const currentMaterialIds = existing.materials.map((id) => id.toString());
      const mergedSet = new Set([...currentMaterialIds, ...newMaterialIds]);
      existing.materials = Array.from(mergedSet);

      await existing.save();
      return res.status(200).json({ message: "Mapping updated", data: existing });
    } else {
      // Create new mapping
      const newMapping = new SupplierMaterialMapping({
        supplier: supplier._id,
        materials: materials.map((m) => m._id),
      });

      await newMapping.save();
      return res.status(201).json({ message: "Mapping created", data: newMapping });
    }

  } catch (err) {
    console.error("Error in createMapping:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all materials (for dropdowns etc.)
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find().select("materialId materialName");
    res.status(200).json({ materials });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all mappings
export const getAllMappings = async (req, res) => {
  try {
    const mappings = await SupplierMaterialMapping.find()
      .populate("supplier")
      .populate("materials");
    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete mapping
export const deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const mapping = await SupplierMaterialMapping.findByIdAndDelete(id);
    if (!mapping) return res.status(404).json({ message: "Mapping not found" });

    res.json({ message: "Mapping deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Remove material from mapping
export const removeMaterialFromMapping = async (req, res) => {
  try {
    const { supplierId, materialId } = req.body;

    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const material = await RawMaterial.findOne({ materialId });
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const mapping = await SupplierMaterialMapping.findOneAndUpdate(
      { supplier: supplier._id },
      { $pull: { materials: material._id } },
      { new: true }
    ).populate("materials");

    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.status(200).json({ message: "Material removed from mapping", mapping });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get materials by supplier (for supplier order creation)
export const getMaterialsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;

    // Find the supplier by supplierId (no status filter here)
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Find mappings and populate materials
    const mapping = await SupplierMaterialMapping.findOne({
      supplier: supplier._id,
    }).populate("materials");

    if (!mapping) {
      return res.status(404).json({ message: "No materials mapped to this supplier" });
    }

    res.status(200).json({
      supplier,
      materials: mapping.materials,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

