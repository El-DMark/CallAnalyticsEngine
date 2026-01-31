// Backend API base URL
const API_BASE = "http://localhost:5000/api";

// Fetch users
async function loadUsers() {
  const res = await fetch(`${API_BASE}/users`);
  const users = await res.json();

  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  users.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.employee_id}</td>
      <td>${u.full_name}</td>
      <td>${u.email}</td>
      <td>${u.mobile_no}</td>
    `;
    tbody.appendChild(row);
  });
}

// Fetch stats
async function loadStats() {
  const res = await fetch(`${API_BASE}/stats/users`);
  const stats = await res.json();

  const container = document.getElementById("statsContainer");
  container.innerHTML = "";

  stats.forEach(s => {
    const box = document.createElement("div");
    box.className = "statBox";
    box.innerHTML = `
      <h3>${s.name} (${s.employee_id})</h3>
      <p>Total Calls: ${s.total_calls}</p>
      <p>Total Duration: ${s.total_duration} seconds</p>
    `;
    container.appendChild(box);
  });
}

// Load data on page load
window.onload = () => {
  loadUsers();
  loadStats();
};
