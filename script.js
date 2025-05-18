document.addEventListener('DOMContentLoaded', function () {
  // Menu toggle functionality
  const burgerMenu = document.getElementById("burgerMenu");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  burgerMenu.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  function toggleMenu() {
    sideMenu.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  function closeMenu() {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  }

  // Highlight the active menu item
  const currentPage = window.location.pathname.split("/").pop(); // Get the current file name
  const menuLinks = document.querySelectorAll(".side-menu nav ul li a");

  menuLinks.forEach(link => {
    const linkPage = link.getAttribute("onclick").match(/'([^']+)'/)[1]; // Extract the page name from onclick
    if (linkPage === currentPage) {
      link.parentElement.classList.add("active"); // Add 'active' class to the parent <li>
    } else {
      link.parentElement.classList.remove("active");
    }
  });
});

// Cirkeldiagram (armstørrelse)
const ctxCircle = document.getElementById('circleChart').getContext('2d');
new Chart(ctxCircle, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [90, 10],
      backgroundColor: ['orange', '#ffdead'],
      cutout: '80%',
      borderWidth: 0
    }]
  },
  options: {
    responsive: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  }
});

// kg (uge)
new Chart(document.getElementById('kgWeek'), {
  type: 'bar',
  data: {
    labels: ['1-7', '8-14', '15-21', '22-36'],
    datasets: [{
      data: [10, 10, 11, 12],
      backgroundColor: '#ccc'
    }]
  },
  options: { plugins: { legend: { display: false } } }
});

// cm (uge)
new Chart(document.getElementById('cmWeek'), {
  type: 'bar',
  data: {
    labels: ['Uge 1', 'Uge 2'],
    datasets: [{
      data: [30, 25],
      backgroundColor: '#ccc'
    }]
  },
  options: { plugins: { legend: { display: false } } }
});

// kg (måned)
new Chart(document.getElementById('kgMonth'), {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      data: [54, 54.5, 55.1],
      backgroundColor: '#ccc'
    }]
  },
  options: { plugins: { legend: { display: false } } }
});

// cm (måned)
new Chart(document.getElementById('cmMonth'), {
  type: 'bar',
  data: {
    labels: ['Mar', 'Apr'],
    datasets: [{
      data: [25.9, 26.8],
      backgroundColor: '#ccc'
    }]
  },
  options: { plugins: { legend: { display: false } } }
});
function navigateTo(page) {
  window.location.assign(page); // Dette bevarer PWA-mode bedre end nogle andre metoder
}
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('/TrngTrkr/service-worker.js', { scope: '/TrngTrkr/' })
    .then(reg => console.log('Service worker registreret:', reg.scope))
    .catch(err => console.error('SW fejl:', err));
}
// This file provides the code you need to add to your existing script.js file
// to properly implement the PWA tutorial in your fitness app

// First, create a folder named 'img' in your project root
// Then create the tutorial images based on the HTML templates I provided earlier
// You need to take screenshots of each step and save them as:
// - img/tutorial-1.jpg (Initial screen showing the share button)
// - img/tutorial-2.jpg (Share menu with "Add to Home Screen" highlighted)
// - img/tutorial-3.jpg (Add to Home Screen confirmation dialog)
// - img/tutorial-4.jpg (Home screen with new app icon highlighted)
// - img/tutorial-5.jpg (App opened from home screen in standalone mode)

// Add this to the end of your existing script.js file:

// PWA Tutorial Component
// Create the style for the tutorial overlay
function createPWATutorialStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .tutorial-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.85);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .tutorial-content {
      width: 90%;
      max-width: 350px;
      background: rgba(50, 50, 50, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 60px;
      text-align: center;
      color: white;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      position: relative;
    }
    
    .tutorial-image {
      width: 100%;
      margin: 15px 0;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    
    .tutorial-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .tutorial-description {
      font-size: 16px;
      margin-bottom: 20px;
      color: #eee;
    }
    
    .tutorial-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 15px;
    }
    
    .nav-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 16px;
      cursor: pointer;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    
    .nav-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .nav-button.primary {
      background: rgb(255, 123, 0);
    }
    
    .nav-button.primary:hover {
      background: rgb(255, 140, 30);
    }
    
    .dots-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    
    .dot {
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      margin: 0 5px;
    }
    
    .dot.active {
      background: rgb(255, 123, 0);
      width: 12px;
      height: 12px;
      margin-top: -2px;
    }
    
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.3);
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

// Create the tutorial content
const tutorialSteps = [
  {
    title: "Installer Trng Trkr app",
    description: "Følg disse simple trin for at installere appen på din hjemmeskærm",
    imageSrc: "trngtrkrlogo512.png"  // Matches your exact file name
  },
  {
    title: "Tryk på ikonet del",
    description: "Tryk på del-ikonet i din browser som vist på billedet",
    imageSrc: "img/img-tutorial-2.png"
  },
  {
    title: "Vælg 'Føj til hjemmeskærm'",
    description: "Find og tryk på 'Føj til hjemmeskærm' i menuen",
    imageSrc: "img/img-tutorial-3.png"
  },
  {
    title: "Tryk på 'Tilføj'",
    description: "Bekræft installationen ved at trykke på 'Tilføj'",
    imageSrc: "img/img-tutorial-4.png"
  },
  {
    title: "Færdig!",
    description: "Nu kan du åbne app'en direkte fra din hjemmeskærm",
    imageSrc: "img/img-tutorial-5.png"
  }
];
// Show the PWA tutorial
function showPWATutorial() {
  // Create styles if they don't exist yet
  createPWATutorialStyles();
  
  let currentStep = 0;
  
  // Create the overlay
  const overlay = document.createElement('div');
  overlay.className = 'tutorial-overlay';
  
  // Create the content container
  const content = document.createElement('div');
  content.className = 'tutorial-content';
  
  // Function to render the current step
  function renderStep() {
    const step = tutorialSteps[currentStep];
    
    content.innerHTML = `
      <button class="close-button">✕</button>
      <div class="tutorial-title">${step.title}</div>
      <div class="tutorial-description">${step.description}</div>
      <img src="${step.imageSrc}" alt="Installation trin ${currentStep + 1}" class="tutorial-image">
      <div class="dots-container">
        ${tutorialSteps.map((_, index) => 
          `<div class="dot ${index === currentStep ? 'active' : ''}"></div>`
        ).join('')}
      </div>
    `;
    
    // Add close button functionality
    const closeButton = content.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      // Instead of saving to localStorage, we'll just close the tutorial
      // localStorage.setItem('pwaTutorialDismissed', 'true');
    });
  }
  
  renderStep();
  overlay.appendChild(content);
  
  // Create navigation buttons
  const navContainer = document.createElement('div');
  navContainer.className = 'tutorial-nav';
  
  const prevButton = document.createElement('button');
  prevButton.className = 'nav-button';
  prevButton.textContent = 'Tilbage';
  prevButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
  prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
      prevButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
      nextButton.textContent = currentStep === tutorialSteps.length - 1 ? 'Færdig' : 'Næste';
    }
  });
  
  const nextButton = document.createElement('button');
  nextButton.className = 'nav-button primary';
  nextButton.textContent = currentStep === tutorialSteps.length - 1 ? 'Færdig' : 'Næste';
  nextButton.addEventListener('click', () => {
    if (currentStep < tutorialSteps.length - 1) {
      currentStep++;
      renderStep();
      prevButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
      nextButton.textContent = currentStep === tutorialSteps.length - 1 ? 'Færdig' : 'Næste';
    } else {
      document.body.removeChild(overlay);
      // Instead of saving to localStorage, we'll just close the tutorial
      // localStorage.setItem('pwaTutorialDismissed', 'true');
    }
  });
  
  navContainer.appendChild(prevButton);
  navContainer.appendChild(nextButton);
  overlay.appendChild(navContainer);
  
  document.body.appendChild(overlay);
}

// Modified PWA check function
function checkAndShowPWATutorial() {
  // Check if it's already installed as a PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone;
                       
  // Only show on iOS Safari since the tutorial is iOS-specific
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  // Removed the localStorage check so it shows every time
  // const hasBeenDismissed = localStorage.getItem('pwaTutorialDismissed') === 'true';
  
  if (!isStandalone && isIOS && isSafari) {
    // Wait a bit to let the page load first
    setTimeout(showPWATutorial, 1500);
  }
}

// Call this function when the page loads
window.addEventListener('load', checkAndShowPWATutorial);

// Call this function when the page loads
window.addEventListener('load', checkAndShowPWATutorial);

// Replace your existing PWA alert check with the new tutorial
// Find this code and replace it:
/*
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (!isStandalone) {
  // Brugeren er i Safari-browseren og ikke i PWA
  alert("Tip: Tilføj siden til din hjemmeskærm for den bedste oplevelse!");
}
*/
// With a call to checkAndShowPWATutorial() instead
/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('✅ Service Worker registered:', registration);
    })
    .catch(error => {
      console.error('❌ Service Worker registration failed:', error);
    });
}
function requestNotificationPermission() {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('🔔 Notifikationer tilladt!');
      subscribeUserToPush(); // Optional: chain subscription here
    } else {
      console.log('❌ Tilladelse nægtet');
    }
  });
}
function subscribeUserToPush() {
  navigator.serviceWorker.ready.then(registration => {
    const vapidPublicKey = '<YOUR_VAPID_PUBLIC_KEY>'; // Generate this
    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    }).then(subscription => {
      console.log('📬 Subscribed:', subscription);
      // TODO: Send subscription to your server
    }).catch(err => {
      console.error('❌ Subscription failed:', err);
    });
  });
}
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}
*/
