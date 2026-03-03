🚀 Desafio Técnico – Integração IA + Nota Fiscal
📌 Objetivo

Criar uma API que:

Receba uma imagem de nota fiscal

Envie a imagem para a API da OpenAI

Extraia somente o endereço (com CEP)

Salve o CEP no banco

Retorne apenas o endereço em JSON

🛠 Tecnologias Utilizadas

Node.js

Express

Multer (upload de arquivos)

SQLite (armazenamento de CEPs)

OpenAI API

Dotenv

⚙️ Como Rodar o Projeto
1️⃣ Instalar dependências
npm install
2️⃣ Criar arquivo .env na raiz do projeto
PORT=3000
OPENAI_API_KEY=sua_chave_aqui
USE_MOCK_AI=true

🔹 USE_MOCK_AI=true → Simula resposta da IA (não consome créditos)
🔹 USE_MOCK_AI=false → Utiliza integração real com OpenAI

3️⃣ Iniciar servidor
npm start

Servidor disponível em:

http://localhost:3000
📡 Endpoints
📥 POST /nota-fiscal

Recebe upload de imagem JPG ou PNG.

Configuração no Postman:

Método: POST

URL: http://localhost:3000/nota-fiscal

Body → form-data

Campo: imagem (tipo File)

Retorno esperado:

{
  "logradouro": "",
  "numero": "",
  "bairro": "",
  "cidade": "",
  "estado": "",
  "cep": ""
}
📤 GET /ceps

Lista os CEPs cadastrados no banco.

Exemplo de resposta:

[
  { "cep": "01000-000" },
  { "cep": "02000-000" }
]
🧠 Estrutura do Prompt

A IA é instruída a:

Extrair apenas o endereço da nota fiscal

Retornar exclusivamente JSON

Não incluir texto adicional

Retornar campos vazios caso não encontre informação

💾 Banco de Dados

SQLite local (database.sqlite)

Tabela: ceps

Campos armazenados:

cep

created_at

🔒 Segurança

API Key armazenada em variável de ambiente

.env não deve ser versionado

Uso de .gitignore

📝 Observação

O projeto possui dois modos de funcionamento:

Modo simulado (mock)

Modo integração real com OpenAI

Para alternar, basta modificar no .env:

USE_MOCK_AI=true/false