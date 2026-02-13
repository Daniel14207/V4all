import express from "express";
import cors from "cors";

const app = express();

// Render manome PORT automatique
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route test (homepage)
app.get("/", (req, res) => {
  res.status(200).json({
    app: "V4ALL",
    status: "RUNNING",
    message: "Backend Express opérationnel 🚀"
  });
});

// Health check (Render aime an’io)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Lancement serveur
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
