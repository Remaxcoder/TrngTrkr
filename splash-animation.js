/**
 * PWA Splash Screen Animation
 * This implements a reliable splash screen that shows on first launch
 * and any time the app is completely closed and reopened.
 */

// Function to start the animation sequence
function startSplashAnimation() {
  // Get elements
  const splashScreen = document.getElementById('splashScreen');
  if (!splashScreen) return;
  
  // Make sure it's visible
  splashScreen.style.display = 'flex';
  
  // Trigger all animations immediately to prevent flash
  requestAnimationFrame(() => {
    // Add animation classes to each logo part
    document.querySelector('.trng-text').classList.add('animate-trng');
    document.querySelector('.left-arm').classList.add('animate-left-arm');
    document.querySelector('.right-arm').classList.add('animate-right-arm');
    document.querySelector('.trkr-text').classList.add('animate-trkr');
    
    // Add exit animations
    setTimeout(() => {
      splashScreen.classList.add('splash-exit');
      document.querySelector('.logo-container').classList.add('exit-up');
    }, 100);
    
    // Hide splash screen after animations complete
    setTimeout(() => {
      splashScreen.style.display = 'none';
      // Clear animation classes so it can run again on next launch
      clearAnimationClasses();
    }, 3200);
  });
}

// Function to clear animation classes so they can be reapplied on next launch
function clearAnimationClasses() {
  document.querySelector('.trng-text').classList.remove('animate-trng');
  document.querySelector('.left-arm').classList.remove('animate-left-arm');
  document.querySelector('.right-arm').classList.remove('animate-right-arm');
  document.querySelector('.trkr-text').classList.remove('animate-trkr');
  document.querySelector('.logo-container').classList.remove('exit-up');
  document.getElementById('splashScreen').classList.remove('splash-exit');
}

// Function to hide splash screen immediately
function hideSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  if (splashScreen) {
    splashScreen.style.display = 'none';
    clearAnimationClasses();
  }
}

// The simple approach: ALWAYS show splash screen unless explicitly hidden in session storage
function shouldShowSplashScreen() {
  // Check if we've already shown the splash in this session
  return sessionStorage.getItem('splashShownInSession') !== 'true';
}

// Main execution logic
document.addEventListener('DOMContentLoaded', function() {
  if (shouldShowSplashScreen()) {
    // Mark that we've shown the splash in this session
    sessionStorage.setItem('splashShownInSession', 'true');
    
    // Run the animation
    startSplashAnimation();
  } else {
    // Hide splash screen immediately if we shouldn't show it
    hideSplashScreen();
  }
});

// Force hide splash if app becomes visible after being in background a long time
// This prevents issues with the splash screen showing inappropriately
let pageLoadTime = Date.now();
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    // If coming back after more than 5 seconds, ensure splash is hidden
    if (Date.now() - pageLoadTime > 5000) {
      hideSplashScreen();
    }
  }
});

// Testing function (can be called from browser console)
function resetSplashScreen() {
  sessionStorage.removeItem('splashShownInSession');
  clearAnimationClasses();
  console.log('Splash screen reset. Refresh page to see animation again.');
}
