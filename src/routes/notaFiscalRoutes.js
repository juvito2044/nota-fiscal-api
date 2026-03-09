const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { enviarNotaFiscal, listarCeps } = require("../controllers/notaFiscalController");

router.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

router.post(
  "/nota-fiscal",
  (req, res, next) => {
    upload.single("imagem")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  enviarNotaFiscal
);

router.get("/ceps", listarCeps);

module.exports = router;
