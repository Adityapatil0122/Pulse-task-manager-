// 1. Firebase Imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// 2. Configuration
// TODO: PASTE YOUR KEYS FROM FIREBASE CONSOLE HERE
const firebaseConfig = {
  apiKey: "AIzaSyC54VFlexrVF70VS5gXlSc_Wb25hbjdoEE",
  authDomain: "pulse-task-manager-a91f5.firebaseapp.com",
  projectId: "pulse-task-manager-a91f5",
  storageBucket: "pulse-task-manager-a91f5.firebasestorage.app",
  messagingSenderId: "455310939106",
  appId: "1:455310939106:web:a6c71da9e94e231e4a5fbb",
  measurementId: "G-MK0V9SYY97"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "pulse-web-app"; // You can leave this as is

// 3. State
let currentUser = null;
let tasks = [];
let currentFilter = 'all';
let editingId = null;
let isLoginMode = true;

// 4. DOM Elements
const authScreen = document.getElementById('authScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authToggleBtn = document.getElementById('authToggleBtn');
const authToggleText = document.getElementById('authToggleText');
const authError = document.getElementById('authError');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const taskList = document.getElementById('taskList');
const emptyHint = document.getElementById('emptyHint');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const statusSelect = document.getElementById('statusSelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const addIcon = document.getElementById('addIcon');
const filterBtns = document.querySelectorAll('.filter-btn');
const progressPath = document.getElementById('progressPath');
const progressText = document.getElementById('progressText');

// 5. Auth Logic
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    authScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    userEmailDisplay.textContent = user.email || 'Anonymous';
    startListening(user.uid);
  } else {
    authScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
    tasks = [];
    render();
  }
});

authToggleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  authSubmitBtn.textContent = isLoginMode ? 'Log In' : 'Sign Up';
  authToggleText.textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
  authToggleBtn.textContent = isLoginMode ? "Sign Up" : "Log In";
  authError.style.display = 'none';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.style.display = 'none';
  const email = authEmail.value;
  const password = authPassword.value;
  
  try {
    if (isLoginMode) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  } catch (err) {
    authError.textContent = err.message.replace('Firebase: ', '');
    authError.style.display = 'block';
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// 6. Firestore Logic
let unsubscribe = null;

function startListening(uid) {
  if (unsubscribe) unsubscribe();
  
  // Create a query to order by time
  const q = query(
    collection(db, 'artifacts', appId, 'users', uid, 'tasks'), 
    orderBy('createdAt', 'desc')
  );
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    render();
    updateStats();
  });
}

// 7. Core App Logic
addTaskBtn.addEventListener('click', handleAddOrUpdate);

async function handleAddOrUpdate() {
  const text = taskInput.value.trim();
  if (!text) return;

  if (editingId) {
    // Update
    await updateDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks', editingId), {
      name: text,
      priority: prioritySelect.value,
      status: statusSelect.value
    });
    resetForm();
  } else {
    // Add
    await addDoc(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks'), {
      name: text,
      priority: prioritySelect.value,
      status: statusSelect.value, // pending, in-progress, done
      createdAt: serverTimestamp()
    });
    taskInput.value = '';
    // Reset defaults
    statusSelect.value = 'pending';
    prioritySelect.value = 'medium';
  }
}

function resetForm() {
  editingId = null;
  taskInput.value = '';
  prioritySelect.value = 'medium';
  statusSelect.value = 'pending';
  addTaskBtn.classList.remove('save-mode');
  addIcon.setAttribute('data-lucide', 'plus');
  lucide.createIcons();
}

// Global functions for HTML access
window.editTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingId = id;
  taskInput.value = task.name;
  prioritySelect.value = task.priority;
  statusSelect.value = task.status;
  
  addTaskBtn.classList.add('save-mode');
  addIcon.setAttribute('data-lucide', 'check');
  lucide.createIcons();
  taskInput.focus();
};

window.deleteTask = async (id) => {
  if (confirm('Delete this task?')) {
    if(editingId === id) resetForm();
    await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks', id));
  }
};

window.changeStatus = async (id, newStatus) => {
  await updateDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'tasks', id), {
    status: newStatus
  });
}

// 8. Filters & Rendering
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  
  progressPath.setAttribute('stroke-dasharray', `${percent}, 100`);
  progressText.textContent = `${percent}%`;
}

function render() {
  taskList.innerHTML = '';
  const filtered = tasks.filter(t => currentFilter === 'all' ? true : t.status === currentFilter);
  
  if (filtered.length === 0) {
    emptyHint.style.display = 'block';
  } else {
    emptyHint.style.display = 'none';
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task';
      li.innerHTML = `
        <div class="task-content">
          <div class="task-name" style="${task.status === 'done' ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${escapeHtml(task.name)}</div>
          <div class="task-meta">
            <span class="badge priority-${task.priority}">${task.priority}</span>
            <select class="status-select" onchange="changeStatus('${task.id}', this.value)">
              <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
              <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
            </select>
          </div>
        </div>
        <div style="display:flex; gap:4px;">
          <button class="icon-btn" onclick="editTask('${task.id}')"><i data-lucide="pencil" width="16"></i></button>
          <button class="icon-btn delete" onclick="deleteTask('${task.id}')"><i data-lucide="trash-2" width="16"></i></button>
        </div>
      `;
      taskList.appendChild(li);
    });
    lucide.createIcons();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Init icons
lucide.createIcons();