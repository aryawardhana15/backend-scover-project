-- Script untuk mengisi data mentor_mata_pelajaran UTBK & SMA
-- Jalankan script ini SETELAH insert data mata_pelajaran

-- 1. Pastikan tabel mentor_mata_pelajaran sudah ada
CREATE TABLE IF NOT EXISTS `mentor_mata_pelajaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mentor_id` int(11) NOT NULL,
  `mata_pelajaran_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_mentor_mapel` (`mentor_id`, `mata_pelajaran_id`),
  KEY `fk_mentor` (`mentor_id`),
  KEY `fk_mata_pelajaran` (`mata_pelajaran_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 2. Hapus data lama jika ada (optional)
-- DELETE FROM mentor_mata_pelajaran;

-- 3. Insert sample data mentor_mata_pelajaran untuk UTBK & SMA
-- Asumsikan ada mentor dengan ID 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

-- MENTOR 1: Spesialis Matematika SMA & UTBK
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(1, 1),  -- Matematika Wajib
(1, 2),  -- Matematika Peminatan
(1, 6),  -- Matematika Saintek UTBK
(1, 11), -- Matematika Soshum UTBK
(1, 2),  -- Pengetahuan Kuantitatif UTBK
(1, 30); -- Strategi Mengerjakan UTBK

-- MENTOR 2: Spesialis Fisika SMA & UTBK Saintek
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(2, 3),  -- Fisika SMA
(2, 7),  -- Fisika Saintek UTBK
(2, 1),  -- Matematika Wajib (untuk fisika)
(2, 2),  -- Matematika Peminatan (untuk fisika)
(2, 30); -- Strategi Mengerjakan UTBK

-- MENTOR 3: Spesialis Kimia SMA & UTBK Saintek
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(3, 4),  -- Kimia SMA
(3, 8),  -- Kimia Saintek UTBK
(3, 1),  -- Matematika Wajib (untuk kimia)
(3, 30); -- Strategi Mengerjakan UTBK

-- MENTOR 4: Spesialis Biologi SMA & UTBK Saintek
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(4, 5),  -- Biologi SMA
(4, 9),  -- Biologi Saintek UTBK
(4, 30); -- Strategi Mengerjakan UTBK

-- MENTOR 5: Spesialis Bahasa Indonesia SMA & UTBK
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(5, 6),  -- Bahasa Indonesia SMA
(5, 15), -- Bahasa Indonesia UTBK
(5, 17), -- Literasi Bahasa Indonesia UTBK
(5, 4),  -- Pemahaman Membaca UTBK
(5, 30); -- Strategi Mengerjakan UTBK

-- MENTOR 6: Spesialis Bahasa Inggris SMA & UTBK
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(6, 7),  -- Bahasa Inggris SMA
(6, 16), -- Bahasa Inggris UTBK
(6, 18), -- Literasi Bahasa Inggris UTBK
(6, 4),  -- Pemahaman Membaca UTBK
(6, 30); -- Strategi Mengerjakan UTBK

-- MENTOR 7: Spesialis Soshum UTBK (Sejarah, Geografi, Sosiologi, Ekonomi)
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(7, 9),  -- Sejarah Indonesia SMA
(7, 10), -- Sejarah Peminatan SMA
(7, 12), -- Geografi SMA
(7, 13), -- Ekonomi SMA
(7, 14), -- Sosiologi SMA
(7, 12), -- Geografi Soshum UTBK
(7, 13), -- Sejarah Soshum UTBK
(7, 14), -- Sosiologi Soshum UTBK
(7, 15), -- Ekonomi Soshum UTBK
(7, 11), -- Matematika Soshum UTBK
(7, 30); -- Strategi Mengerjakan UTBK

-- MENTOR 8: Spesialis TPS UTBK (Tes Potensi Skolastik)
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(8, 1),  -- TPS (Tes Potensi Skolastik)
(8, 2),  -- Penalaran Umum
(8, 3),  -- Pengetahuan Kuantitatif
(8, 4),  -- Pemahaman Membaca
(8, 5),  -- Pengetahuan Umum
(8, 30), -- Strategi Mengerjakan UTBK
(8, 31), -- Manajemen Waktu UTBK
(8, 32), -- Psikologi Ujian
(8, 33); -- Analisis Soal UTBK

-- MENTOR 9: Spesialis Bahasa Asing
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(9, 7),  -- Bahasa Inggris SMA
(9, 20), -- Bahasa Mandarin
(9, 21), -- Bahasa Jepang
(9, 22), -- Bahasa Arab
(9, 23); -- Bahasa Korea

-- MENTOR 10: Spesialis Teknologi & Soft Skills
INSERT INTO `mentor_mata_pelajaran` (`mentor_id`, `mata_pelajaran_id`) VALUES
(10, 24), -- Teknologi Informasi
(10, 25), -- Pemrograman Dasar
(10, 26), -- Digital Marketing
(10, 27), -- Public Speaking
(10, 28), -- Leadership
(10, 29), -- Critical Thinking
(10, 30), -- Time Management
(10, 31); -- Kewirausahaan

-- 4. Verifikasi data
SELECT 
    mmp.id,
    m.nama as mentor_nama,
    mp.nama as mata_pelajaran_nama,
    mp.kategori,
    mp.level,
    mmp.created_at
FROM mentor_mata_pelajaran mmp
JOIN mentors m ON mmp.mentor_id = m.id
JOIN mata_pelajaran mp ON mmp.mata_pelajaran_id = mp.id
ORDER BY m.nama, mp.level, mp.kategori, mp.nama;

-- 5. Statistik per mentor
SELECT 
    m.nama as mentor_nama,
    COUNT(mmp.mata_pelajaran_id) as jumlah_mata_pelajaran,
    COUNT(CASE WHEN mp.level = 'SMA' THEN 1 END) as mata_pelajaran_sma,
    COUNT(CASE WHEN mp.level = 'UTBK' THEN 1 END) as mata_pelajaran_utbk
FROM mentors m
LEFT JOIN mentor_mata_pelajaran mmp ON m.id = mmp.mentor_id
LEFT JOIN mata_pelajaran mp ON mmp.mata_pelajaran_id = mp.id
GROUP BY m.id, m.nama
ORDER BY jumlah_mata_pelajaran DESC;

-- 6. Statistik per level dan kategori
SELECT 
    mp.level,
    mp.kategori,
    COUNT(DISTINCT mmp.mentor_id) as jumlah_mentor,
    COUNT(mmp.id) as total_assignments
FROM mata_pelajaran mp
LEFT JOIN mentor_mata_pelajaran mmp ON mp.id = mmp.mata_pelajaran_id
GROUP BY mp.level, mp.kategori
ORDER BY mp.level, total_assignments DESC;





