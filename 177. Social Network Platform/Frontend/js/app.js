// Frontend Application
console.log('Frontend application loaded');

// Initialize API endpoint
const API_BASE_URL = 'http://localhost:3000/api';

// Sample function to fetch data from backend
async function fetchData(endpoint) {
  try {
    const response = await fetch(API_BASE_URL + endpoint);
    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchData };
}