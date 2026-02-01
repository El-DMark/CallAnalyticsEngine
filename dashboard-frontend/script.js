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
      <td>${u.device_id}</td>
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
      <h3>${s.full_name} (${s.employee_id})</h3>
      <p>Device ID: ${s.device_id}</p>
      <p>Total Calls: ${s.total_calls}</p>
      <p>Total Duration: ${s.total_duration} seconds</p>
    `;
    container.appendChild(box);
  });
}

// Handle Add User form
document.getElementById("addUserForm").addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("✅ User added successfully!");
      e.target.reset();
      loadUsers();
    } else {
      alert("❌ Failed to add user");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error adding user");
  }
});

// Handle Add Call form
document.getElementById("addCallForm").addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${API_BASE}/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("✅ Call logged successfully!");
      e.target.reset();
      loadStats();
    } else {
      alert("❌ Failed to log call");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error logging call");
  }
});

// Search filter for employees
document.getElementById("searchUser").addEventListener("input", e => {
  const filter = e.target.value.toLowerCase();
  document.querySelectorAll("#usersTable tbody tr").forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
});

// Initial load
window.onload = () => {
  loadUsers();
  loadStats();
};
