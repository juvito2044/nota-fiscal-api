const express = require("express")
const router = express.Router()

const upload = require("../middlewares/upload")
const { enviarNotaFiscal, listarCeps } = require("../controllers/notaFiscalController")

router.get("/", (req, res) => {
  res.json({ message: "API funcionando 🚀" })
})

router.post("/nota-fiscal", upload.single("imagem"), enviarNotaFiscal)
router.get("/ceps", listarCeps)

module.exports = router