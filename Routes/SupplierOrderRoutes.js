import express from "express";
import {
  approveSupplierOrder,
  createSupplierOrder,
  getAllSupplierOrders,
  getPendingOrders,
  getSONo,
  getSupplierOrderById,
  updateSupplierOrder,
} from "../Controllers/SupplierOrderController.js";

const router = express.Router();

//  Create a new supplier order
router.post("/create", createSupplierOrder);

//get SoNo
router.get("/SoNo", getSONo);

//get all supplier orders
router.get("/all", getAllSupplierOrders);

//update supplier order
router.put("/update/:id", updateSupplierOrder);

//get one supplier order
 router.get("/:id", getSupplierOrderById); // Uncomment if you implement this

 //approved supplier order
 router.put("/approve/:id",approveSupplierOrder)

 //get pending orders
 router.get("/pending-orders", getPendingOrders);  

export default router;
