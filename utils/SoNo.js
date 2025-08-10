// utils/generateSONumber.js

import SupplierOrder from "../Models/SupplierOrder.js";




const generateSONumber = async () => {
  const count = await SupplierOrder.countDocuments();
  const nextNumber = count + 1;
  return `SO${String(nextNumber).padStart(4, "0")}`; // e.g., SO0001
};

export default generateSONumber;
