/**
 * Event Horizon – script.js
 * Student: Abdullah | Reg: 24PWBCS1319
 * Course: Web Technologies (CS-224) | UET Peshawar
 * Instructor: Mr. Mohammad
 */

'use strict';

/* ══════════════════
   1. INITIAL DATA
══════════════════ */

// Predefined events array (each event is an object)
let events = [
  {
    id: 1,
    name: 'Tech Summit 2024',
    date: '2024-11-15',
    desc: 'Annual summit featuring keynotes on AI, cloud computing, and cybersecurity trends.'
  },
  {
    id: 2,
    name: 'Web Dev Workshop',
    date: '2024-12-10',
    desc: 'Hands-on workshop covering front-end frameworks and responsive design best practices.'
  },
  {
    id: 3,
    name: 'UET Career Fair',
    date: '2025-03-22',
    desc: 'Meet top companies hiring CS graduates. Bring your CV for on-spot interviews.'
  },
  {
    id: 4,
    name: 'Cybersecurity Bootcamp',
    date: '2025-07-05',
    desc: 'Intensive 3-day bootcamp covering ethical hacking and penetration testing.'
  },
  {
    id: 5,
    name: 'AI & ML Conference',
    date: '2025-09-18',
    desc: 'Explore the latest research in machine learning and generative AI applications.'
  }
];

// Counter for unique IDs
let nextId = events.length + 1;


/* ══════════════════
   2. DOM ELEMENTS
══════════════════ */

const nameInput     = document.getElementById('event-name');
const dateInput     = document.getElementById('event-date');
const descInput     = document.getElementById('event-desc');
const warningMsg    = document.getElementById('warning-msg');
const container     = document.getElementById('events-container');
const searchInput   = document.getElementById('search-input');
const noResults     = document.getElementById('no-results');
const footerYear    = document.getElementById('footer-year');


/* ══════════════════
   3. HELPER FUNCTIONS
══════════════════ */

// Check if a date is in the past
function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr + 'T00:00:00');
  return eventDate < today;
}

// Format date: "2025-09-18" → "18 Sep 2025"
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Sort events by date (earliest first)
function sortEvents() {
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Prevent XSS by escaping special characters
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ══════════════════
   4. RENDER EVENTS
══════════════════ */

function renderEvents() {
  // Get search query (lowercase)
  const query = searchInput.value.trim().toLowerCase();

  // Filter events by name or date
  const filtered = events.filter(function(ev) {
    if (!query) return true; // no search = show all
    return (
      ev.name.toLowerCase().includes(query) ||
      ev.date.includes(query) ||
      formatDate(ev.date).toLowerCase().includes(query)
    );
  });

  // Clear container
  container.innerHTML = '';

  // Show "no results" message if empty
  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  // Create a card for each event
  filtered.forEach(function(ev) {
    const card = createCard(ev);
    container.appendChild(card);
  });
}


/* ══════════════════
   5. CREATE CARD
══════════════════ */

function createCard(ev) {
  const past = isPast(ev.date);

  // Create article element
  const card = document.createElement('article');
  card.className = 'event-card' + (past ? ' past' : '');
  card.dataset.id = ev.id;

  // Build card HTML
  card.innerHTML = `
    <div class="card-top">
      <h3 class="event-name">${escapeHTML(ev.name)}</h3>
      <span class="badge ${past ? 'past' : 'upcoming'}">${past ? 'Past' : 'Upcoming'}</span>
    </div>
    <p class="event-date">📅 ${formatDate(ev.date)}</p>
    <p class="event-desc">${escapeHTML(ev.desc)}</p>
    <div class="card-footer">
      <button class="btn-delete" data-id="${ev.id}">🗑 Delete</button>
    </div>
  `;

  return card;
}


/* ══════════════════
   6. ADD EVENT
══════════════════ */

function addEvent() {
  const name = nameInput.value.trim();
  const date = dateInput.value;
  const desc = descInput.value.trim();

  // Validate: all fields required
  if (!name || !date || !desc) {
    warningMsg.classList.remove('hidden'); // show warning
    return;
  }

  // Hide warning if shown
  warningMsg.classList.add('hidden');

  // Create new event object
  const newEvent = {
    id:   nextId++,
    name: name,
    date: date,
    desc: desc
  };

  // Add to array
  events.push(newEvent);

  // Sort by date
  sortEvents();

  // Re-render
  renderEvents();

  // Clear form fields
  nameInput.value = '';
  dateInput.value = '';
  descInput.value = '';

  // Scroll down to events list
  document.querySelector('.events-section').scrollIntoView({ behavior: 'smooth' });
}


/* ══════════════════
   7. DELETE EVENT
══════════════════ */

// Use event delegation: one listener on the container
container.addEventListener('click', function(e) {
  // Check if a delete button was clicked
  if (!e.target.classList.contains('btn-delete')) return;

  const id = parseInt(e.target.dataset.id);
  const card = e.target.closest('.event-card');

  // Animate the card out
  card.style.opacity = '0';
  card.style.transform = 'scale(0.95)';
  card.style.transition = 'opacity 0.25s, transform 0.25s';

  // Remove after animation
  setTimeout(function() {
    events = events.filter(function(ev) { return ev.id !== id; });
    renderEvents();
  }, 250);
});


/* ══════════════════
   8. SEARCH
══════════════════ */

// Already handled: renderEvents() is called via oninput on the search field


/* ══════════════════
   9. INIT
══════════════════ */

function init() {
  // Set current year in footer
  footerYear.textContent = new Date().getFullYear();

  // Sort and display initial events
  sortEvents();
  renderEvents();
}

// Run on page load
init();
