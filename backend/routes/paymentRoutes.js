import express from "express";
import {
  createPaypalOrder,
  capturePaypalOrder,
} from "../controller/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createPaypalOrder);
router.post("/capture-order", authMiddleware, capturePaypalOrder);

export default router;
