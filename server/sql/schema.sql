CREATE DATABASE IF NOT EXISTS game_diary;
USE game_diary;

-- Таблица игр
CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  platform VARCHAR(100),
  developer VARCHAR(255),
  release_year INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица записей дневника
CREATE TABLE IF NOT EXISTS game_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT,
  date DATE NOT NULL,
  time_spent INT NOT NULL COMMENT 'Время в минутах',
  rating INT CHECK (rating >= 1 AND rating <= 10),
  review TEXT,
  status ENUM('planned', 'playing', 'completed', 'dropped') DEFAULT 'planned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Индексы для оптимизации
CREATE INDEX idx_game_entries_game_id ON game_entries(game_id);
CREATE INDEX idx_game_entries_date ON game_entries(date);