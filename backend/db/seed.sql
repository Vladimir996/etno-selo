-- Početni podaci — ogledaju trenutni sadržaj sa sajta (src/data/*.ts) i dummy
-- zauzetost (src/data/availability.ts), da bi ponašanje ostalo isto posle
-- prebacivanja frontenda na backend.

INSERT INTO cabins (slug, name, short_description, description, capacity, bedrooms, size_m2, price_from_eur) VALUES
('brvnara-bor', 'Brvnara "Bor"',
 'Prostrana brvnara sa pogledom na borovu šumu, idealna za porodice.',
 'Brvnara "Bor" je naša najprostranija A-frame kućica, smeštena na ivici borove šume. Enterijer kombinuje grubo obrađeno drvo sa mekim tekstilom u toplim tonovima, a velika staklena fasada uvodi prirodnu svetlost i pogled na okolne krošnje u svaki kutak dnevnog boravka.',
 4, 2, 42, 65.00),
('brvnara-javor', 'Brvnara "Javor"',
 'Romantična brvnara za dvoje, okružena zelenilom i tišinom.',
 'Brvnara "Javor" je zamišljena za parove koji traže mir – manja, intimna A-frame kućica sa udobnim ležajem na sprat, malom trpezarijom i pogledom koji se pruža pravo na livadu. Jutra ovde počinju mirisom kafe i cvrkutom ptica.',
 2, 1, 28, 50.00),
('brvnara-smreka', 'Brvnara "Smreka"',
 'Moderna A-frame kućica sa panoramskim staklenim krovom.',
 'Brvnara "Smreka" spaja tradicionalni oblik brvnare sa savremenim detaljima – panoramski stakleni zabat pruža pogled na zvezdano nebo direktno iz kreveta. Zimi, okružena snegom, postaje omiljeno mesto naših gostiju za bekstvo od gradske vreve.',
 3, 1, 32, 55.00),
('brvnara-jela', 'Brvnara "Jela"',
 'Kompaktna i udobna brvnara, savršena za kratak odmor.',
 'Brvnara "Jela" je naša najkompaktnija A-frame kućica, ali ne i najskromnija po udobnosti. Sa pažljivo biranim detaljima od domaćeg drveta i tekstila, ova brvnara je idealan izbor za goste koji dolaze na kraći odmor i žele jednostavnost bez kompromisa.',
 2, 1, 24, 45.00);

INSERT INTO cabin_images (cabin_id, url, alt, category, sort_order) VALUES
((SELECT id FROM cabins WHERE slug = 'brvnara-bor'), '/images/cabins/exterior-1.jpg', 'Brvnara "Bor" u borovoj šumi', 'eksterijer', 0),
((SELECT id FROM cabins WHERE slug = 'brvnara-bor'), '/images/cabins/interior-1.jpg', 'Udobna spavaća soba sa pogledom na šumu', 'enterijer', 1),
((SELECT id FROM cabins WHERE slug = 'brvnara-bor'), '/images/cabins/interior-3.jpg', 'Spavaća soba u brvnari', 'enterijer', 2),

((SELECT id FROM cabins WHERE slug = 'brvnara-javor'), '/images/cabins/exterior-2.jpg', 'Brvnara "Javor" okružena zelenilom', 'eksterijer', 0),
((SELECT id FROM cabins WHERE slug = 'brvnara-javor'), '/images/cabins/interior-2.jpg', 'Enterijer brvnare sa drvenim detaljima', 'enterijer', 1),
((SELECT id FROM cabins WHERE slug = 'brvnara-javor'), '/images/cabins/landscape-1.jpg', 'Drvena kuća u planini', 'priroda', 2),

((SELECT id FROM cabins WHERE slug = 'brvnara-smreka'), '/images/cabins/exterior-3.jpg', 'Brvnara "Smreka", moderna A-frame kućica', 'eksterijer', 0),
((SELECT id FROM cabins WHERE slug = 'brvnara-smreka'), '/images/cabins/interior-1.jpg', 'Udobna spavaća soba sa pogledom na šumu', 'enterijer', 1),
((SELECT id FROM cabins WHERE slug = 'brvnara-smreka'), '/images/cabins/winter-1.jpg', 'Brvnara pod snegom okružena borovima', 'priroda', 2),

((SELECT id FROM cabins WHERE slug = 'brvnara-jela'), '/images/cabins/exterior-4.jpg', 'Brvnara "Jela" u šumi', 'eksterijer', 0),
((SELECT id FROM cabins WHERE slug = 'brvnara-jela'), '/images/cabins/interior-3.jpg', 'Spavaća soba u brvnari', 'enterijer', 1),
((SELECT id FROM cabins WHERE slug = 'brvnara-jela'), '/images/cabins/landscape-2.jpg', 'Kuća okružena drvećem i planinama', 'priroda', 2);

INSERT INTO amenities (name) VALUES
('Kamin na drva'), ('Peć na drva'), ('Terasa'), ('Terasa sa ležaljkama'),
('Kupatilo sa tuš kabinom'), ('Kuhinja'), ('Mini kuhinja'), ('Panoramski krov'),
('Besplatan Wi-Fi'), ('Parking');

INSERT INTO cabin_amenities (cabin_id, amenity_id)
SELECT c.id, a.id FROM cabins c JOIN amenities a ON (
  (c.slug = 'brvnara-bor' AND a.name IN ('Kamin na drva', 'Terasa sa ležaljkama', 'Kupatilo sa tuš kabinom', 'Kuhinja', 'Besplatan Wi-Fi', 'Parking')) OR
  (c.slug = 'brvnara-javor' AND a.name IN ('Kamin na drva', 'Terasa', 'Kupatilo sa tuš kabinom', 'Mini kuhinja', 'Besplatan Wi-Fi', 'Parking')) OR
  (c.slug = 'brvnara-smreka' AND a.name IN ('Kamin na drva', 'Panoramski krov', 'Terasa', 'Kupatilo sa tuš kabinom', 'Besplatan Wi-Fi', 'Parking')) OR
  (c.slug = 'brvnara-jela' AND a.name IN ('Peć na drva', 'Terasa', 'Kupatilo sa tuš kabinom', 'Besplatan Wi-Fi', 'Parking'))
);

-- Demo blokirani termini (isto što je do sada bio dummyAvailability na frontendu)
INSERT INTO unavailable_periods (cabin_id, start_date, end_date, reason) VALUES
((SELECT id FROM cabins WHERE slug = 'brvnara-bor'), '2026-09-04', '2026-09-08', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-bor'), '2026-09-19', '2026-09-21', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-bor'), '2026-10-09', '2026-10-14', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-bor'), '2026-11-20', '2026-11-25', 'Demo rezervacija'),

((SELECT id FROM cabins WHERE slug = 'brvnara-javor'), '2026-08-30', '2026-09-01', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-javor'), '2026-09-12', '2026-09-16', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-javor'), '2026-10-01', '2026-10-05', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-javor'), '2026-12-24', '2026-12-28', 'Demo rezervacija'),

((SELECT id FROM cabins WHERE slug = 'brvnara-smreka'), '2026-09-10', '2026-09-13', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-smreka'), '2026-10-20', '2026-10-27', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-smreka'), '2026-11-05', '2026-11-08', 'Demo rezervacija'),

((SELECT id FROM cabins WHERE slug = 'brvnara-jela'), '2026-08-30', '2026-09-02', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-jela'), '2026-09-25', '2026-09-29', 'Demo rezervacija'),
((SELECT id FROM cabins WHERE slug = 'brvnara-jela'), '2026-11-01', '2026-11-04', 'Demo rezervacija');
