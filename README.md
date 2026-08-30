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

## Produkcija (deploy na 3 platforme)

Sajt je podeljen na tri nezavisna servisa koji se hostuju odvojeno i pričaju preko interneta (ne moraju biti kod istog provajdera):

| Deo | Platforma | Šta hostuje |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Next.js app |
| Backend | [Render](https://render.com) — Web Service (free) | Node.js/Express API |
| Baza | [Clever Cloud](https://www.clever-cloud.com) — MySQL add-on (DEV plan, free, 10MB) | MySQL |

Redosled podešavanja je bitan — baza prva, pa backend, pa na kraju frontend (jer frontendu treba gotov backend URL).

### 1. Baza — Clever Cloud MySQL

1. Registruj se na [clever-cloud.com](https://www.clever-cloud.com) → **Create** → **an add-on** → **MySQL** → plan **DEV** (besplatan, 10MB) → izaberi region → kreiraj.
2. Kad servis postane aktivan, otvori ga → tab **Information**/**Environment variables**. Tu su konekcioni podaci: `MYSQL_ADDON_HOST`, `MYSQL_ADDON_PORT`, `MYSQL_ADDON_USER`, `MYSQL_ADDON_PASSWORD`, `MYSQL_ADDON_DB`.
3. Nalog na Clever Cloud-u **nema `CREATE DATABASE` privilegiju** — baza koju ti dodele (`MYSQL_ADDON_DB`) se koristi direktno, ne pravi se nova (zato `db/schema.sql`/`db/seed.sql` ne sadrže `CREATE DATABASE`/`USE`).
4. Lokalno u `backend/.env` upiši te podatke kao `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, pa pokreni **sa svog računara** (pre nego što bilo šta deployuješ):
   ```bash
   cd backend
   npm run db:migrate
   npm run db:create-admin -- <korisnicko_ime> <lozinka>
   ```
   Ovo kreira šemu, seed podatke i admin nalog direktno na produkcionoj bazi.
5. (Opciono) Ako umesto Clever Cloud-a koristiš provajdera koji zahteva SSL konekciju (npr. Aiven), postavi `DB_CA_CERT` u `.env` na sadržaj CA sertifikata — kod ga automatski koristi ako je postavljen (`src/db.js`, `db/migrate.js`, `db/create-admin.js`).

### 2. Backend — Render Web Service

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service** → poveži GitHub repo ovog projekta.
2. Podešavanja: **Root Directory** `backend`, **Runtime** Node, **Build Command** `npm install`, **Start Command** `npm start`, **Instance Type** Free.
3. U **Environment Variables** dodaj (vrednosti sa Clever Cloud-a iz koraka 1 + svoje):
   ```
   DB_HOST=...
   DB_PORT=3306
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   JWT_SECRET=...          (nasumičan string — npr. node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   CORS_ORIGIN=https://<tvoj-vercel-domen>.vercel.app
   ```
   `PORT` ne treba dodavati — Render ga sam postavlja, kod ga čita preko `process.env.PORT`.
4. **Create Web Service** i sačekaj da build/deploy prođe. Render dodeljuje URL tipa `https://<ime>.onrender.com` — proveri da `https://<ime>.onrender.com/api` vraća `{"ok":true,...}`.
5. Free plan "spava" posle ~15 min neaktivnosti — prvi sledeći zahtev ima cold start od 30-50s.

### 3. Frontend — Vercel

1. Poveži repo na Vercel (Root Directory `frontend` ako je monorepo podešen tako).
2. Project → **Settings** → **Environment Variables** → dodaj varijablu:
   - Tip **Config** (ne Secret — `API_URL` nije tajna vrednost, samo URL servisa)
   - **Key**: `API_URL`
   - **Value**: `https://<ime>.onrender.com/api` (URL backend-a sa Render-a, korak 2.4)
   - Environment: Production (i Preview po želji)
3. Sačuvaj, pa uradi **Redeploy** na poslednjem deployu (Vercel ne pokupi nove env varijable dok se deploy ne ponovi).
4. Na Render-u (korak 2.3) proveri da `CORS_ORIGIN` odgovara tačnom Vercel domenu (bez putanje, samo origin, npr. `https://etno-selo-test.vercel.app`).

### Provera da sve radi (posle sva tri koraka)

```bash
curl https://<ime>.onrender.com/api
# → {"ok":true,"service":"etno-selo-raonica-backend"}

curl https://<tvoj-vercel-domen>.vercel.app/api/cabins/<neki-slug>/availability
# → [{"start":"...","end":"..."}, ...] (podaci sa MySQL baze, kroz backend, kroz frontend proxy)
```

Ako oba vrate očekivan JSON, sva tri sistema (Next.js → Node.js → MySQL) su ispravno povezana.
