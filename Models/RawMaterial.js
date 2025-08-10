// models/RawMaterial.js
import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema(
  {
    materialId: {
      type: String,
      required: true,
      unique: true,
    },
    materialName: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: ["Each", "Set", "Bulk"], // ✅ Added more unit options
      default: "each",
      required: true,
    },
    defaultUnitPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
export default RawMaterial;
