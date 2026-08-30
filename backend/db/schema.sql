-- Etno selo Raonica — šema baze
-- Pokreće se preko backend/db/migrate.js (ili ručno u MySQL klijentu).

CREATE DATABASE IF NOT EXISTS etno_selo_raonica
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE etno_selo_raonica;

-- Brvnare (smeštajne jedinice)
CREATE TABLE IF NOT EXISTS cabins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  short_description VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  bedrooms SMALLINT UNSIGNED NOT NULL,
  size_m2 SMALLINT UNSIGNED NOT NULL,
  price_from_eur DECIMAL(8,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Fotografije — vezane za brvnaru (cabin_id) ili opšte fotografije sela (cabin_id NULL)
CREATE TABLE IF NOT EXISTS cabin_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cabin_id INT UNSIGNED NULL,
  url VARCHAR(255) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  category ENUM('eksterijer', 'enterijer', 'priroda') NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cabin_images_cabin
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sadržaj/pogodnosti (Wi-Fi, kamin, parking...) — normalizovano da se ne ponavlja tekst
CREATE TABLE IF NOT EXISTS amenities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cabin_amenities (
  cabin_id INT UNSIGNED NOT NULL,
  amenity_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (cabin_id, amenity_id),
  CONSTRAINT fk_cabin_amenities_cabin
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE,
  CONSTRAINT fk_cabin_amenities_amenity
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Upiti za rezervaciju poslati sa sajta
CREATE TABLE IF NOT EXISTS bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cabin_id INT UNSIGNED NOT NULL,
  guest_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count SMALLINT UNSIGNED NOT NULL,
  note TEXT NULL,
  status ENUM('na_cekanju', 'potvrdjena', 'odbijena', 'otkazana') NOT NULL DEFAULT 'na_cekanju',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_cabin
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE,
  CONSTRAINT chk_bookings_dates CHECK (check_out > check_in),
  INDEX idx_bookings_cabin_dates (cabin_id, check_in, check_out)
) ENGINE=InnoDB;

-- Periodi koje vlasnik ručno blokira (održavanje, lična upotreba...), van gostinjskih rezervacija
CREATE TABLE IF NOT EXISTS unavailable_periods (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cabin_id INT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(200) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_unavailable_periods_cabin
    FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE CASCADE,
  CONSTRAINT chk_unavailable_periods_dates CHECK (end_date > start_date),
  INDEX idx_unavailable_periods_cabin_dates (cabin_id, start_date, end_date)
) ENGINE=InnoDB;

-- Administratorski nalozi (za pregled i upravljanje rezervacijama)
CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Log svake značajnije akcije nad API-jem (audit trag)
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(60) NOT NULL,
  entity_type VARCHAR(40) NULL,
  entity_id INT UNSIGNED NULL,
  payload JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_logs_action (action),
  INDEX idx_activity_logs_entity (entity_type, entity_id)
) ENGINE=InnoDB;
