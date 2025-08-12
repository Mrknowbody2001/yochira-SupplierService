// models/SupplierOrder.js
import mongoose from "mongoose";

const supplierOrderSchema = new mongoose.Schema(
  {
    SONo: { type: String, required: true, unique: true },

    supplierId: {
      type: String, // Supplier ID from Supplier collection
      ref: "Supplier",
      required: true,
    },
    supplierName: { type: String },

    items: [
      {
        materialId: { type: String, required: true },
        materialName: { type: String },
        qty: { type: Number, required: true },
        unitPrice: { type: Number },
        unitName: { type: String },
        value: { type: Number }, // qty * unitPrice
      },
    ],

    orderTotalValue: { type: Number, required: true },

    paymentType: {
      type: String,
      enum: ["card", "cash", "cheque"],
      required: true,
    },
    deliveryDate: { type: Date, required: true },
    remark: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupplierOrder", supplierOrderSchema);
