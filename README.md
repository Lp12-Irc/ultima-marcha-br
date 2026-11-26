# Última Marcha BR — Portal Web

Portal de consulta do jogo **Última Marcha BR** no Roblox (`Place ID: 106981767858651`), feito em HTML, CSS e JavaScript puro para hospedagem estática via GitHub Pages.

- **Site no ar:** https://lp12-irc.github.io/ultima-marcha-br/
- **Jogo no Roblox:** https://www.roblox.com/games/106981767858651/ltima-Marcha-BR
- **Discord oficial:** https://discord.gg/zy2exUyTEX

## Estrutura

- `index.html` — casca principal e navegação SPA por hash (`#/carros`, `#/tuning`, etc.)
- `css/style.css` — layout escuro automotivo sem dependências externas
- `js/data.js` — catálogo de carros, peças de preparação, locais do mapa, notas de update e códigos
- `js/app.js` — roteador, cálculo de performance da bancada de tuning e leitura de estatísticas
- `js/stats.json` — snapshot atualizado automaticamente com jogadores online, visitas, favoritos e membros do Discord
- `.github/workflows/sync-stats.yml` — GitHub Action que consulta as APIs oficiais do Roblox e Discord a cada 30 min

## Como atualizar dados do jogo

Edite apenas `js/data.js`:
- `CARROS`: ficha de cada veículo (potência, torque, peso, tração, preço rodando e valor no ferro-velho)
- `PECAS`: multiplicadores de motor, indução, câmbio, pneus, suspensão e alívio de peso
- `CODIGOS`: adicione objetos `{ codigo, recompensa, ativo, expira }` quando saírem códigos novos
- `NOTICIAS` e `MAPA_LOCAIS`: histórico de patches e pontos de interesse

## Integração futura com o Roblox Studio (`HttpService`)

Para alimentar o quadro de tempos (`#/ranking`) direto dos servidores do jogo quando o Beta abrir:
1. Crie um endpoint leve (Cloudflare Worker ou Supabase) recebendo `POST` autenticado por header secreto do servidor Roblox (`HttpService:PostAsync`).
2. Salve os melhores tempos de 402m / volta por `UserId`.
3. Aponte `pageRanking` em `js/app.js` para ler o JSON público desse endpoint e mude `RANKING_DEMO = false` em `js/data.js`.
