// controllers/supplierOrderController.js
import RawMaterial from "../Models/RawMaterial.js";
import SupplierOrder from "../Models/SupplierOrder.js";
import generateSONumber from "../utils/SoNo.js";
import { getApprovedSupplierMaterials } from "./supplierController.js";

export const createSupplierOrder = async (req, res, next) => {
  try {
    const { supplierId, items, paymentType, deliveryDate, remark } = req.body;

    // ✅ Ensure getApprovedSupplierMaterials returns supplier & materials
    const { supplier, materials } = await getApprovedSupplierMaterials(
      supplierId
    );
    if (!supplier) {
      return res.status(404).json({ message: "Approved supplier not found" });
    }

    // Validate requested items
    const materialMap = new Map(materials.map((m) => [m.materialId, m]));
    const invalidMaterials = items.filter(
      (item) => !materialMap.has(item.materialId)
    );
    if (invalidMaterials.length) {
      return res.status(400).json({
        message: "Some materials are not mapped to the supplier",
        invalidMaterials,
      });
    }

    // Enrich and calculate totals
    let orderTotalValue = 0;
    const enrichedItems = items.map((item) => {
      const material = materialMap.get(item.materialId);
      const materialData = material.toObject ? material.toObject() : material;
      const value = item.qty * material.unitPrice;
      orderTotalValue += value;
      return { ...materialData, qty: item.qty, value };
    });

    // Save order with pending status
    const soNo = await generateSONumber();
    const newOrder = new SupplierOrder({
      soNo,
      supplierId: supplier.supplierId,
      supplierName: supplier.name,
      items: enrichedItems,
      orderTotalValue,
      paymentType,
      deliveryDate,
      remark,
      status: "pending",
    });
    await newOrder.save();

    res.status(201).json({
      message: "Supplier order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
