# Etno selo Raonica

Next.js (App Router, TypeScript, Tailwind CSS v4) prezentacioni sajt za etno selo — smeštaj u A-frame brvnarama, galerija i upit za rezervaciju.

## Pokretanje

```bash
npm install
npm run dev
```

Sajt je dostupan na [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # produkcioni build
npm run start   # pokretanje produkcionog builda
npm run lint    # ESLint
```

## Struktura sadržaja

- `src/data/cabins.ts` — podaci o brvnarama (naziv, opis, kapacitet, cena, sadržaj, slike). Ovde menjate/dodajete smeštajne jedinice.
- `src/data/gallery.ts` — slike i kategorije za stranicu Galerija.
- `src/app/[locale]/` — dvojezične javne stranice: Početna (`/`), Smeštaj (`/smestaj`, `/smestaj/[slug]`), Galerija (`/galerija`), O nama (`/o-nama`), Kontakt (`/kontakt`), Rezervacija (`/rezervacija`). `src/app/admin/` je odvojen, nelokalizovan deo (pogledaj sekciju "Dvojezičan sajt" ispod).
- `src/components/` — deljene komponente (Navbar, Footer, kartice, forma za rezervaciju, galerija sa lightbox-om).
- `public/images/cabins/` — slike brvnara/prirode.

## Slike

Slike u `public/images/cabins/` su **privremene, besplatne stock fotografije sa Pexels-a** (A-frame brvnare, enterijeri, priroda) — koriste se kao placeholder dok ne dodate prave fotografije vašeg imanja. Pexels licenca dozvoljava besplatnu komercijalnu upotrebu bez obavezne atribucije. Kad budete imali sopstvene fotografije, samo zamenite fajlove istih naziva u `public/images/cabins/` (ili izmenite putanje u `src/data/cabins.ts` i `src/data/gallery.ts`).

## Rezervacija i kalendar dostupnosti — trenutno stanje

Sajt je povezan sa pravim backend-om (`../backend/`, Node.js/Express + MySQL, sibling folder ovog projekta). Za rad ceo sistema potrebno je pokrenuti **sva tri dela**:

1. MySQL (npr. preko WAMP-a).
2. Backend: `cd ../backend && npm run dev` (sluša na `http://localhost:4000`, prva puta pokreni i `npm run db:migrate` — vidi `../backend/README.md`).
3. Frontend (ovaj projekat): `npm run dev` (na `http://localhost:3000`).

Frontend nikad direktno ne zove backend iz browsera — ide kroz **Next.js API rute kao proxy** (server-to-server poziv, bez CORS-a, backend URL ostaje samo na serveru):
- `src/app/api/cabins/[slug]/availability/route.ts` → prosleđuje ka `GET {API_URL}/cabins/:slug/availability`
- `src/app/api/rezervacija/route.ts` → prosleđuje ka `POST {API_URL}/bookings`

`API_URL` je definisan u `.env.local` (podrazumevano `http://localhost:4000/api`).

**Kalendar dostupnosti** (`src/components/AvailabilityCalendar.tsx`) — gost bira brvnaru pa u kalendaru vidi koji su datumi slobodni/zauzeti i bira period (koristi se i na stranici pojedinačne brvnare i u formi za rezervaciju). Zauzetost se sada učitava asinhrono sa backend-a preko `fetchCabinAvailability()` u `src/lib/availability.ts` (koje čiste, sinhrone helper funkcije za rad sa datumima ostaju iste kao i pre).

Slanje forme i dalje šalje **upit** (ne trenutnu potvrdu) — backend upiše rezervaciju sa statusom `na_cekanju` i odbije je (`409`) ako se preklapa sa postojećim terminom.

### Sledeći koraci (postepeno, po dogovoru)

1. ~~Node.js backend + MySQL baza sa endpointima za brvnare, dostupnost i rezervacije~~ — gotovo.
2. ~~Admin prijava i pregled/upravljanje rezervacijama~~ — gotovo. `/admin/login` + `/admin` (zaštićeno JWT-om, httpOnly kolačić); admin može da menja status upita (potvrdi/odbij/otkaži/vrati na čekanje). Nalog se kreira preko `backend`-a: `npm run db:create-admin -- <korisnicko_ime> <lozinka>` (pogledaj `../backend/README.md`).
3. Opciono: email/SMS notifikacije gostu i vlasniku pri kreiranju upita ili promeni statusa, plaćanje (Stripe i sl.).
4. Opciono: prebacivanje sadržaja brvnara/galerije (`src/data/cabins.ts`, `src/data/gallery.ts`) da se učitava sa backend-a umesto iz statičkih fajlova — šema i seed za to već postoje (`cabins`, `cabin_images`, `amenities` tabele), samo nije još povezano na frontend.

## Dvojezičan sajt (crnogorski / engleski)

Sajt koristi [`next-intl`](https://next-intl.dev) za dvojezičan prikaz — crnogorski (`me`, podrazumevani, bez prefiksa u URL-u — npr. `/smestaj`) i engleski (`en`, sa prefiksom — npr. `/en/smestaj`). Prekidač jezika (ME/EN) je u gornjem desnom uglu navigacije, na desktopu i mobilnom meniju.

- `messages/me.json`, `messages/en.json` — svi tekstovi sajta (navigacija, dugmad, forme, kalendar...), grupisani po stranici/sekciji. Ovde se dodaje/menja tekst.
- `src/i18n/routing.ts` — lista jezika i podešavanje prefiksa; `src/i18n/navigation.ts` — lokalizovani `Link`/`useRouter`/`usePathname` (koristi se svuda umesto `next/link`/`next/navigation` u javnom delu sajta).
- `src/data/cabins.ts` i `src/data/gallery.ts` — nazivi/opisi/sadržaj brvnara i opisi slika su dvojezični direktno u podacima (`{ me: "...", en: "..." }`), ne u `messages/*.json`, jer su to podaci a ne tekst interfejsa. Funkcije `localizeCabin()` / `localizeGalleryImage()` ih pretvaraju u tekst za trenutni jezik.
- `src/lib/i18n-format.ts` — gramatički ispravna množina (gost/gosta/gostiju, noćenje/noćenja, guest/guests, night/nights) u oba jezika.
- **Admin panel (`/admin`) namerno nije preveden** — ostaje na crnogorskom, jer je to interni alat za vlasnika, ne javna stranica.

Kad dodaješ novu brvnaru ili menjaš tekst, imaj na umu da se sve mora uneti na oba jezika (ili će se za `en` prikazati crnogorski tekst kao fallback ako polje ostane prazno u `en.json`).

## Napomena o placeholder podacima

Adresa, telefon, email i cene u `src/data/cabins.ts`, `Footer.tsx` i `/kontakt` su placeholder vrednosti — zamenite ih stvarnim podacima pre objavljivanja sajta.
