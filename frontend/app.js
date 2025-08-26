// Simple frontend logic for login and dashboard toggle
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');

loginBtn.onclick = async () => {
  // Dummy login, replace with real API call
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username && password) {
    localStorage.setItem('token', 'dummy-jwt');
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    alert('Enter username and password');
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem('token');
  loginSection.style.display = 'block';
  dashboard.style.display = 'none';
};
