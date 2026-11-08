# CineComp - Trilha Trainee Frontend Comp Júnior

O CineComp é uma aplicação web responsiva para gestão e visualização de um catálogo de filmes. O projeto faz parte do desafio da **Trilha Trainee de Frontend da Comp Júnior (2026.2)**, com foco em uma arquitetura organizada, tipada e escalável, e em uma boa experiência de uso (UX/UI) em *Dark Mode*.

> **Vídeo de demonstração:** _adicione aqui o link do vídeo_

## Sumário

1. [Funcionalidades](#funcionalidades)
2. [Tecnologias e justificativas](#tecnologias-e-justificativas)
3. [Backend (API)](#backend-api)
4. [Instalação e execução](#instalação-e-execução)
5. [Como testar o projeto](#como-testar-o-projeto)
6. [Arquitetura do projeto](#arquitetura-do-projeto)
7. [Lógicas implementadas](#lógicas-implementadas)
8. [Estilização e responsividade](#estilização-e-responsividade)
9. [Decisões de projeto](#decisões-de-projeto)
10. [Limitações conhecidas e melhorias futuras](#limitações-conhecidas-e-melhorias-futuras)

---

## Funcionalidades

* **Catálogo de filmes**: listagem paginada com busca por texto, filtros (gênero, diretor, ano e nota mínima), ordenação e *skeletons* durante o carregamento.
* **CRUD completo de filmes**: cadastro, visualização, edição e exclusão (com confirmação), todos com validação dos campos e mensagens de erro/sucesso.
* **Favoritos**: usuários autenticados favoritam e desfavoritam filmes e acompanham a própria lista.
* **Perfil**: edição de nome, e-mail e, opcionalmente, senha da conta.
* **Autenticação**: cadastro, login por e-mail e senha (JWT), sessão mantida ao recarregar a página e logout.
* **Rotas protegidas**: Favoritos, Cadastro de filme e Perfil só abrem para usuários logados; Login e Cadastro só abrem para visitantes.
* **Home dinâmica**: visitantes veem uma landing page; usuários logados veem um dashboard com os 5 filmes mais recentes e o total do catálogo.
* **Tratamento de erros**: falhas de conexão, tempo esgotado e respostas inválidas da API aparecem em modais com mensagens amigáveis.
* **Feedback visual**: *skeletons* nas listagens, indicador de carregamento nos botões de envio, modais de sucesso, erro e confirmação.
* **Design responsivo**: layouts para celular, tablet e desktop, com menu hambúrguer, filtros recolhíveis e tela dividida (*split-screen*) em login e cadastro.
* **Página de créditos** (`/creditos`): informações sobre o projeto; os links do rodapé apontam para ela.

---

## Tecnologias e justificativas

| Tecnologia | Para que serve | Por que foi escolhida |
|---|---|---|
| **React 19** | Construção da interface | Recomendada pelo desafio; a composição por componentes facilita reutilizar Header, Footer, Modal, formulários etc. |
| **TypeScript** | Tipagem estática | Evita erros de formato dos dados da API (filmes, usuário, paginação) e deixa o código mais fácil de manter. |
| **Vite** | Servidor de desenvolvimento e build | Inicialização e atualização muito rápidas; configuração mínima. |
| **React Router DOM 7** | Rotas e navegação | Rotas aninhadas permitem separar as áreas pública, só-visitante e protegida com *layout routes*. |
| **Axios** | Requisições HTTP | Os *interceptors* permitem anexar o token e tratar o 401 em um único lugar, além de timeout e tratamento de erro padronizado. |
| **Lucide React** | Ícones | Biblioteca leve, com ícones consistentes e tipados. |
| **CSS puro** | Estilização | Sem dependência extra; variáveis CSS e *media queries* bastam para o tema escuro e a responsividade. Cada componente tem seu próprio `styles.css`. |
| **ESLint** (+ regras de React Hooks) | Qualidade de código | Detecta erros comuns de hooks e mantém o padrão do código. |

---

## Backend (API)

O frontend consome a **CineComp API**, o back-end oficial da trilha (Opção 1, recomendada). Ela usa Node.js, Express, SQLite e JWT, e **não exige instalar banco de dados**: o arquivo do banco é criado automaticamente.

* **Repositório:** [backend-cinecomp-2026-2](https://github.com/jpedroreiss/backend-cinecomp-2026-2.git)

### Rodando o backend

```bash
git clone https://github.com/jpedroreiss/backend-cinecomp-2026-2.git
cd backend-cinecomp-2026-2
npm install
npm run dev
```

| Recurso | URL |
|---|---|
| API | `http://localhost:3000` |
| Documentação (Swagger) | `http://localhost:3000/api/docs` |
| Health check | `http://localhost:3000/api/health` |

Para recriar o banco com os dados iniciais, use `npm run reset-db` no projeto do backend.

> O backend libera CORS para `http://localhost:5173` (porta padrão do Vite). Se mudar a porta do frontend, ajuste `FRONTEND_URL` no `.env` do backend.

### Usuário de teste

A API já traz um usuário pronto, útil para testar o login sem precisar criar uma conta:

| Campo | Valor |
|---|---|
| E-mail | `marcospaulo@compjunior.com.br` |
| Senha | `PaczinBalaTensa000-` |

### Endpoints consumidos

| Serviço | Método e rota |
|---|---|
| Autenticação | `POST /api/auth/login`, `POST /api/auth/register` |
| Filmes | `GET /api/movies` (com filtros e paginação), `GET /api/movies/:id`, `POST /api/movies`, `PUT /api/movies/:id`, `DELETE /api/movies/:id` |
| Favoritos | `GET /api/favorites`, `POST /api/favorites/:movieId`, `DELETE /api/favorites/:movieId` |
| Usuário | `GET /api/users/me`, `PUT /api/users/me` |

---

## Instalação e execução

### Pré-requisitos

* [Node.js](https://nodejs.org/) **20.19+ ou 22.12+** (exigido pelo Vite 8)
* npm (já vem com o Node.js)
* Git
* Backend da API rodando (veja a seção anterior)

### Passo a passo

1. **Suba o backend** em um terminal (`npm run dev` na pasta da API) e confirme que `http://localhost:3000/api/health` responde.

2. **Clone o frontend** em outro terminal:
   ```bash
   git clone https://github.com/joaovitormv/trilha_frontend.git
   cd trilha_frontend
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configure a URL da API.** Copie o arquivo de exemplo e ajuste o valor:

   Linux/macOS:
   ```bash
   cp .env.example .env
   ```
   Windows (PowerShell):
   ```powershell
   Copy-Item .env.example .env
   ```

   Conteúdo do `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   > Sem esse arquivo (ou com a URL errada) as telas mostram o erro "Erro de Conexão". Reinicie o `npm run dev` depois de alterar o `.env`.

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

6. **Abra** `http://localhost:5173` no navegador.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com recarregamento automático |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção na pasta `dist` |
| `npm run lint` | Análise de código com ESLint |
| `npm run preview` | Pré-visualiza o build de produção localmente |

---

## Como testar o projeto

Com o backend e o frontend rodando, siga o roteiro abaixo no navegador. Ele cobre todas as telas e os principais fluxos.

### Roteiro de testes funcionais

| # | O que testar | Como | Resultado esperado |
|---|---|---|---|
| 1 | Home de visitante | Abra `/` sem estar logado | Landing page com botões de login e cadastro |
| 2 | Catálogo público | Abra `/filmes` | Lista de filmes com *skeletons* ao carregar; busca, filtros, ordenação e paginação funcionam |
| 3 | Detalhes | Clique em um filme | Página com pôster, sinopse, diretor, ano e nota |
| 4 | Cadastro | `/cadastro`: deixe campos vazios e envie; depois preencha corretamente | Modal "Campos Obrigatórios"; depois modal "Conta Criada!" e redirecionamento ao login |
| 5 | Login inválido | `/login` com senha errada | Modal de erro, sem entrar |
| 6 | Login válido | Use o [usuário de teste](#usuário-de-teste) | Redireciona para a Home logada; o Header mostra "Favoritos", "Perfil" e "Sair" |
| 7 | Dashboard | Home logada | Boas-vindas, total de filmes e os 5 mais recentes |
| 8 | Criar filme | `/filmes/novo`: envie vazio; use ano `1500`; use nota `11`; depois preencha corretamente | Modais "Campos Obrigatórios", "Ano Inválido", "Avaliação Inválida"; no sucesso, modal e redirecionamento aos detalhes |
| 9 | Editar filme | Em um filme, clique em "Editar", altere o título e salve | Filme atualizado na tela, sem recarregar |
| 10 | Excluir filme | Clique em "Excluir" e confirme | Modal de confirmação, depois "Filme Excluído" e volta ao catálogo |
| 11 | Favoritos | Favorite um filme nos detalhes e abra `/favoritos`; remova-o da lista | O filme aparece e some da lista |
| 12 | Perfil | `/perfil`: edite o nome e salve | Modal "Perfil Atualizado"; o novo nome aparece na Home |
| 13 | Rota protegida | Saia da conta e abra `/favoritos` direto na barra de endereço | Redireciona para `/login` |
| 14 | Rota só de visitante | Logado, abra `/login` | Redireciona para `/` |
| 15 | Logout | Clique em "Sair" e confirme | Volta ao login e a sessão é limpa |
| 16 | Sessão expirada (401) | Logado, abra o DevTools (F12) > *Application* > *Local Storage* e troque o valor de `@CineComp:token` por `invalido`; navegue para `/perfil` | Sessão encerrada e redirecionamento ao `/login` |
| 17 | Erro de conexão | Pare o backend e abra `/filmes` | Modal "Erro de Conexão" |

### Roteiro de testes de responsividade

1. Abra o DevTools (F12) e ative a **barra de dispositivos** (`Ctrl+Shift+M` no Chrome e Firefox).
2. Teste as larguras **360px** (celular), **768px** (tablet vertical), **1024px** (tablet horizontal) e **1280px** ou mais (desktop). Arraste a borda para conferir também as larguras intermediárias.
3. Percorra todas as telas (Home, Catálogo, Detalhes, Criar/Editar filme, Favoritos, Perfil, Login, Cadastro, Créditos) e confira:

| Largura | O que deve acontecer |
|---|---|
| **Desktop** (acima de 1024px) | Menu completo no Header; grade de filmes em várias colunas; detalhes e criação com pôster ao lado do conteúdo; imagem lateral em login e cadastro |
| **Tablet** (769px a 1024px) | Menu completo; grade de filmes se adapta; formulários mantêm duas colunas |
| **Tablet vertical e celular** (até 768px) | Menu vira **hambúrguer**; filtros do catálogo ficam recolhidos atrás do botão **"Mais filtros"**; detalhes e formulários empilham; login e cadastro escondem a imagem lateral |
| **Celular** (até 480px) | Grade de 2 colunas; botões em largura total; modais empilham os botões |


### Verificações automáticas de código

```bash
npm run lint    # análise estática (ESLint)
npm run build   # checagem de tipos + build de produção
```

---

## Arquitetura do projeto

```text
src/
├── api/
│   ├── config/        # axiosClient (interceptors) e session (token/usuário no localStorage)
│   ├── services/      # authService, movieService, favoriteService e userService
│   ├── types/         # Interfaces e tipagens das respostas e payloads da API
│   └── utils/         # errorHandler (mensagens de erro amigáveis)
├── assets/            # Imagens das telas de login e cadastro
├── components/        # Componentes reutilizáveis
│   ├── AuthLayout/    # Layout em tela dividida de login e cadastro
│   ├── Button/        # Botão com estado de carregamento
│   ├── FilterBar/     # Busca e filtros do catálogo
│   ├── Footer/ Header/ Layout/
│   ├── Modal/         # Modal de erro, sucesso e confirmação
│   ├── MovieForm/     # Formulário compartilhado de criar e editar filme
│   ├── Pagination/
│   ├── PrivateRoute/  # PrivateRoute e PublicOnlyRoute
│   ├── Skeleton/ Spinner/
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
│   ├── Credits/       # Sobre o projeto e créditos
│   ├── Login/
│   └── Cadastro/
├── utils/             # validateMovie (regras de validação dos filmes)
├── index.css          # Variáveis globais (:root), reset e estilos base
├── routes.tsx         # Definição das rotas (públicas, só visitantes e protegidas)
├── App.tsx            # RouterProvider
└── main.tsx           # Montagem raiz do React
```

Cada componente e página segue o padrão **pasta como componente** (*Folder-as-Component*): o `index.tsx` com a lógica e o `styles.css` ao lado, importado só por ele.

### Rotas

| Rota | Acesso |
|---|---|
| `/`, `/filmes`, `/filmes/:id`, `/creditos` | Públicas |
| `/login`, `/cadastro` | Somente visitantes |
| `/favoritos`, `/filmes/novo`, `/perfil` | Somente logados |

---

## Lógicas implementadas

### Autenticação e sessão

* O estado de autenticação fica no **`AuthProvider`**, acessado pelo hook **`useAuth()`**, que expõe `user`, `isAuthenticated`, `login`, `logout` e `updateUser`. Os componentes nunca leem o `localStorage` diretamente.
* O `localStorage` (chaves `@CineComp:token` e `@CineComp:user`) só é acessado em `src/api/config/session.ts`, porque o `axiosClient` roda **fora** da árvore do React. Esse arquivo é o único que conhece as chaves.
* O **`AuthProvider` fica dentro do roteador** (em `routes.tsx`) para poder usar `useNavigate` e redirecionar ao login quando a sessão cai.
* Ao carregar o app, a sessão é restaurada do `localStorage`, então o usuário continua logado depois de recarregar a página.
* **`PrivateRoute`** redireciona visitantes para `/login`; **`PublicOnlyRoute`** redireciona usuários logados para `/`. Ambos usam *layout routes* do React Router, então uma nova rota protegida é só questão de colocá-la no grupo certo.

### Interceptors do Axios

* **Requisição:** injeta `Authorization: Bearer <token>` em todas as chamadas quando há token salvo.
* **Resposta:** trata o **401 de requisições que enviaram token** (sessão expirada ou inválida): limpa a sessão, sincroniza o `AuthContext` e redireciona para `/login`.
* Um login com senha errada **não** dispara o logout, pois a requisição ainda não tem token. Assim, o erro de credenciais continua aparecendo na tela de Login.
* A checagem do token salvo evita disparar o logout várias vezes quando várias requisições falham com 401 ao mesmo tempo.
* A ponte entre o interceptor (fora do React) e o contexto (dentro do React) é feita em `session.ts`, com `setUnauthorizedHandler` e `notifyUnauthorized`.

### Tratamento de erros da API

`getFriendlyApiError` (`src/api/utils/errorHandler.ts`) converte qualquer erro em `{ title, message }` para exibir no modal:

| Situação | Título exibido |
|---|---|
| Sem resposta do servidor (backend desligado, CORS, sem internet) | Erro de Conexão |
| Timeout (10 segundos) | Tempo Esgotado |
| 400 | Dados Inválidos |
| 401 | Acesso Negado |
| 403 | Sem Permissão |
| 404 | Não Encontrado |
| 409 | Conflito de Dados |
| Outros códigos | Erro no Servidor |
| Erro que não vem do Axios | Erro Inesperado |

Quando o back-end envia uma mensagem própria (`response.data.message`), ela tem prioridade sobre o texto padrão.

### Feedback ao usuário

* **`useFeedbackModal`** padroniza os modais de sucesso e erro (variante, título e mensagem) em todas as telas, com `showError`, `showSuccess`, `showApiError` e `closeModal`.
* O **`Modal`** tem três variantes: `error`, `success` e `confirm` (usada para confirmar logout e exclusão).
* **`MovieCardSkeleton`** ocupa o lugar dos cards enquanto a lista carrega; o **`Button`** com `isLoading` mostra um indicador e bloqueia cliques repetidos durante o envio.

### Hooks de dados

* **`useMovies(params, debounceMs)`** busca a lista de filmes e cuida de *loading*, erro e cancelamento de requisições antigas. Refaz a busca sempre que os parâmetros mudam.
  * O estado `isLoading` é **derivado**: fica verdadeiro sempre que o resultado guardado não corresponde aos parâmetros atuais. Por isso o *skeleton* aparece assim que o usuário muda o filtro ou a página, mesmo durante o *debounce* (300 ms).
  * Em caso de erro, mantém a última lista conhecida.
* **`useMovie(id)`** faz o mesmo para um único filme e permite atualizá-lo localmente (`setMovie`) após uma edição, sem nova requisição.
* Resultados de buscas antigas são descartados (flag `cancelled`), evitando que uma resposta lenta sobrescreva uma mais recente.

### Formulário de filme e validação

* **`MovieForm`** é um único formulário usado para **criar** e **editar** filmes; cada tela passa sua variante (`create` ou `edit`) com rótulos e classes CSS próprios.
* **`validateMovie`** (`src/utils/validateMovie.ts`) centraliza as regras: campos obrigatórios, ano entre **1888 e 2100** e nota entre **0 e 10**. Devolve o *payload* já convertido e limpo (números e `trim`) ou um erro amigável, então as duas telas seguem exatamente as mesmas regras.
* **`constants/genres.ts`** é a fonte única dos gêneros. O `value` enviado à API é sem acento (ex.: `Ficcao Cientifica`), como o back-end espera, e o `label` exibido é com acento.

### Catálogo

* Os filtros ficam em um estado único (`FilterState`) que é traduzido para os parâmetros da API em `buildParams`. Mudar qualquer filtro volta para a página 1.
* A busca por texto usa *debounce* para não disparar uma requisição a cada tecla.
* Na Home, o dashboard pede à API apenas os 5 filmes mais recentes (`limit=5`, `sortBy=createdAt`, `order=desc`) e usa `pagination.total` para o total do catálogo, em vez de contar os itens da página.

---

## Estilização e responsividade

* As cores ficam em **variáveis CSS** no `:root` de `src/index.css` (`--color-primary`, `--color-surface`, `--color-border`, `--color-text` etc.). Use-as em vez de valores fixos, para mudar o tema em um só lugar.
* Os *breakpoints* são padronizados em **480px**, **768px** e **1024px**, sempre na sintaxe de intervalo, para não deixar "buracos" entre as faixas:

```css
@media (width <= 1024px) { /* desktop pequeno e abaixo */ }
@media (768px < width <= 1024px) { /* só tablet horizontal */ }
@media (width <= 768px) { /* tablet vertical e abaixo */ }
@media (width <= 480px) { /* celulares */ }
```

* As grades usam `minmax(0, 1fr)` em vez de `1fr` puro. Sem isso, imagens grandes, palavras longas ou campos de formulário alargam a coluna e estouram a largura da tela.
* Em telas sensíveis ao toque, botões e itens clicáveis têm altura mínima confortável; em telas pequenas, os campos de formulário usam fonte de 16px para o iOS não aplicar zoom automático ao focar.

---

## Decisões de projeto

* **Estado de autenticação em Context, não em `localStorage` espalhado.** Antes, vários componentes liam o token diretamente, o que dificultava mudar a forma de guardar a sessão e exigia hacks para atualizar o Header após login e logout. Hoje há um único ponto de leitura (`session.ts`) e uma única fonte de verdade (`AuthContext`).
* **Interceptor para o 401, em vez de tratar em cada tela.** Uma sessão expirada pode acontecer em qualquer requisição; tratar na camada de HTTP evita repetir a lógica e deixa as páginas só com a parte visual.
* **Hooks de dados com *loading* derivado.** Evita atualizar estado de forma síncrona dentro de `useEffect` (algo que as regras do React Hooks desencorajam) e garante que o *skeleton* apareça no momento certo.
* **Validação e gêneros centralizados.** Antes, as regras e a lista de gêneros estavam duplicadas entre as telas de criar e editar, e as duas podiam divergir.
* **Formulário compartilhado (`MovieForm`).** Criar e editar têm os mesmos campos; manter dois formulários significava corrigir cada bug duas vezes.
* **CSS puro com variáveis.** O projeto não precisa de um *framework* de estilos; variáveis e componentes com CSS próprio mantêm o código simples e sem dependências extras.
* **Mensagens de erro amigáveis em modais.** O usuário vê o que aconteceu e o que fazer (por exemplo, "verifique se o back-end está rodando"), em vez de uma tela em branco ou um erro técnico.

---

## Limitações conhecidas e melhorias futuras

* O token JWT fica no `localStorage`, que é simples, mas exposto a ataques XSS. Uma melhoria seria usar cookies `httpOnly` emitidos pelo back-end.
* Não há *refresh token*: quando o token expira, o usuário precisa fazer login novamente.
* O projeto ainda não tem testes automatizados; uma boa próxima etapa é cobrir `validateMovie`, `getFriendlyApiError` e o fluxo de sessão com Vitest.
* Os links do rodapé (Sobre Nós, Termos, Privacidade, Ajuda e Contato) levam todos para a página de créditos, pois ainda não existem páginas separadas para cada um.
* O catálogo poderia usar uma biblioteca de cache de requisições (como TanStack Query) para evitar refazer buscas já feitas.