# Vila Oculta — Sorteio das Nações

Site de fã em que o visitante não escolhe a vila: gira o destino, cai numa das seis nações e o voto entra no placar.

Vilas: Konohagakure, Sunagakure, Kirigakure, Kumogakure, Iwagakure e Amegakure.

## Rotas

- `/` — sorteio
- `/resultados` — placar com ranking, barras e porcentagem

## Como rodar

```bash
npm install
npm run dev
```

Os votos ficam numa tabela `village_votes` (Postgres). Sem `DATABASE_URL`, o preview usa o banco local embutido. Um navegador conta um voto só, guardado no `localStorage`.

Projeto de fã, sem fins comerciais — Naruto © Masashi Kishimoto.
