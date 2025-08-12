// controllers/supplierOrderController.js
import Supplier from "../Models/Supplier.js";
import SupplierOrder from "../Models/SupplierOrder.js";
import SupplierMaterialMapping from "../Models/SupplierMaterialMapping.js";
import generateSONumber from "../utils/SoNo.js";

export const createSupplierOrder = async (req, res, next) => {
  try {
    const { supplierId, items, paymentType, deliveryDate, remark } = req.body;

    // Validate supplier
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Get mapped materials for supplier
    const mapping = await SupplierMaterialMapping.findOne({
      supplier: supplier._id,
    }).populate("materials");
    if (!mapping) {
      return res
        .status(404)
        .json({ message: "No materials mapped to this supplier" });
    }

    const materials = mapping.materials;

    // Map materialId => material doc for fast lookup
    const materialMap = new Map(materials.map((m) => [m.materialId, m]));

    // Validate requested items
    const invalidMaterials = items.filter(
      (item) => !materialMap.has(item.materialId)
    );
    if (invalidMaterials.length) {
      return res.status(400).json({
        message: "Some materials are not mapped to the supplier",
        invalidMaterials,
      });
    }

    // Enrich items and calculate total
    let orderTotalValue = 0;
    const enrichedItems = [];

    for (const item of items) {
      const material = materialMap.get(item.materialId);
      if (!material) {
        return res.status(400).json({
          message: `Material not found for materialId: ${item.materialId}`,
        });
      }

      const qty = Number(item.qty);
      const unitPrice = Number(item.unitPrice); //fixed

      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ message: "Invalid quantity for item" });
      }
      if (isNaN(unitPrice) || unitPrice < 0) {
        return res
          .status(400)
          .json({ message: "Invalid unit price for material" });
      }

      const value = qty * unitPrice;
      orderTotalValue += value;

      enrichedItems.push({
        materialId: material.materialId,
        materialName: material.materialName,
        unitPrice: unitPrice,
        qty,
        unitName: material.unit, // added unitName here (was missing)
        value,
      });
    }

    // Generate SO number
    const SONo = await generateSONumber();

    // Create and save order
    const newOrder = new SupplierOrder({
      SONo,
      supplierId: supplier.supplierId,
      supplierName: supplier.name,
      items: enrichedItems,
      orderTotalValue,
      paymentType,
      deliveryDate,
      remark,
      status: "pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(201).json({
      message: "Supplier order created successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

//get So No

export const getSONo = async (req, res, next) => {
  try {
    const SONo = await generateSONumber();
    res.status(200).json({ SONo });
  } catch (error) {
    next(error);
  }
};

//get all supplier orders
export const getAllSupplierOrders = async (req, res, next) => {
  try {
    const orders = await SupplierOrder.find();
    res.status(200).json(orders);
    console.log(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! update order
export const updateSupplierOrder = async (req, res, next) => {
  try {
    const { id } = req.params; // Order ID from URL
    const { supplierId, items, paymentType, deliveryDate, remark, status } = req.body;

    // Find existing order
    const existingOrder = await SupplierOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Supplier order not found" });
    }

    // Validate supplier
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Get mapped materials
    const mapping = await SupplierMaterialMapping.findOne({
      supplier: supplier._id,
    }).populate("materials");

    if (!mapping) {
      return res.status(404).json({
        message: "No materials mapped to this supplier",
      });
    }

    const materials = mapping.materials;
    const materialMap = new Map(materials.map((m) => [m.materialId, m]));

    // Validate requested items
    const invalidMaterials = items.filter(
      (item) => !materialMap.has(item.materialId)
    );
    if (invalidMaterials.length) {
      return res.status(400).json({
        message: "Some materials are not mapped to the supplier",
        invalidMaterials,
      });
    }

    // Enrich items & calculate total
    let orderTotalValue = 0;
    const enrichedItems = [];

    for (const item of items) {
      const material = materialMap.get(item.materialId);

      const qty = Number(item.qty);
      const unitPrice = Number(item.unitPrice); // Accept from frontend

      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ message: "Invalid quantity for item" });
      }
      if (isNaN(unitPrice) || unitPrice < 0) {
        return res.status(400).json({ message: "Invalid unit price for material" });
      }

      const value = qty * unitPrice;
      orderTotalValue += value;

      enrichedItems.push({
        materialId: material.materialId,
        materialName: material.materialName,
        unitPrice,
        qty,
        unitName: material.unit,
        value,
      });
    }

    // Update fields
    existingOrder.supplierId = supplier.supplierId;
    existingOrder.supplierName = supplier.name;
    existingOrder.items = enrichedItems;
    existingOrder.orderTotalValue = orderTotalValue;
    existingOrder.paymentType = paymentType;
    existingOrder.deliveryDate = deliveryDate;
    existingOrder.remark = remark;
    existingOrder.status = "pending"; // Reset status to pending on update
    existingOrder.updatedAt = new Date();

    await existingOrder.save();

    res.json({
      message: "Supplier order updated successfully",
      order: existingOrder,
    });
  } catch (error) {
    next(error);
  }
};

//!approved suppleir order
export const approveSupplierOrder = async (req, res, next) => {
  try {
    const id = req.params.id;

    const order = await SupplierOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Supplier order not found" });
    }

    // Update status to "approved"
    order.status = "approved";
    await order.save();

    res.status(200).json({
      message: "Supplier order approved successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

//!getSupplierOrderById

export const getSupplierOrderById = async (req, res, next) => {
  try {
    const { id } = req.params; // Order ID from URL
    const order = await SupplierOrder.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Supplier order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

//!get pending orders
export const getPendingOrders = async (req, res, next) => {
  try {
    const pendingOrders = await SupplierOrder.find({ status: "pending" });
    res.status(200).json(pendingOrders);
  } catch (error) {
    next(error);
  }
};