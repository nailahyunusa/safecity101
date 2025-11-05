// ============================
// admin-dashboard.js - SafeCity Kaduna
// ============================

// Reference to table body
const reportTableBody = document.querySelector('#reportTable tbody');

// Initialize Leaflet map centered on Kaduna
const map = L.map('map').setView([9.0578, 7.4951], 13); // Kaduna coordinates

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 19
}).addTo(map);

// Layer group for markers
const markerGroup = L.layerGroup().addTo(map);
let markersById = {};

// Load reports from localStorage and render table + markers
function loadReports() {
  const reports = JSON.parse(localStorage.getItem('crimeReports')) || [];

  // Clear table and markers
  reportTableBody.innerHTML = '';
  markerGroup.clearLayers();
  markersById = {};

  reports.forEach(report => {
    // --- Table row ---
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${report.id}</td>
      <td>${report.type}</td>
      <td>${report.description}</td>
      <td>${report.location ? `(${report.location.lat.toFixed(6)}, ${report.location.lng.toFixed(6)})` : 'N/A'}</td>
      <td>
        <button class="delete-btn" data-id="${report.id}">Delete</button>
      </td>
    `;
    reportTableBody.appendChild(tr);

    // Delete button
    tr.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this report?')) {
        const updatedReports = reports.filter(r => r.id !== report.id);
        localStorage.setItem('crimeReports', JSON.stringify(updatedReports));
        loadReports();
      }
    });

    // --- Marker ---
    if (report.location) {
      const marker = L.marker([report.location.lat, report.location.lng])
        .addTo(markerGroup)
        .bindPopup(`<b>${report.type}</b><br>${report.description}`);
      markersById[report.id] = marker;

      // Make table row clickable
      tr.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) return;
        map.setView([report.location.lat, report.location.lng], 15);
        marker.openPopup();
      });
    }
  });
}

// Initial load
loadReports();