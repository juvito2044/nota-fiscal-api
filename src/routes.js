const express = require("express");
const router = express.Router();
const upload = require("./middlewares/upload");

// Rota teste
router.get("/", (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

// POST /nota-fiscal
router.post("/nota-fiscal", upload.single("imagem"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Imagem é obrigatória" });
    }

    res.status(200).json({
      message: "Imagem recebida com sucesso",
      file: req.file.filename
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;