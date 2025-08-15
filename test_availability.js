// Test script untuk memeriksa data availability mentor
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAvailability() {
  try {
    // Test availability mentor untuk minggu ke-32
    const response = await axios.get(`${API_BASE}/availability-mentor`, {
      params: {
        mentor_id: 1,
        minggu_ke: 32
      }
    });
    
    console.log('Data availability mentor 1 minggu ke-32:');
    console.log(response.data);
    
    // Test availability mentor untuk minggu ke-32
    const response2 = await axios.get(`${API_BASE}/availability-mentor`, {
      params: {
        mentor_id: 2,
        minggu_ke: 32
      }
    });
    
    console.log('\nData availability mentor 2 minggu ke-32:');
    console.log(response2.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAvailability(); 