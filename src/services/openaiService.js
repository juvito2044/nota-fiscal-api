const OpenAI = require("openai")
const fs = require("fs")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function extrairEnderecoDaImagem(caminhoImagem) {
  // ✅ MODO MOCK (sem custo)
  if (process.env.USE_MOCK_AI === "true") {
    return JSON.stringify({
      logradouro: "Rua Exemplo",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000"
    })
  }

  // ✅ MODO REAL (quando tiver crédito/billing)
  const imagemBase64 = fs.readFileSync(caminhoImagem, { encoding: "base64" })

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
Se não encontrar algum campo, retorne "" (string vazia).
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Você extrai apenas endereço de notas fiscais e responde só JSON." },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imagemBase64}` }
          }
        ]
      }
    ],
    max_tokens: 300
  })

  return response.choices[0].message.content
}

module.exports = { extrairEnderecoDaImagem }