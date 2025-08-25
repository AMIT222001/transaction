import express from "express";
import { sendTransaction, listTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/send", sendTransaction);
router.get("/transactions/:userAddress", listTransactions);

export default router;
