-- Script sederhana untuk mata pelajaran UTBK & SMA
-- Jalankan script ini di phpMyAdmin cPanel Anda

-- 1. Pastikan tabel mata_pelajaran sudah ada
CREATE TABLE IF NOT EXISTS `mata_pelajaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `level` enum('SMA','UTBK','Umum') DEFAULT 'SMA',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 2. Hapus data lama jika ada (optional)
-- DELETE FROM mata_pelajaran;

-- 3. Insert data mata pelajaran SMA
INSERT INTO `mata_pelajaran` (`nama`, `kategori`, `level`) VALUES
-- MATA PELAJARAN SMA
('Matematika Wajib', 'Matematika', 'SMA'),
('Matematika Peminatan', 'Matematika', 'SMA'),
('Fisika', 'Sains', 'SMA'),
('Kimia', 'Sains', 'SMA'),
('Biologi', 'Sains', 'SMA'),
('Bahasa Indonesia', 'Bahasa', 'SMA'),
('Bahasa Inggris', 'Bahasa', 'SMA'),
('Sejarah Indonesia', 'Sosial', 'SMA'),
('Sejarah Peminatan', 'Sosial', 'SMA'),
('Geografi', 'Sosial', 'SMA'),
('Ekonomi', 'Sosial', 'SMA'),
('Sosiologi', 'Sosial', 'SMA'),
('Antropologi', 'Sosial', 'SMA'),
('Pendidikan Agama', 'Agama', 'SMA'),
('Pendidikan Jasmani', 'Olahraga', 'SMA'),
('Seni Budaya', 'Seni', 'SMA'),
('Prakarya', 'Keterampilan', 'SMA'),

-- MATA PELAJARAN UTBK
('TPS (Tes Potensi Skolastik)', 'UTBK', 'UTBK'),
('Penalaran Umum', 'UTBK', 'UTBK'),
('Pengetahuan Kuantitatif', 'UTBK', 'UTBK'),
('Pemahaman Membaca', 'UTBK', 'UTBK'),
('Pengetahuan Umum', 'UTBK', 'UTBK'),
('Matematika Saintek', 'UTBK Saintek', 'UTBK'),
('Fisika Saintek', 'UTBK Saintek', 'UTBK'),
('Kimia Saintek', 'UTBK Saintek', 'UTBK'),
('Biologi Saintek', 'UTBK Saintek', 'UTBK'),
('Matematika Soshum', 'UTBK Soshum', 'UTBK'),
('Geografi Soshum', 'UTBK Soshum', 'UTBK'),
('Sejarah Soshum', 'UTBK Soshum', 'UTBK'),
('Sosiologi Soshum', 'UTBK Soshum', 'UTBK'),
('Ekonomi Soshum', 'UTBK Soshum', 'UTBK'),
('Bahasa Indonesia UTBK', 'UTBK Bahasa', 'UTBK'),
('Bahasa Inggris UTBK', 'UTBK Bahasa', 'UTBK'),
('Literasi Bahasa Indonesia', 'UTBK Bahasa', 'UTBK'),
('Literasi Bahasa Inggris', 'UTBK Bahasa', 'UTBK'),

-- MATA PELAJARAN TAMBAHAN
('Strategi Mengerjakan UTBK', 'Persiapan UTBK', 'UTBK'),
('Manajemen Waktu UTBK', 'Persiapan UTBK', 'UTBK'),
('Psikologi Ujian', 'Persiapan UTBK', 'UTBK'),
('Analisis Soal UTBK', 'Persiapan UTBK', 'UTBK'),
('Bahasa Mandarin', 'Bahasa Asing', 'SMA'),
('Bahasa Jepang', 'Bahasa Asing', 'SMA'),
('Bahasa Arab', 'Bahasa Asing', 'SMA'),
('Bahasa Korea', 'Bahasa Asing', 'SMA'),
('Teknologi Informasi', 'Teknologi', 'SMA'),
('Pemrograman Dasar', 'Teknologi', 'SMA'),
('Digital Marketing', 'Teknologi', 'SMA'),
('Public Speaking', 'Soft Skills', 'SMA'),
('Leadership', 'Soft Skills', 'SMA'),
('Critical Thinking', 'Soft Skills', 'SMA'),
('Time Management', 'Soft Skills', 'SMA'),
('Kewirausahaan', 'Soft Skills', 'SMA');

-- 4. Verifikasi data
SELECT 
    id,
    nama,
    kategori,
    level
FROM mata_pelajaran 
ORDER BY level, kategori, nama;

-- 5. Statistik per level
SELECT 
    level,
    COUNT(*) as jumlah_mata_pelajaran
FROM mata_pelajaran 
GROUP BY level 
ORDER BY jumlah_mata_pelajaran DESC;





