# 🏁 Última Marcha BR — Site Oficial

Site do jogo **Última Marcha BR** (Roblox). É um site estático: só HTML, CSS e JavaScript, sem servidor. Dá pra hospedar de graça no **GitHub Pages**.

## ✨ Funções

| Página | O que faz |
|---|---|
| **Início** | Destaques, jogadores online, último patch e código da vez |
| **Carros** | Enciclopédia com busca, filtro por categoria e ordenação |
| **Tuning** | Simulador de builds (potência, 0-100, arrancada, custo), com salvar e compartilhar link |
| **Comparar** | Dois carros lado a lado com placar |
| **Mapa** | Mapa interativo com filtros (oficinas, ferro-velhos, postos...) |
| **Ranking** | Arrancada, Circuito da Serra, mais rico e mais entregas |
| **Notícias** | Patch notes e eventos |
| **Códigos** | Códigos promocionais com botão de copiar |

## ✏️ Como editar o conteúdo

**Tudo** fica em [`js/data.js`](js/data.js):

- `GAME`: link do jogo no Roblox e do Discord (**troque primeiro!**)
- `CARROS`: carros (nome, cv, peso, preço, cor...)
- `PECAS`: peças do simulador de tuning
- `NOTICIAS`, `CODIGOS`, `MAPA_LOCAIS`, `RANKING`

Pra adicionar um carro, copie uma linha de `CARROS`, troque o `id` (que precisa ser único) e os valores.

## 🚀 Publicar no GitHub Pages (sem instalar nada)

1. Crie uma conta em https://github.com e clique em **New repository**
2. Nome: `ultima-marcha-br` → **Public** → **Create repository**
3. Clique em **uploading an existing file** e arraste **todo o conteúdo desta pasta** (`index.html`, `css/`, `js/`, `README.md`, `.nojekyll`)
4. Clique em **Commit changes**
5. Vá em **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `(root)` → **Save**
6. Em 1-2 minutos o site fica no ar em: `https://SEU-USUARIO.github.io/ultima-marcha-br/`

## 💻 Testar no computador

Basta abrir o `index.html` no navegador (dois cliques).

## 🔌 Próximos passos (integração com o jogo)

- **Jogadores online reais**: hoje o contador é simulado (`iniciarOnline()` em `app.js`). Dá pra usar um backend pequeno (ex.: Cloudflare Workers) que consulta a API do Roblox.
- **Ranking real**: o servidor do jogo envia os dados via `HttpService` para uma API, e o site lê de lá.
- **Login com Roblox / garagem do jogador**: usar o OAuth 2.0 oficial do Roblox (precisa de backend).

> Os valores de desempenho do simulador são aproximações para fins de jogo.
