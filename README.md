# 🚀 Sistema de Gerenciamento de Usuários - Desafio Full-Stack

![Status do Projeto](https://img.shields.io/badge/status-funcionalidades_concluídas-blue)
![Linguagem Principal](https://img.shields.io/github/languages/top/Danilhell/conectar-user-manager)

## 📝 Descrição

Aplicação full-stack completa desenvolvida como parte do processo seletivo para a vaga de Desenvolvedor Full-Stack Pleno. O sistema permite o cadastro e autenticação de usuários através de email/senha e também via OAuth 2.0 com o Google, com um sistema de permissões baseado em papéis (admin/user).

O projeto foi construído com as tecnologias mais modernas do ecossistema JavaScript/TypeScript, incluindo NestJS para o backend e React para o frontend, rodando em um ambiente containerizado com Docker e WSL2 para garantir consistência e performance.

---

## 📸 Preview da Aplicação

*(Lembre-se de substituir este texto pela sua imagem ou GIF!)*
![Preview da Aplicação](https://github.com/Danilhell/conectar-user-manager/blob/main/teste.gif?raw=true)

---

## ✨ Features Implementadas

### Backend
- ✅ **API RESTful Segura e Modular:** Arquitetura organizada em módulos (`Users`, `Auth`).
- ✅ **Autenticação Dupla:** Suporte para login com Email/Senha (JWT) e Login Social (Google OAuth 2.0).
- ✅ **Autorização Baseada em Papéis (RBAC):** Rotas protegidas que só permitem acesso a usuários com o papel (`role`) de `admin`.
- ✅ **Segurança de Senhas:** Criptografia de senhas utilizando `bcrypt`.
- ✅ **CRUD Completo de Usuários:** Funcionalidades para criar, ler, atualizar e excluir usuários com permissões específicas para cada papel.
- ✅ **API Avançada:** Endpoint de listagem com suporte a filtros (por `role`) e ordenação (por `name` ou `createdAt`).
- ✅ **Lógica de Negócio:** Endpoint para relatório de usuários inativos (sem login há mais de 30 dias).
- ✅ **Configuração Profissional:** Uso de variáveis de ambiente (`.env`) para dados sensíveis.
- ✅ **Documentação de API Interativa:** Gerada automaticamente com **Swagger** (`/api`).
- ✅ **Qualidade de Código:** Base de testes unitários e E2E implementada com **Jest** e Supertest.

### Frontend
- ✅ **Interface Reativa e Moderna:** Construída com React, TypeScript e Vite.
- ✅ **Design Profissional:** Estilização com **Tailwind CSS** e design responsivo.
- ✅ **Dark Mode:** Tema claro e escuro com persistência da preferência do usuário.
- ✅ **Navegação Inteligente:** Rotas protegidas e redirecionamento dinâmico baseado no papel do usuário com **React Router**.
- ✅ **Gerenciamento de Estado Global:** **Context API** para um controle de autenticação centralizado e fluido.
- ✅ **Fluxo de Usuário Completo:** Cadastro (com confirmação de senha), Login (local e Google), Perfil (com atualização de dados) e Logout.
- ✅ **Painel de Admin Interativo:** Com listagem, exclusão, filtros e ordenação de usuários em tempo real.

---

## 🏛️ Decisões de Arquitetura e Design

- **Backend (NestJS):** Escolhido sobre alternativas como Express.js pela sua arquitetura opinativa e modular, que promove organização e escalabilidade. O uso de TypeScript nativo e o sistema de Injeção de Dependência facilitam a manutenção e, principalmente, a criação de testes.
- **Frontend (React + Vite):** Vite foi escolhido como ferramenta de build pela sua velocidade superior de desenvolvimento (HMR) em comparação com alternativas como o Create React App. React foi utilizado por sua popularidade e ecossistema robusto para a criação de SPAs.
- **Banco de Dados (PostgreSQL + Docker):** PostgreSQL foi escolhido por ser um banco de dados relacional robusto e confiável. O uso do Docker para containerizar o banco garante que qualquer desenvolvedor possa rodar o projeto com um único comando, sem precisar instalar o PostgreSQL em sua máquina, criando um ambiente de desenvolvimento consistente.
- **Autenticação (JWT + Passport.js):** A estratégia de JWT foi escolhida por ser o padrão da indústria para APIs RESTful stateless. A biblioteca Passport.js foi utilizada para abstrair e facilitar a implementação de múltiplas estratégias de autenticação (JWT e Google OAuth).
- **Estilo (Tailwind CSS):** A abordagem utility-first do Tailwind CSS foi escolhida para agilizar a criação de uma UI customizada e responsiva, sem a necessidade de escrever CSS tradicional.
- **Ambiente de Desenvolvimento (WSL2):** Após enfrentar conflitos de ferramentas no Windows, a migração para o WSL2 foi uma decisão estratégica para garantir um ambiente Linux estável, performático e livre de incompatibilidades, replicando um ambiente de produção mais fielmente.

---

## ⚙️ Como Rodar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose
- Um ambiente Linux ou WSL2 (recomendado)
- [Git](https://git-scm.com/)

### 1. Clonar o Repositório
```bash
git clone [https://github.com/Danilhell/conectar-user-manager.git](https://github.com/Danilhell/conectar-user-manager.git)
cd conectar-user-manager