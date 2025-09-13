DROP DATABASE IF EXISTS closetmate;
CREATE DATABASE IF NOT EXISTS closetmate;
USE closetmate;
 
CREATE TABLE IF NOT EXISTS user_info(
    user_id INTEGER AUTO_INCREMENT NOT NULL,
    user_username VARCHAR(50) NOT NULL UNIQUE, -- naglagay lang ako unique
    user_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS clothing_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    type VARCHAR(50),
    color VARCHAR(50),
    material VARCHAR(50),
    image_url VARCHAR(255),
    season VARCHAR(20),
    occasion VARCHAR(50), -- ginawa ko na lang 50 lahat HAHAHAHHAHAHA
    last_worn_date DATE,
    wear_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_info(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS outfits (
    outfit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_info(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS outfit_items (
    outfit_id INT NOT NULL,
    item_id INT NOT NULL,
    PRIMARY KEY (outfit_id, item_id),
    FOREIGN KEY (outfit_id) REFERENCES outfits(outfit_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES clothing_items(item_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_preferences ( --idk if need pero naglagay nadin ako neto para magstore preferences
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_info(user_id) ON DELETE CASCADE
);

INSERT INTO user_info(user_username, user_password)
VALUES 
('poopoo', 'peepee'),
('pou', 'pai');
