// Menu functionality
class Menu {
  constructor() {
    this.menuIcon = document.getElementById('menuIcon');
    this.sideMenu = document.getElementById('sideMenu');
    this.overlay = document.getElementById('overlay');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (!this.menuIcon || !this.sideMenu || !this.overlay) {
      console.error('Menu elements not found');
      return;
    }
    
    // Add click event listeners
    this.menuIcon.addEventListener('click', () => this.toggle());
    this.overlay.addEventListener('click', () => this.close());
    
    // Highlight active menu item
    this.highlightActiveItem();
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.menuIcon.classList.add('active');
    this.sideMenu.classList.add('active');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.isOpen = false;
    this.menuIcon.classList.remove('active');
    this.sideMenu.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  highlightActiveItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = this.sideMenu.querySelectorAll('.menu-nav li');
    
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      const linkPage = link.getAttribute('onclick').match(/'([^']+)'/)[1];
      
      if (linkPage === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Menu();
}); 
// This is a separate menu.js file to handle menu functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize menu functionality
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

  // Check if Firebase auth is available and set up user profile
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in, update UI with their info
        updateProfileUI(user);
      } else {
        // User is not signed in, check localStorage for stored data
        const userName = localStorage.getItem("userName");
        const userPhoto = localStorage.getItem("userPhoto");
        
        if (userName && userPhoto) {
          // We have user data in localStorage, use it
          updateProfileUI({
            displayName: userName,
            photoURL: userPhoto
          });
        } else {
          // No user data, show login link
          const profileName = document.getElementById("profileName");
          if (profileName) {
            profileName.innerHTML = '<a href="#" onclick="handleLoginClick()" class="login-link">Log in</a>';
          }
        }
      }
    });
  }
});

// Function to handle login/logout click
function handleLoginClick() {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    // Firebase not available, just redirect to login page
    window.location.href = 'login.html';
    return;
  }
  
  // Check if user is already logged in
  const currentUser = firebase.auth().currentUser;
  
  if (currentUser) {
    // User is logged in, show logout confirmation
    if (confirm("Vil du logge ud?")) {
      firebase.auth().signOut().then(() => {
        // Clear stored user data
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
        
        // Update UI to show login link
        const profileName = document.getElementById("profileName");
        const profileAvatar = document.getElementById("profileAvatar");
        
        if (profileName) {
          profileName.innerHTML = '<a href="#" onclick="handleLoginClick()" class="login-link">Log in</a>';
        }
        
        if (profileAvatar) {
          profileAvatar.style.backgroundImage = '';
          profileAvatar.innerHTML = '';
          profileAvatar.style.backgroundColor = '';
        }
        
        console.log("User logged out successfully");
      }).catch(error => {
        console.error("Logout error:", error);
      });
    }
  } else {
    // User is not logged in, redirect to login page
    window.location.href = 'login.html';
  }
}

// Function to update profile UI with user info
function updateProfileUI(user) {
  if (!user) return;
  
  const profileName = document.getElementById("profileName");
  const profileAvatar = document.getElementById("profileAvatar");
  
  if (profileName) {
    // Set the user's name in the profile area
    profileName.innerHTML = user.displayName || 'User';
  }
  
  if (profileAvatar) {
    if (user.photoURL) {
      // Set the user's photo as background image
      profileAvatar.style.backgroundImage = `url(${user.photoURL})`;
      profileAvatar.style.backgroundSize = 'cover';
      profileAvatar.style.backgroundPosition = 'center';
      profileAvatar.innerHTML = ''; // Clear any content
    } else {
      // If no photo URL is available, show first letter of name
      const firstLetter = (user.displayName || 'U').charAt(0).toUpperCase();
      profileAvatar.style.backgroundImage = 'none';
      profileAvatar.style.backgroundColor = '#0071e3';
      profileAvatar.innerHTML = `<span style="color: white; font-size: 32px;">${firstLetter}</span>`;
      profileAvatar.style.display = 'flex';
      profileAvatar.style.justifyContent = 'center';
      profileAvatar.style.alignItems = 'center';
    }
  }
  
  console.log("Profile UI updated for user:", user.displayName || 'Unknown');
}