-- Script sederhana untuk mengisi data kelas
-- Jalankan script ini di phpMyAdmin cPanel Anda

-- Insert data kelas dasar
INSERT INTO `kelas` (`nama`, `tipe`) VALUES
-- KELAS REGULAR SMA
('Kelas 10 A', 'regular'),
('Kelas 10 B', 'regular'),
('Kelas 11 A', 'regular'),
('Kelas 11 B', 'regular'),
('Kelas 12 A', 'regular'),
('Kelas 12 B', 'regular'),

-- KELAS MIPA
('Kelas 10 MIPA', 'regular'),
('Kelas 11 MIPA', 'regular'),
('Kelas 12 MIPA', 'regular'),

-- KELAS IPS
('Kelas 10 IPS', 'regular'),
('Kelas 11 IPS', 'regular'),
('Kelas 12 IPS', 'regular'),

-- KELAS B2B
('Kelas B2B Matematika', 'b2b'),
('Kelas B2B Fisika', 'b2b'),
('Kelas B2B Kimia', 'b2b'),
('Kelas B2B Biologi', 'b2b'),
('Kelas B2B Bahasa Indonesia', 'b2b'),
('Kelas B2B Bahasa Inggris', 'b2b'),

-- KELAS B2B UTBK
('Kelas B2B TPS UTBK', 'b2b'),
('Kelas B2B Saintek UTBK', 'b2b'),
('Kelas B2B Soshum UTBK', 'b2b'),

-- KELAS PRIVAT
('Kelas Privat Matematika', 'privat'),
('Kelas Privat Fisika', 'privat'),
('Kelas Privat Kimia', 'privat'),
('Kelas Privat Biologi', 'privat'),
('Kelas Privat Bahasa Indonesia', 'privat'),
('Kelas Privat Bahasa Inggris', 'privat'),

-- KELAS PRIVAT UTBK
('Kelas Privat TPS UTBK', 'privat'),
('Kelas Privat Saintek UTBK', 'privat'),
('Kelas Privat Soshum UTBK', 'privat'),

-- KELAS TAMBAHAN
('Kelas Intensif UTBK', 'regular'),
('Kelas Try Out UTBK', 'regular'),
('Kelas Remedial Matematika', 'regular'),
('Kelas Remedial Fisika', 'regular'),
('Kelas Remedial Kimia', 'regular'),
('Kelas Remedial Biologi', 'regular');

-- Verifikasi data
SELECT 
    id,
    nama,
    tipe
FROM kelas 
ORDER BY tipe, nama;

-- Statistik per tipe
SELECT 
    tipe,
    COUNT(*) as jumlah_kelas
FROM kelas 
GROUP BY tipe 
ORDER BY jumlah_kelas DESC;





