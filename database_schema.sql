-- Database schema for Dashboard Penjadwalan
-- Make sure to select your database first: USE your_database_name;

-- Tabel chat_messages untuk sistem chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sender (sender_id),
  INDEX idx_receiver (receiver_id),
  INDEX idx_created (created_at)
);

-- Tabel user_learning_history untuk riwayat belajar user
CREATE TABLE IF NOT EXISTS user_learning_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  jadwal_sesi_id INT NOT NULL,
  kelas_id INT NOT NULL,
  mentor_id INT NOT NULL,
  mata_pelajaran_id INT,
  tanggal DATE NOT NULL,
  materi_diajarkan TEXT NOT NULL,
  hasil_belajar TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_jadwal (jadwal_sesi_id),
  INDEX idx_kelas (kelas_id),
  INDEX idx_mentor (mentor_id),
  INDEX idx_tanggal (tanggal)
);

-- Check if column exists before adding (MySQL 5.7+ compatible)
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() 
   AND TABLE_NAME = 'history_materi' 
   AND COLUMN_NAME = 'materi_diajarkan') = 0,
  'ALTER TABLE history_materi ADD COLUMN materi_diajarkan TEXT AFTER hasil_belajar',
  'SELECT "Column materi_diajarkan already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if column exists before adding mata_pelajaran_id
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() 
   AND TABLE_NAME = 'jadwal_sesi' 
   AND COLUMN_NAME = 'mata_pelajaran_id') = 0,
  'ALTER TABLE jadwal_sesi ADD COLUMN mata_pelajaran_id INT AFTER mentor_id',
  'SELECT "Column mata_pelajaran_id already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if column exists before adding status
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() 
   AND TABLE_NAME = 'jadwal_sesi' 
   AND COLUMN_NAME = 'status') = 0,
  'ALTER TABLE jadwal_sesi ADD COLUMN status ENUM("pending", "scheduled", "approved", "completed", "cancelled") DEFAULT "pending" AFTER jam_selesai',
  'SELECT "Column status already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index untuk optimasi query (only create if they don't exist)
CREATE INDEX IF NOT EXISTS idx_jadwal_mentor_tanggal ON jadwal_sesi(mentor_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_jadwal_kelas_tanggal ON jadwal_sesi(kelas_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_jadwal_status ON jadwal_sesi(status);

-- Sample data untuk testing
INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES 
(1, 2, 'Halo, bagaimana kabar Anda?'),
(2, 1, 'Baik, terima kasih. Bagaimana dengan Anda?');

-- Update existing jadwal_sesi to have completed status for past dates
UPDATE jadwal_sesi 
SET status = 'completed' 
WHERE tanggal < CURDATE() AND status IN ('scheduled', 'approved');
