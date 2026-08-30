# Etno selo Raonica

Prezentacioni i booking sajt za etno selo — brvnare, galerija, dvojezičan sadržaj (crnogorski/engleski) i sopstveni sistem za rezervacije sa admin panelom.

Projekat je podeljen u dva odvojena dela:

- **[`frontend/`](frontend/)** — Next.js (App Router, TypeScript, Tailwind CSS v4, next-intl) sajt: javne stranice, booking wizard, admin panel.
- **[`backend/`](backend/)** — Node.js/Express API + MySQL baza: brvnare, dostupnost, rezervacije, admin autentifikacija.

Detaljna uputstva (podešavanje, komande, struktura) su u README fajlu svakog dela.

## Brzo pokretanje (sva tri dela)

```bash
# 1. MySQL (npr. preko WAMP-a) mora biti pokrenut

# 2. Backend — API na http://localhost:4000
cd backend
npm install
npm run db:migrate          # prvi put: kreira bazu i tabele
npm run db:create-admin -- <korisnicko_ime> <lozinka>   # prvi put: admin nalog
npm run dev

# 3. Frontend — sajt na http://localhost:3000 (u novom terminalu)
cd frontend
npm install
npm run dev
```

Frontend se povezuje sa backend-om preko `frontend/.env.local` (`API_URL`), a nikad direktno iz browsera — sve ide kroz Next.js API rute kao proxy. Detalji u [`frontend/README.md`](frontend/README.md) i [`backend/README.md`](backend/README.md).
