# 🎬 CineComp - Trilha Trainee Frontend Comp Júnior

O CineComp é uma aplicação web moderna e responsiva desenvolvida para a gestão e visualização de um catálogo de filmes. Este projeto faz parte do desafio da **Trilha Trainee de Frontend da Comp Júnior**, com foco em desenvolver uma arquitetura robusta, escalável e tipada, entregando uma excelente experiência de usuário (UX/UI) com um design *Dark Mode*.

## ✨ Funcionalidades

* **Catálogo de Filmes**: Listagem completa de filmes com paginação dinâmica no frontend.
* **Autenticação Segura**: Sistema de Login e Registro com persistência de sessão via JWT (`localStorage`).
* **Gestão de Estado e Rotas**: Navegação fluida do tipo SPA (*Single Page Application*) utilizando React Router DOM.
* **Design Responsivo**: Interface adaptável para dispositivos móveis, tablets e desktops (com layout *Split-Screen* na tela de login).
* **Integração de API**: Consumo assíncrono de API RESTful com interceptação de erros e injeção automática de tokens via Axios.

## 🛠️ Tecnologias Utilizadas

* **Frontend**: React 18, Vite
* **Linguagem**: TypeScript
* **Roteamento**: React Router DOM
* **Requisições HTTP**: Axios
* **Estilização**: CSS puro (com arquitetura *Folder-as-Component*)

## 🔗 Backend (API)

Este frontend foi desenvolvido para consumir a API RESTful construída no projeto backend oficial da trilha. Para que a aplicação funcione corretamente, é necessário rodar a API localmente.

* **Repositório da API:** [backend-cinecomp-2026-2](https://github.com/jpedroreiss/backend-cinecomp-2026-2.git)

## 📂 Arquitetura do Projeto

O projeto segue rigorosamente o padrão **Folder-as-Component**, garantindo um encapsulamento perfeito de lógica e estilo para cada tela e componente.

```text
src/
├── api/
│   ├── config/        # Configuração do Axios e Interceptors globais
│   ├── services/      # Endpoints da API (authService, movieService)
│   └── types/         # Interfaces e Tipagens (TypeScript)
├── components/
│   ├── BaseLayout/    # Layout estrutural base (Header, Footer e Outlet)
│   ├── Button/        # Componentes de UI reutilizáveis
│   ├── Footer/
│   ├── Header/
│   └── Pagination/    # Componente avançado de paginação (UI)
├── pages/
│   ├── Catalog/       # Tela principal do catálogo de filmes
│   ├── Home/          # Landing page (Hero Banner)
│   ├── Login/         # Tela de autenticação e acesso
│   └── Register/      # Tela de criação de nova conta
├── routes.tsx         # Configuração centralizada das rotas da aplicação
├── App.tsx            # Ponto de entrada do Router Provider
└── main.tsx           # Ponto de montagem raiz do React
```

## 🚀 Instalação e Execução

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 16 ou superior)
* npm ou yarn
* Backend da API rodando localmente (normalmente na porta `3001`).

### Passos para rodar o projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/joaovitormv/trilha_frontend.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd trilha_frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente:
   Crie um arquivo chamado `.env.local` na raiz do projeto e adicione a seguinte variável apontando para a sua API rodando localmente:
   ```env
   VITE_API_URL=http://localhost:3001
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Abra o navegador em `http://localhost:5173`.

## 🔐 Autenticação e Interceptores

O frontend se comunica com a API utilizando uma instância centralizada do Axios (`axiosClient`). 
* As requisições que falham por erro de autenticação (401) são tratadas para fornecer feedback visual ao usuário.
* Após um login bem-sucedido, o *Token JWT* é salvo de forma segura no `localStorage` do navegador sob a chave `@CineComp:token`.
* Um **Interceptor de Requisição** captura todas as chamadas feitas para o backend e injeta automaticamente o cabeçalho `Authorization: Bearer <token>`, permitindo acesso transparente às rotas protegidas.