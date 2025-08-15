// Test script untuk memverifikasi API mentors/available
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAvailableMentors() {
  try {
    // Test dengan tanggal 08/08/2025 (Jumat) - minggu ke-32
    const response = await axios.get(`${API_BASE}/mentors/available`, {
      params: {
        mapel_id: 1,
        tanggal: '2025-08-08',
        sesi: '1',
        kelas_id: 1
      }
    });
    
    console.log('Response:', response.data);
    console.log('Jumlah mentor available:', response.data.length);
    
    // Test dengan tanggal 07/08/2025 (Kamis) - minggu ke-32
    const response2 = await axios.get(`${API_BASE}/mentors/available`, {
      params: {
        mapel_id: 1,
        tanggal: '2025-08-07',
        sesi: '1',
        kelas_id: 1
      }
    });
    
    console.log('\nResponse untuk Kamis:', response2.data);
    console.log('Jumlah mentor available untuk Kamis:', response2.data.length);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAvailableMentors(); 