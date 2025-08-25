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
    if (!privateKey || !to || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    const gasLimit = await wallet.estimateGas({
      to,
      value: ethers.parseEther(amount),
    });
    const gasPrice = await provider.getGasPrice();
    const txResponse = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount),
      gasLimit,
      gasPrice,
    });
    const receipt = await txResponse.wait();
    const storedTx = await createTransaction({
      userKey: wallet.address,
      from: wallet.address,
      to,
      amount,
      txHash: txResponse.hash,
      gasLimit: txResponse.gasLimit.toString(),
      gasPrice: txResponse.gasPrice.toString(),
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
