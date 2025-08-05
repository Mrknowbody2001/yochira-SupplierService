import Supplier from "../Models/Supplier.js";

const generateSupplierId = async () => {
  const count = await Supplier.countDocuments();
  const nextId = count + 1;
  return `SUP${nextId.toString().padStart(3, "0")}`;
};

export default generateSupplierId;
