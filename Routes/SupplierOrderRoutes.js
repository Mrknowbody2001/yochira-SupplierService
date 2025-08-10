import express from "express";
import { createSupplierOrder } from "../Controllers/SupplierOrderController.js";


const router = express.Router();

//  Create a new supplier order
router.post("/create", createSupplierOrder);

export default router;
