-- Script untuk mengisi data silabus sample di phpMyAdmin
-- Jalankan script ini di phpMyAdmin cPanel Anda

-- 1. Pastikan tabel silabus sudah ada (jika belum, buat dulu)
CREATE TABLE IF NOT EXISTS `silabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 2. Hapus data lama jika ada (optional - hapus baris ini jika ingin mempertahankan data lama)
-- DELETE FROM silabus;

-- 3. Insert sample data silabus
INSERT INTO `silabus` (`nama`, `deskripsi`) VALUES
('Silabus Matematika Dasar - Aljabar', 'Silabus lengkap untuk pembelajaran aljabar dasar yang mencakup operasi bilangan, persamaan linear, dan sistem persamaan. Materi disusun secara sistematis untuk memudahkan pemahaman siswa kelas 10.'),
('Silabus Fisika SMA - Mekanika', 'Panduan pembelajaran fisika mekanika untuk SMA yang meliputi kinematika, dinamika, dan energi. Dilengkapi dengan eksperimen dan praktikum untuk memperkuat pemahaman konsep.'),
('Silabus Kimia Organik', 'Silabus kimia organik yang membahas struktur, sifat, dan reaksi senyawa karbon. Cocok untuk siswa kelas 12 yang mempersiapkan diri untuk ujian nasional dan seleksi perguruan tinggi.'),
('Silabus Bahasa Inggris - Grammar', 'Silabus pembelajaran grammar bahasa Inggris yang mencakup tenses, parts of speech, dan sentence structure. Dirancang untuk meningkatkan kemampuan berbahasa Inggris siswa.'),
('Silabus Biologi - Sel dan Genetika', 'Silabus biologi yang fokus pada struktur sel, fungsi organel, dan dasar-dasar genetika. Materi disesuaikan dengan kurikulum SMA dan dilengkapi dengan praktikum.'),
('Silabus Sejarah Indonesia', 'Silabus sejarah Indonesia yang membahas perjalanan bangsa dari masa pra-sejarah hingga kemerdekaan. Dilengkapi dengan analisis peristiwa penting dan dampaknya terhadap perkembangan bangsa.'),
('Silabus Geografi - Fisik', 'Silabus geografi fisik yang membahas bentuk muka bumi, iklim, dan ekosistem. Materi disusun untuk membantu siswa memahami interaksi antara manusia dan lingkungan.'),
('Silabus Ekonomi - Mikro', 'Silabus ekonomi mikro yang membahas konsep dasar ekonomi, permintaan dan penawaran, serta struktur pasar. Cocok untuk siswa yang mempersiapkan diri untuk studi ekonomi di perguruan tinggi.'),
('Silabus Sosiologi - Masyarakat', 'Silabus sosiologi yang membahas struktur sosial, interaksi sosial, dan perubahan sosial dalam masyarakat. Materi disesuaikan dengan konteks Indonesia.'),
('Silabus Seni Budaya - Musik', 'Silabus seni budaya yang fokus pada pembelajaran musik tradisional dan modern. Mencakup teori musik, praktik bermain alat musik, dan apresiasi seni musik.');

-- 4. Verifikasi data yang telah dimasukkan
SELECT * FROM silabus ORDER BY created_at DESC;





