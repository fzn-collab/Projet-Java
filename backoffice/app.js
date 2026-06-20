import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDa_aPiNQpV8H-J1vd12K9zlYu0JlrnbQA',
  authDomain: 'connectentrepreneurs.firebaseapp.com',
  projectId: 'connectentrepreneurs',
  storageBucket: 'connectentrepreneurs.firebasestorage.app',
  messagingSenderId: '238114919941',
  appId: '1:238114919941:web:d763af15c5bdcc1170ae6c',
};

const API_BASE_URL = 'http://localhost:8081/api/users';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authCard = document.getElementById('authCard');
const adminCard = document.getElementById('adminCard');
const authError = document.getElementById('authError');
const loading = document.getElementById('loading');
const tbody = document.querySelector('#usersTable tbody');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const refreshBtn = document.getElementById('refreshBtn');
const logoutBtn = document.getElementById('logoutBtn');

const isProfileComplete = (u) => {
  const hasNom = !!u.nom?.trim();
  const hasSecteur = !!u.secteur?.trim();
  const hasCompetences = Array.isArray(u.competences) && u.competences.length > 0;
  const hasBesoin = !!u.besoin?.trim();
  const hasVille = !!u.localisation?.ville?.trim();
  return hasNom && hasSecteur && hasCompetences && hasBesoin && hasVille;
};

const getHeaders = async () => {
  const token = await auth.currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-User-Role': 'ADMIN',
  };
};

const fetchUsers = async () => {
  loading.textContent = 'Chargement...';
  tbody.innerHTML = '';

  try {
    const headers = await getHeaders();
    const response = await fetch(API_BASE_URL, { headers });

    if (!response.ok) {
      throw new Error('Acces refuse. Assure-toi que ton compte a le role ADMIN.');
    }

    const users = await response.json();
    renderUsers(users);
    loading.textContent = `${users.length} utilisateur(s)`;
  } catch (error) {
    loading.textContent = error.message;
  }
};

const toggleSuspend = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}/suspend`, {
      method: 'PUT',
      headers,
    });

    if (!response.ok) {
      throw new Error('Echec suspend/reprise utilisateur');
    }

    await fetchUsers();
  } catch (error) {
    alert(error.message);
  }
};

const renderUsers = (users) => {
  tbody.innerHTML = '';

  users.forEach((u) => {
    const tr = document.createElement('tr');
    const completed = isProfileComplete(u);

    tr.innerHTML = `
      <td>${u.nom || '-'}</td>
      <td>${u.email || '-'}</td>
      <td>${u.role || 'USER'}</td>
      <td>${u.actif ? 'Oui' : 'Non'}</td>
      <td><span class="badge ${completed ? 'ok' : 'warn'}">${completed ? 'Complet' : 'Incomplet'}</span></td>
      <td><button data-id="${u.id}" class="${u.actif ? 'danger' : ''}">${u.actif ? 'Suspendre' : 'Reactiver'}</button></td>
    `;

    tr.querySelector('button').addEventListener('click', () => toggleSuspend(u.id));
    tbody.appendChild(tr);
  });
};

loginBtn.addEventListener('click', async () => {
  authError.textContent = '';

  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (error) {
    authError.textContent = error.message;
  }
});

refreshBtn.addEventListener('click', fetchUsers);
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    authCard.classList.add('hidden');
    adminCard.classList.remove('hidden');
    await fetchUsers();
  } else {
    adminCard.classList.add('hidden');
    authCard.classList.remove('hidden');
  }
});
