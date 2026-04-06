<h1 align="center">
  💸 DevBills API
</h1>

<p align="center">
  <strong>API RESTful para gerenciamento de finanças pessoais</strong><br/>
  Controle suas receitas, despesas e categorias com autenticação segura
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-como-rodar">Como Rodar</a> •
  <a href="#-variáveis-de-ambiente">Variáveis de Ambiente</a> •
  <a href="#-endpoints">Endpoints</a>
</p>

---

## 📌 Sobre

O **DevBills API** é o back-end de uma aplicação de controle financeiro pessoal. Desenvolvido com foco em boas práticas de arquitetura, tipagem estática e segurança, oferece endpoints para autenticação de usuários e gerenciamento completo de transações e categorias.

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| **Node.js** | Runtime JavaScript |
| **TypeScript** | Tipagem estática |
| **Express** | Framework HTTP |
| **MongoDB** | Banco de dados NoSQL |
| **Prisma** | ORM / Query Builder |
| **Docker** | Containerização |
| **JWT** | Autenticação stateless |

---

## ✅ Funcionalidades

- [x] Autenticação com JWT (login, registro, refresh token)
- [x] CRUD de transações financeiras (receitas e despesas)
- [x] CRUD de categorias personalizadas
- [x] Filtros por período, tipo e categoria
- [x] Proteção de rotas com middleware de autenticação
- [x] Containerização com Docker

---

## 🐳 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/) e Docker Compose

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/Doug1980/devbills-api.git
cd devbills-api

# Instale as dependências
yarn install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Suba o banco de dados com Docker
docker-compose up -d

# Execute as migrations (se aplicável)
yarn prisma migrate dev

# Inicie o servidor em modo desenvolvimento
yarn dev
```

O servidor estará disponível em `http://localhost:3000`

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DATABASE_URL=mongodb://localhost:27017/devbills

# Autenticação
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
```

---

## 📡 Endpoints

### Auth

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário |
| `POST` | `/auth/login` | Login e geração do token |

### Transações

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/transactions` | Lista transações do usuário |
| `POST` | `/transactions` | Cria nova transação |
| `PUT` | `/transactions/:id` | Atualiza transação |
| `DELETE` | `/transactions/:id` | Remove transação |

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/categories` | Lista categorias |
| `POST` | `/categories` | Cria nova categoria |
| `DELETE` | `/categories/:id` | Remove categoria |

> 🔒 Todas as rotas (exceto auth) exigem o header `Authorization: Bearer <token>`

---

## 🌐 Deploy

A API está disponível em produção. Acesse:

> 🔗 `https://devbills-frontend-xi.vercel.app/` *(atualize com o link real)*

---

## 👨‍💻 Autor

Feito por **Douglas** — Desenvolvedor Full Stack 🚀

[![GitHub](https://img.shields.io/badge/GitHub-Doug1980-181717?style=flat&logo=github)](https://github.com/Doug1980)
