self.addEventListener('install', (event) => {
  console.log('[SW] Installeret');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Aktiveret');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
const CACHE_NAME = 'Training-Tracker-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/questionnaire.html',
  '/maal.html',
  '/style.css',
  '/questionnaire.css',
  '/maal.css',
  '/script.js',
  '/questionnaire.js',
  '/maal.js', 
  
  // Add these new lines to cache the tutorial images:
  '/img/tutorial-1.jpg',
  '/img/tutorial-2.jpg',
  '/img/tutorial-3.jpg',
  '/img/tutorial-4.jpg',
  '/img/tutorial-5.jpg'
];