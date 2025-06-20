# 🚀 Sistema de Gerenciamento de Usuários - Desafio Full-Stack

![Status do Projeto](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen)
![Linguagem Principal](https://img.shields.io/github/languages/top/Danilhell/conectar-user-manager)

## 📝 Descrição

Aplicação full-stack completa desenvolvida como parte de um processo seletivo para a vaga de Desenvolvedor Full-Stack Pleno. O sistema permite o cadastro e autenticação de usuários através de email/senha e também via OAuth 2.0 com o Google, com um sistema de permissões baseado em papéis (admin/user).

O projeto foi construído com as tecnologias mais modernas do ecossistema JavaScript/TypeScript, incluindo NestJS para o backend e React para o frontend, rodando em um ambiente containerizado com Docker e WSL2.

---

## 📸 Preview da Aplicação

![Preview da Aplicação](https://github.com/Danlihell/conectar-user-manager/blob/main/teste.gif?raw=true)

---

## ✨ Features Implementadas

### Backend
- ✅ API RESTful segura e modular.
- ✅ Autenticação dupla: Email/Senha (JWT) e Login Social (Google OAuth 2.0).
- ✅ Autorização baseada em papéis (RBAC) para rotas de administrador.
- ✅ Criptografia de senhas com `bcrypt`.
- ✅ CRUD completo de usuários com permissões específicas.
- ✅ Endpoint de API com filtros e ordenação (`/users?role=admin&sortBy=name`).
- ✅ Endpoint de negócio para listar usuários inativos.
- ✅ Configuração de segurança com variáveis de ambiente (`.env`).
- ✅ Documentação de API interativa com **Swagger**.
- ✅ Base de testes unitários e E2E com **Jest** e Supertest.

### Frontend
- ✅ Interface reativa e moderna com React, TypeScript e Vite.
- ✅ Estilização profissional e responsiva com **Tailwind CSS**.
- ✅ **Dark Mode** (tema claro e escuro) com persistência no `localStorage`.
- ✅ Navegação e rotas protegidas com **React Router**.
- ✅ Gerenciamento de estado de autenticação global com **Context API**.
- ✅ Fluxo completo: Cadastro (com confirmação de senha), Login (local e Google), Perfil de Usuário (com atualização) e Dashboard de Admin.
- ✅ Painel de Admin interativo com listagem, exclusão, filtros e ordenação de usuários.

---

## 🛠️ Stack de Tecnologias

- **Backend:** Node.js, TypeScript, NestJS, PostgreSQL, Docker, TypeORM, Passport.js, JWT, Jest.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios.
- **Ambiente:** WSL2 (Ubuntu), Git.

---

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para executar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose
- Um ambiente Linux ou WSL2 (recomendado)
- [Git](https://git-scm.com/)

### 1. Clonar o Repositório
```bash
git clone [https://github.com/Danilhell/conectar-user-manager.git](https://github.com/Danilhell/conectar-user-manager.git)
cd conectar-user-manager