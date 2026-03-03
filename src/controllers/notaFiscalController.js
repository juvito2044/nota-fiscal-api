const path = require("path")
const db = require("../database/database")
const { extrairEnderecoDaImagem } = require("../services/openaiService")

function validarEndereco(endereco) {
  const campos = ["logradouro", "numero", "bairro", "cidade", "estado", "cep"]
  for (const c of campos) {
    if (!(c in endereco)) return false
    if (typeof endereco[c] !== "string") return false
  }
  return true
}

async function enviarNotaFiscal(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Imagem é obrigatória" })
    }

    const caminhoImagem = path.resolve(req.file.path)

    const respostaIA = await extrairEnderecoDaImagem(caminhoImagem)

    let endereco
    try {
      endereco = JSON.parse(respostaIA)
    } catch {
      return res.status(500).json({ error: "Resposta inválida da IA (não é JSON)" })
    }

    if (!validarEndereco(endereco)) {
      return res.status(500).json({ error: "Resposta inválida da IA (campos faltando)" })
    }

    // valida CEP minimamente (só dígitos e tamanho)
    const cepDigits = endereco.cep.replace(/\D/g, "")
    if (cepDigits.length !== 8) {
      return res.status(400).json({ error: "CEP não encontrado ou inválido" })
    }

    // salva CEP no banco
    db.run(
      "INSERT INTO ceps (cep, created_at) VALUES (?, ?)",
      [endereco.cep, new Date().toISOString()],
      (err) => {
        if (err) console.error("Erro ao salvar CEP:", err)
      }
    )

    // retorna apenas o endereço em JSON (exigido)
    return res.json(endereco)
  } catch (error) {
    console.error("ERRO /nota-fiscal:", error)
    return res.status(500).json({ error: "Erro ao processar nota fiscal" })
  }
}

function listarCeps(req, res) {
  db.all("SELECT cep FROM ceps ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar CEPs" })
    return res.json(rows)
  })
}

module.exports = { enviarNotaFiscal, listarCeps }