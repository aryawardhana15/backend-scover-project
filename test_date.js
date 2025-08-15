// Test script untuk memverifikasi perhitungan minggu dan hari
const { getWeekNumber, getHariFromDate } = require('./backend/utils/dateUtils');

// Test tanggal 08/08/2025 (Jumat)
const testDate = new Date('2025-08-08');
console.log('Tanggal:', testDate.toISOString().split('T')[0]);
console.log('Hari:', getHariFromDate(testDate));
console.log('Minggu ke:', getWeekNumber(testDate));

// Test beberapa tanggal lain untuk memastikan konsistensi
const testDates = [
  '2025-08-04', // Senin
  '2025-08-05', // Selasa
  '2025-08-06', // Rabu
  '2025-08-07', // Kamis
  '2025-08-08', // Jumat
  '2025-08-09', // Sabtu
  '2025-08-10'  // Minggu
];

console.log('\nTest konsistensi:');
testDates.forEach(dateStr => {
  const date = new Date(dateStr);
  console.log(`${dateStr}: ${getHariFromDate(date)} - Minggu ke-${getWeekNumber(date)}`);
}); 