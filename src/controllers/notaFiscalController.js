const path = require("path");
const fs = require("fs");
const db = require("../database/database");
const { extrairEnderecoDaImagem } = require("../services/openaiService");

function validarEndereco(endereco) {
  const campos = ["logradouro", "numero", "bairro", "cidade", "estado", "cep"];

  for (const c of campos) {
    if (!(c in endereco)) return false;
    if (typeof endereco[c] !== "string") return false;
  }

  return true;
}

async function enviarNotaFiscal(req, res) {
  let caminhoImagem = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Imagem é obrigatória" });
    }

    caminhoImagem = path.resolve(req.file.path);

    const respostaIA = await extrairEnderecoDaImagem(caminhoImagem);

    let endereco;
    try {
      endereco = JSON.parse(respostaIA);
    } catch {
      return res.status(500).json({ error: "Resposta inválida da IA (não é JSON)" });
    }

    if (!validarEndereco(endereco)) {
      return res.status(500).json({ error: "Resposta inválida da IA (campos faltando)" });
    }

    const cepDigits = endereco.cep.replace(/\D/g, "");

    if (cepDigits.length !== 8) {
      return res.status(400).json({ error: "CEP não encontrado ou inválido" });
    }

    const cepFormatado = cepDigits.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    endereco.cep = cepFormatado;

    db.run(
      "INSERT INTO ceps (cep, created_at) VALUES (?, ?)",
      [cepFormatado, new Date().toISOString()],
      (err) => {
        if (err) {
          console.error("Erro ao salvar CEP:", err);
        }
      }
    );

    return res.json(endereco);
  } catch (error) {
    console.error("ERRO /nota-fiscal:", error);
    return res.status(500).json({
      error: error.message || "Erro ao processar nota fiscal",
    });
  } finally {
    if (caminhoImagem && fs.existsSync(caminhoImagem)) {
      fs.unlink(caminhoImagem, (err) => {
        if (err) console.error("Erro ao remover arquivo temporário:", err);
      });
    }
  }
}

function listarCeps(req, res) {
  db.all("SELECT cep FROM ceps ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar CEPs" });
    }

    return res.json(rows);
  });
}

module.exports = { enviarNotaFiscal, listarCeps };
