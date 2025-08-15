const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const kelasRoutes = require('./routes/kelas');
const usersRoutes = require('./routes/users');
const mentorsRoutes = require('./routes/mentors');
const adminRoutes = require('./routes/admin');
const jadwalSesiRoutes = require('./routes/jadwalSesi');
const availabilityMentorRoutes = require('./routes/availabilityMentor');
const permintaanJadwalRoutes = require('./routes/permintaanJadwal');
const historyMateriRoutes = require('./routes/historyMateri');
const silabusRoutes = require('./routes/silabus');
const mataPelajaranRoutes = require('./routes/mataPelajaran');
const notifikasiRoutes = require('./routes/notifikasi');
const mentorMataPelajaranRoutes = require('./routes/mentorMataPelajaran');
const { errorHandler } = require('./middleware');
const { authenticateJWT } = require('./auth');

app.use('/api/kelas', kelasRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jadwal-sesi', jadwalSesiRoutes);
app.use('/api/availability-mentor', availabilityMentorRoutes);
app.use('/api/permintaan-jadwal', permintaanJadwalRoutes);
app.use('/api/history-materi', historyMateriRoutes);
app.use('/api/silabus', silabusRoutes);
app.use('/api/mata-pelajaran', mataPelajaranRoutes);
app.use('/api/notifikasi', notifikasiRoutes);
app.use('/api/mentor-mata-pelajaran', mentorMataPelajaranRoutes);
app.use(errorHandler);

app.listen(5000, () => {
  console.log('Server running on port 5000');
}); 