import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import SupplierRoutes from "./Routes/supplierRoutes.js";
import mappingRouter from "./Routes/MappingRoutes.js";
import materialRoute from "./Routes/MaterailRoutes.js";
import supplierOrderRoutes from "./Routes/SupplierOrderRoutes.js";
dotenv.config(); //  Always load env variables as early as possible

const app = express();

//  Middleware Setup
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

//  Routes
app.use("/api/supplier", SupplierRoutes);
app.use ("/api/mapping", mappingRouter); 
app.use("/api/materials", materialRoute); 
app.use("/api/supplier-orders", supplierOrderRoutes);

//  Error Handler (placed after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

//! Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

// ✅ Start server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
