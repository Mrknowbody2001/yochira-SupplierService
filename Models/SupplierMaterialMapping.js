// models/SupplierMaterialMapping.js
import mongoose from "mongoose";

const supplierMaterialMappingSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RawMaterial",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(
  "SupplierMaterialMapping",
  supplierMaterialMappingSchema
);
