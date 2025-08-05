import { body, validationResult } from "express-validator";

const validateSupplier = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required if provided"),
  body("primaryContactNo")
    .notEmpty()
    .withMessage("Primary contact number is required"),
  body("nic").notEmpty().withMessage("NIC is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("province").notEmpty().withMessage("Province is required"),
  body("district").notEmpty().withMessage("District is required"),
  body("nominatedPerson")
    .notEmpty()
    .withMessage("Nominated person is required"),
  body("nominatedPersonNo")
    .notEmpty()
    .withMessage("Nominated person number is required"),
  body("bank").notEmpty().withMessage("Bank is required"),
  body("bankBranch").notEmpty().withMessage("Bank branch is required"),
  body("bankAccNo").notEmpty().withMessage("Bank account number is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateSupplier;
