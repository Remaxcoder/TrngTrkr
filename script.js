document.addEventListener('DOMContentLoaded', function () {
  // Initialize menu functionality
  initializeMenu();
  
  // Set up Firebase auth listener
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in, update UI
        updateProfileUI(user);
      } else {
        // User is not signed in
        // Check if we have user data in localStorage (from previous session)
        const userName = localStorage.getItem("userName");
        const userPhoto = localStorage.getItem("userPhoto");
        
        if (userName && userPhoto) {
          // We have user data, update UI with it
          updateProfileUI({
            displayName: userName,
            photoURL: userPhoto
          });
        }
      }
    });
  }

  // Menu toggle functionality
  const menuIcon = document.getElementById("menuIcon");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (menuIcon && sideMenu && overlay) {
    menuIcon.addEventListener("click", function() {
      sideMenu.classList.toggle("active");
      overlay.classList.toggle("active");
      menuIcon.classList.toggle("active");
    });
    
    overlay.addEventListener("click", function() {
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
      menuIcon.classList.remove("active");
    });
  }

  // Highlight the active menu item
  highlightActiveMenuItem();
});

// Initialize menu functionality
function initializeMenu() {
  const menuIcon = document.getElementById("menuIcon");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (menuIcon && sideMenu && overlay) {
    menuIcon.addEventListener("click", function() {
      sideMenu.classList.toggle("active");
      overlay.classList.toggle("active");
      menuIcon.classList.toggle("active");
    });
    
    overlay.addEventListener("click", function() {
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
      menuIcon.classList.remove("active");
    });
  }
}

// Highlight active menu item
function highlightActiveMenuItem() {
  const currentPage = window.location.pathname.split("/").pop() || 'index.html';
  const menuLinks = document.querySelectorAll(".menu-nav ul li a");

  menuLinks.forEach(link => {
    const onclickAttr = link.getAttribute("onclick");
    
    if (!onclickAttr) return;
    
    try {
      // Try to safely extract the page from onclick attribute
      const match = onclickAttr.match(/'([^']+)'/);
      if (match && match[1]) {
        const linkPage = match[1];
        if (linkPage === currentPage) {
          link.parentElement.classList.add("active");
        } else {
          link.parentElement.classList.remove("active");
        }
      }
    } catch (error) {
      console.log("Could not highlight menu item", error);
    }
  });
}

// Function to handle login/logout button click
function handleLoginClick() {
  // Check if user is already logged in
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    // User is logged in, show logout confirmation
    if (confirm("Vil du logge ud?")) {
      firebase.auth().signOut().then(() => {
        // Clear user data
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
        // Update UI
        document.getElementById("profileName").innerHTML = '<a href="#" onclick="handleLoginClick()" class="login-link">Log in</a>';
        document.getElementById("profileAvatar").style.backgroundImage = '';
        document.getElementById("profileAvatar").style.backgroundColor = '';
      }).catch(error => {
        console.error("Logout fejlede:", error);
      });
    }
  } else {
    // User is not logged in, redirect to login page
    window.location.href = 'login.html';
  }
}

// Function to update profile UI with user data
function updateProfileUI(user) {
  if (!user) return;
  
  const profileName = document.getElementById("profileName");
  const profileAvatar = document.getElementById("profileAvatar");
  
  if (profileName) {
    profileName.innerHTML = user.displayName || 'User';
  }
  
  if (profileAvatar) {
    if (user.photoURL) {
      profileAvatar.style.backgroundImage = `url(${user.photoURL})`;
      profileAvatar.style.backgroundSize = 'cover';
      profileAvatar.style.backgroundPosition = 'center';
      profileAvatar.style.backgroundColor = 'transparent';
    } else {
      // If no photo URL, show first letter of name as avatar
      const firstLetter = (user.displayName || 'U').charAt(0).toUpperCase();
      profileAvatar.style.backgroundImage = 'none';
      profileAvatar.style.backgroundColor = '#0071e3';
      profileAvatar.innerHTML = `<span style="color: white; font-size: 32px;">${firstLetter}</span>`;
      profileAvatar.style.display = 'flex';
      profileAvatar.style.justifyContent = 'center';
      profileAvatar.style.alignItems = 'center';
    }
  }
}

// Cirkeldiagram (armstørrelse)
const ctxCircle = document.getElementById('circleChart');
if (ctxCircle) {
  const circleChart = new Chart(ctxCircle.getContext('2d'), {
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
}

// Set up charts when available
function initializeCharts() {
  // kg (uge)
  const kgWeek = document.getElementById('kgWeek');
  if (kgWeek) {
    new Chart(kgWeek.getContext('2d'), {
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
  }

  // cm (uge)
  const cmWeek = document.getElementById('cmWeek');
  if (cmWeek) {
    new Chart(cmWeek.getContext('2d'), {
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
  }

  // kg (måned)
  const kgMonth = document.getElementById('kgMonth');
  if (kgMonth) {
    new Chart(kgMonth.getContext('2d'), {
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
  }

  // cm (måned)
  const cmMonth = document.getElementById('cmMonth');
  if (cmMonth) {
    new Chart(cmMonth.getContext('2d'), {
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
  }
}

// Initialize charts after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeCharts();
});

function navigateTo(page) {
  window.location.assign(page); // Dette bevarer PWA-mode bedre end nogle andre metoder
}

// Register service worker if available
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

// Menu functionality
function initializeMenu() {
  const burgerMenu = document.getElementById("burgerMenu");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (burgerMenu && sideMenu && overlay) {
    burgerMenu.addEventListener("click", function() {
      sideMenu.classList.toggle("active");
      overlay.classList.toggle("active");
      burgerMenu.classList.toggle("active");
    });
    
    overlay.addEventListener("click", function() {
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
      burgerMenu.classList.remove("active");
    });
  }
}

// Highlight active menu item
function highlightActiveMenuItem() {
  const currentPage = window.location.pathname.split("/").pop();
  const menuLinks = document.querySelectorAll(".side-menu nav ul li a");

  menuLinks.forEach(link => {
    const linkPage = link.getAttribute("onclick").match(/'([^']+)'/)[1];
    if (linkPage === currentPage) {
      link.parentElement.classList.add("active");
    } else {
      link.parentElement.classList.remove("active");
    }
  });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  initializeMenu();
  highlightActiveMenuItem();
  
  // Initialize Firebase first if not already initialized
  if (typeof firebase === 'undefined') {
    // If firebaseConfig is not defined in this file, we need to define it
    // This would typically be in a separate script or at the top of this file
    // Attempt to load Firebase from window if it's defined elsewhere
    if (window.firebaseConfig) {
      firebase.initializeApp(window.firebaseConfig);
    } else {
      console.error('Firebase configuration not found');
      return;
    }
  } else if (firebase.apps.length === 0) {
    // Firebase is loaded but not initialized
    if (window.firebaseConfig) {
      firebase.initializeApp(window.firebaseConfig);
    } else {
      console.error('Firebase configuration not found');
      return;
    }
  }
  
  // Handle redirect result for users coming back from auth redirect
  if (firebase.auth) {
    firebase.auth().getRedirectResult().then(result => {
      if (result.user) {
        // User successfully logged in after redirect
        const user = result.user;
        localStorage.setItem("userName", user.displayName);
        localStorage.setItem("userPhoto", user.photoURL);
        console.log("Redirect login successful:", user.displayName);
        
        // Clear the auth redirect flag
        sessionStorage.removeItem('authRedirectInProgress');
        
        // Update UI
        updateProfileUI(user);
      }
    }).catch(error => {
      console.error("Redirect login failed:", error);
      // Clear the redirect flag on error
      sessionStorage.removeItem('authRedirectInProgress');
    });
  
    // Set up Firebase auth listener to consistently check auth state
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in, update UI
        updateProfileUI(user);
      } else {
        // User is not signed in
        // Check if we have user data in localStorage (from previous session)
        const userName = localStorage.getItem("userName");
        const userPhoto = localStorage.getItem("userPhoto");
        
        if (userName && userPhoto) {
          // We have user data, update UI with it
          updateProfileUI({
            displayName: userName,
            photoURL: userPhoto
          });
        }
      }
    });
  }
});
function loginWithGoogle() {
  // Ensure Firebase is initialized
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.error('Firebase is not initialized');
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  
  // Always use redirect method for better mobile PWA compatibility
  console.log('Using redirect auth flow for better PWA compatibility...');
  
  // Store a flag to identify we're coming from a login flow
  sessionStorage.setItem('authRedirectInProgress', 'true');
  
  // Use redirect method for all devices
  firebase.auth().signInWithRedirect(provider)
    .catch(error => {
      console.error("Login redirect setup failed:", error);
      sessionStorage.removeItem('authRedirectInProgress');
    });
}

function handleLoginClick() {
  // Ensure Firebase is initialized
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.error('Firebase is not initialized');
    return;
  }

  // Use onAuthStateChanged to reliably check login state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in, show logout confirmation
      if (confirm("Vil du logge ud?")) {
        firebase.auth().signOut().then(() => {
          // Clear user data
          localStorage.removeItem("userName");
          localStorage.removeItem("userPhoto");
          // Update UI
          const profileName = document.getElementById("profileName");
          const profileAvatar = document.getElementById("profileAvatar");
          
          if (profileName) {
            profileName.innerHTML = '<a href="#" onclick="handleLoginClick()">Log in</a>';
          }
          
          if (profileAvatar) {
            profileAvatar.style.backgroundImage = '';
          }
        }).catch(error => {
          console.error("Logout fejlede:", error);
        });
      }
    } else {
      // User is not logged in, redirect to login page
      window.location.href = 'login.html';
    }
  });
}

function updateProfileUI(user) {
  if (user) {
    // User is logged in, update profile UI
    const profileName = document.getElementById("profileName");
    const profileAvatar = document.getElementById("profileAvatar");
    
    if (profileName) {
      profileName.textContent = user.displayName;
    }
    
    if (profileAvatar && user.photoURL) {
      profileAvatar.style.backgroundImage = `url(${user.photoURL})`;
      profileAvatar.style.backgroundSize = 'cover';
      profileAvatar.style.backgroundPosition = 'center';
    }
  }
}
