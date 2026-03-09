const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getMimeType(caminhoImagem) {
  const ext = path.extname(caminhoImagem).toLowerCase();

  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";

  throw new Error("Formato de imagem não suportado");
}

async function extrairEnderecoDaImagem(caminhoImagem) {
  if (process.env.USE_MOCK_AI === "true") {
    return JSON.stringify({
      logradouro: "Rua Exemplo",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
    });
  }

  const imagemBase64 = fs.readFileSync(caminhoImagem, { encoding: "base64" });
  const mimeType = getMimeType(caminhoImagem);

  const prompt = `
Extraia APENAS o endereço da nota fiscal enviada.

Retorne exclusivamente um JSON válido no formato:
{
  "logradouro": "",
  "numero": "",
  "bairro": "",
  "cidade": "",
  "estado": "",
  "cep": ""
}

Não escreva texto fora do JSON.
Se não encontrar algum campo, retorne "".
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você extrai apenas endereço de notas fiscais e responde só JSON.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imagemBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  return response.choices[0].message.content;
}

module.exports = { extrairEnderecoDaImagem };
