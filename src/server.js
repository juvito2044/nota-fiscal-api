require("dotenv").config()

const express = require("express")
const cors = require("cors")
const notaFiscalRoutes = require("./routes/notaFiscalRoutes")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/", notaFiscalRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT))