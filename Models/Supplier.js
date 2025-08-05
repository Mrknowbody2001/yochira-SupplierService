import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // ✅ No longer required
      unique: true, // ✅ Keep unique so no two suppliers have the same email if provided
      sparse: true, // ✅ IMPORTANT: allows multiple docs without email
    },
    primaryContactNo: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    nominatedPerson: {
      type: String,
      required: true,
    },
    nominatedPersonNo: {
      type: String,
      required: true,
    },
    bank: {
      type: String,
      required: true,
    },
    bankBranch: {
      type: String,
      required: true,
    },
    bankAccNo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);
