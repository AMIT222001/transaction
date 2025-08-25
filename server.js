import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes.js";


dotenv.config();
const app = express();
app.use(bodyParser.json());

// Routes
app.use("/", transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
