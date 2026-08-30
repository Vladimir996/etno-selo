# Backend — Etno selo Raonica

Node.js/Express API sa MySQL bazom (testirano preko WAMP-a) za brvnare, dostupnost termina i upite za rezervaciju.

## Podešavanje

1. Pokreni MySQL (npr. preko WAMP-a — podrazumevano `127.0.0.1:3306`, korisnik `root`, bez lozinke).
2. `cp .env.example .env` i po potrebi izmeni pristupne podatke za bazu.
3. `npm install`
4. `npm run db:migrate` — kreira sve tabele (`db/schema.sql`) u bazi iz `DB_NAME` i ubacuje početne podatke (`db/seed.sql`). Baza mora već postojati (skripta je ne pravi — hostovani provajderi obično ne daju `CREATE DATABASE` privilegiju). Sigurno je pokrenuti više puta — ako `cabins` već ima podatke, seed se preskače.
5. `npm run db:create-admin -- <korisnicko_ime> <lozinka>` — kreira admin nalog za prijavu na `/admin` (lozinka min. 8 karaktera). Pokreni ponovo sa istim korisničkim imenom da promeniš lozinku.
6. `npm run dev` (nodemon, automatski restart) ili `npm start`.

Server podrazumevano sluša na `http://localhost:4000`.

## Šema baze

- **cabins** — brvnare (naziv, opis, kapacitet, cena...)
- **cabin_images** — fotografije po brvnari (kategorija: eksterijer/enterijer/priroda)
- **amenities** / **cabin_amenities** — sadržaj/pogodnosti, normalizovano (many-to-many)
- **bookings** — upiti za rezervaciju gostiju (status: `na_cekanju` / `potvrdjena` / `odbijena` / `otkazana`)
- **unavailable_periods** — termini koje vlasnik ručno blokira (van gostinjskih rezervacija)
- **admins** — administratorski nalozi (username + bcrypt hash lozinke), za prijavu na `/admin`
- **activity_logs** — log svakog API poziva i svake značajnije akcije (kreirana rezervacija, odbijeno preklapanje termina, prijava/neuspela prijava, promena statusa rezervacije...)

## Endpointi

| Metoda | Putanja | Auth | Opis |
|---|---|---|---|
| GET | `/api/cabins` | — | Lista svih brvnara |
| GET | `/api/cabins/:slug` | — | Detalji brvnare (sa slikama i sadržajem) |
| GET | `/api/cabins/:slug/availability` | — | Zauzeti periodi (`[{start, end}]`) — kombinacija rezervacija i ručnih blokada |
| POST | `/api/bookings` | — | Kreira upit za rezervaciju. Telo: `{ ime, email, telefon, brvnara, datumDolaska, datumOdlaska, brojGostiju, napomena? }`. Vraća `409` ako se termin preklapa sa postojećom rezervacijom/blokadom. |
| POST | `/api/auth/login` | — | Telo: `{ username, password }`. Vraća `{ token, username }` (JWT, važi 12h) ili `401`. |
| GET | `/api/bookings` | ✅ admin | Lista svih upita |
| PATCH | `/api/bookings/:id` | ✅ admin | Menja status. Telo: `{ status }`, jedno od: `na_cekanju`, `potvrdjena`, `odbijena`, `otkazana`. |

Rute označene sa ✅ admin zahtevaju `Authorization: Bearer <token>` header (token iz `/api/auth/login`) — proverava ga `src/middleware/requireAdmin.js`.

## Admin panel (frontend)

Frontend (`/admin`) se prijavljuje preko backend-a i pamti sesiju u httpOnly kolačiću (postavlja ga Next.js API ruta `src/app/api/admin/login/route.ts`, backend nikad ne vidi taj kolačić direktno — samo izdaje JWT). Kredencijale kreiraš/menjaš komandom iz koraka 5 gore (`npm run db:create-admin`).
