import express from "express";
import cors from "cors";

const app = express();

// Render PORT
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.status(200).json({
    app: "V4ALL",
    status: "RUNNING",
    message: "Backend Express opérationnel 🚀"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
