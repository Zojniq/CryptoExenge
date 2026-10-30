USE vector_exchange;

CREATE TABLE branches (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(150) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE cryptos (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    code    VARCHAR(10) NOT NULL,
    network VARCHAR(30) NOT NULL,
    UNIQUE(code, network)
) ENGINE=InnoDB;

CREATE TABLE time_slots (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    UNIQUE(start_time, end_time),
    CHECK(end_time > start_time)
) ENGINE=InnoDB;

CREATE TABLE orders (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    public_code      VARCHAR(8) NOT NULL UNIQUE,
    branch_id        INT NOT NULL,
    crypto_id        INT NOT NULL,
    slot_id          INT NOT NULL,
    visit_date       DATE NOT NULL,
    fiat_amount      DECIMAL(14,2) NOT NULL,
    fiat_currency    ENUM('UAH', 'USD', 'EUR') NOT NULL,
    rate             DECIMAL(14,6) NOT NULL,
    crypto_amount    DECIMAL(18,6) NOT NULL,
    status           ENUM('pending', 'confirmed', 'completed', 'cancelled')
                     NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (fiat_amount > 0),
    CHECK (rate > 0),

    CONSTRAINT fk_orders_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
    CONSTRAINT fk_orders_crypto FOREIGN KEY (crypto_id) REFERENCES cryptos(id),
    CONSTRAINT fk_orders_slot   FOREIGN KEY (slot_id)   REFERENCES time_slots(id),

    INDEX idx_orders_branch_date (branch_id, visit_date)

) ENGINE=InnoDB;


-- Початкові дані
INSERT INTO branches (slug, name) VALUES
  ('kyiv-zoloti-vorota', 'Київ, м. Золоті Ворота 2'),
  ('kyiv-maidan',        'Київ, м. Майдан Незалежності 1'),
  ('kyiv-golosievo',     'Київ, вул. Голосіївський проспект 17А');

INSERT INTO cryptos (code, network) VALUES
  ('USDT', 'TRON · TRC-20'),
  ('USDC', 'Polygon');

INSERT INTO time_slots (start_time, end_time) VALUES
  ('10:00','11:00'), ('12:00','13:00'), ('14:00','15:00'), ('16:00','17:00');
