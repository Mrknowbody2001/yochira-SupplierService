import Supplier from "../Models/Supplier.js";
import generateSupplierId from "../utils/SupplerId.js";

//create supplier
export const createSupplier = async (req, res, next) => {
  try {
    const supplierId = await generateSupplierId();
    // Create a new Supplier instance with body data + supplierId
    const supplier = new Supplier({
      ...req.body,
      supplierId,
      status: "pending",
    });

    await supplier.save();

    res.status(200).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    next(error); // ✅ Let the global error handler handle this
  }
};

//! get suppler id

export const getSupplierId = async (req, res, next) => {
  try {
    const supplierId = await generateSupplierId();
    res.status(200).json({ supplierId });
  } catch (error) {
    next(error);
  }
};

// delete supplier
export const deleteSupplier = async (req, res, next) => {
  try {
    await Supplier.findByIdAndDelete(req.body.id);
    res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
    next(error);
  }
};

// update supplier
export const updateSupplier = async (req, res, next) => {
  try {
    const supplierId = req.params.id;
    const updateData = {
      ...req.body,
      status: "pending",
    };

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Supplier with this email already exists" });
    }
    res.status(500).json({
      message: "Internal server error",
      error,
    });
    next(error);
  }
};

//get all suppliers
export const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({
      message: "Suppliers fetched successfully",
      suppliers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
    next(error);
  }
};

//get one supplier
export const getOneSupplier = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const supplier = await Supplier.findById(Id);
    //
    if (!Id || Id === "undefined") {
      console.error("Supplier ID is missing or undefined");
      return res.status(400).json({ message: "Supplier ID is required" });
    }
    // Check if supplier exists
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json({
      message: "Supplier fetched successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
    next(error);
  }
};

// approved supplier
