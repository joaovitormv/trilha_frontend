# CineComp - Trilha Trainee Frontend Comp Júnior

O CineComp é uma aplicação web moderna e responsiva para gestão e visualização de um catálogo de filmes. O projeto faz parte do desafio da **Trilha Trainee de Frontend da Comp Júnior**, com foco em uma arquitetura robusta, escalável e tipada, e uma boa experiência de usuário (UX/UI) com design *Dark Mode*.

## Funcionalidades

* **Catálogo de Filmes**: listagem paginada com busca, filtros (gênero, diretor, ano, nota mínima) e ordenação, com *skeletons* durante o carregamento.
* **CRUD de Filmes**: cadastro, visualização, edição e exclusão, com validação centralizada (ano entre 1888 e 2100, nota de 0 a 10).
* **Favoritos**: usuários autenticados favoritam filmes e acompanham a própria lista.
* **Perfil**: edição de nome, e-mail e senha da conta.
* **Autenticação**: login e cadastro com JWT, sessão compartilhada via `AuthContext` e logout automático quando a API responde 401.
* **Home dinâmica**: visitantes veem uma landing page; usuários logados veem um dashboard com os 5 filmes mais recentes e o total do catálogo.
* **Design Responsivo**: layouts para celular, tablet e desktop, com *Split-Screen* nas telas de login e cadastro.

## Tecnologias Utilizadas

* **Frontend**: React 19, Vite
* **Linguagem**: TypeScript
* **Roteamento**: React Router DOM
* **Requisições HTTP**: Axios
* **Ícones**: Lucide React
* **Estilização**: CSS puro, com variáveis globais e padrão *Folder-as-Component*

## Backend (API)

Este frontend consome a API RESTful do projeto backend oficial da trilha, que precisa estar rodando localmente.

* **Repositório da API:** [backend-cinecomp-2026-2](https://github.com/jpedroreiss/backend-cinecomp-2026-2.git)

## Arquitetura do Projeto

```text
src/
├── api/
│   ├── config/        # axiosClient (interceptors) e session (token/usuário no localStorage)
│   ├── services/      # auth, movie, favorite e user services
│   ├── types/         # Interfaces e tipagens
│   └── utils/         # errorHandler (mensagens de erro amigáveis)
├── components/        # Header, Footer, Layout, Button, Modal, Spinner, Skeleton,
│                      # Pagination, FilterBar, AuthLayout, PrivateRoute e
│                      # MovieForm (formulário compartilhado de criar/editar)
├── constants/         # genres.ts (lista única de gêneros aceitos pela API)
├── contexts/          # AuthContext e AuthProvider
├── hooks/             # useAuth, useFeedbackModal, useMovies e useMovie
├── pages/
│   ├── Home/          # Landing (visitante) e dashboard (logado)
│   ├── Filmes/        # Catálogo com filtros e paginação
│   ├── MovieDetails/  # Detalhes, edição e exclusão
│   ├── MovieCreate/   # Cadastro de filme
│   ├── Favorites/     # Filmes favoritados
│   ├── Profile/       # Perfil do usuário
│   ├── Login/
│   └── Cadastro/
├── utils/             # validateMovie (regras de validação dos filmes)
├── index.css          # Variáveis globais (:root), reset e botão .back-btn
├── routes.tsx         # Rotas (públicas, só visitantes e protegidas)
├── App.tsx            # RouterProvider
└── main.tsx           # Montagem raiz do React
```

### Rotas

| Rota | Acesso |
|---|---|
| `/`, `/filmes`, `/filmes/:id` | Públicas |
| `/login`, `/cadastro` | Somente visitantes |
| `/favoritos`, `/filmes/novo`, `/perfil` | Somente logados |

## Estilização e Responsividade

* As cores ficam em variáveis no `:root` de `src/index.css` (`--color-primary`, `--color-surface`, `--color-border`, `--color-text`, etc.). Use-as em vez de valores fixos.
* Os breakpoints são padronizados em **480px**, **768px** e **1024px**, sempre na sintaxe de range, para não deixar "buracos" entre as faixas:

```css
@media (width <= 1024px) { /* desktop pequeno e abaixo */ }
@media (768px < width <= 1024px) { /* só tablet horizontal */ }
@media (width <= 768px) { /* tablet vertical e abaixo */ }
@media (width <= 480px) { /* celulares */ }
```

## Instalação e Execução

### Pré-requisitos

* [Node.js](https://nodejs.org/) 20.19+ ou 22.12+ (exigido pelo Vite 8)
* npm
* Backend da API rodando localmente (normalmente na porta `3001`)

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/joaovitormv/trilha_frontend.git
   cd trilha_frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` na raiz apontando para a sua API:
   ```env
   VITE_API_URL=http://localhost:3001
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra `http://localhost:5173`.

### Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção |
| `npm run lint` | ESLint |
| `npm run preview` | Pré-visualiza o build de produção |

## Autenticação e Interceptors

* O estado de autenticação fica no `AuthProvider`, acessado pelo hook `useAuth()` (`user`, `isAuthenticated`, `login`, `logout`, `updateUser`). Os componentes não leem o `localStorage` diretamente.
* O `localStorage` (chaves `@CineComp:token` e `@CineComp:user`) só é acessado em `src/api/config/session.ts`, porque o `axiosClient` roda fora da árvore do React.
* Um **interceptor de requisição** injeta `Authorization: Bearer <token>` em todas as chamadas.
* Um **interceptor de resposta** trata o **401 de requisições que enviaram token**: limpa a sessão e redireciona para `/login`. Um login com senha errada não dispara o logout, então o erro "credenciais inválidas" continua aparecendo na tela de Login.

## Padrões do Projeto

* **Hooks de dados** (`useMovies`, `useMovie`): cuidam de *loading*, erro e cancelamento de requisições, sem repetir `try/catch` nas páginas.
* **`useFeedbackModal`**: padroniza os modais de sucesso e erro (`variant`, título e mensagem).
* **`MovieForm`**: um único formulário para criar e editar filmes, com a validação em `utils/validateMovie.ts`.
* **`constants/genres.ts`**: fonte única dos gêneros aceitos pela API.