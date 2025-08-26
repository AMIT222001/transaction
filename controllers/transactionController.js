import { ethers } from "ethers";
import dotenv from "dotenv";
import {
  createTransaction,
  getTransactionsByUser,
} from "../models/transactionModel.js";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export async function sendTransaction(req, res) {
  try {
    const { privateKey, to, amount } = req.body;

    // Validate input
    if (!privateKey || !to || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const wallet = new ethers.Wallet(privateKey, provider);

    // Convert amount to BigInt (wei)
    const value = ethers.parseEther(amount.toString());

    // Estimate gas limit
    const gasLimit = await provider.estimateGas({
      to,
      value,
      from: wallet.address,
    });

    // Get fee data (EIP-1559 compatible)
    const feeData = await provider.getFeeData();

    // Create transaction object
    const tx = {
      to,
      value,
      gasLimit,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      // DO NOT include gasPrice for EIP-1559 tx
    };

    // Send transaction
    const txResponse = await wallet.sendTransaction(tx);

    // Wait for transaction to be mined
    const receipt = await txResponse.wait();

    // Store transaction in database
    const storedTx = await createTransaction({
      userKey: wallet.address,
      from: wallet.address,
      to,
      amount,
      txHash: txResponse.hash,
      gasLimit: gasLimit.toString(),
      maxFeePerGas: feeData.maxFeePerGas.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toString(),
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? "confirmed" : "failed",
    });

    res.json({
      message: "Transaction sent and stored successfully",
      txHash: txResponse.hash,
      storedTx,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function listTransactions(req, res) {
  try {
    const { userAddress } = req.params;
    const transactions = await getTransactionsByUser(userAddress);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
