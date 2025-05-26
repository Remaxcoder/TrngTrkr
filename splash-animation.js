// The splash screen is already visible in the HTML (display: flex)
// This script just needs to handle the animations and when to hide it

// Get timestamp when page was loaded - used to detect fresh launches vs refreshes
const pageLoadTime = Date.now();

// Function to start the splash screen animation sequence
function startSplashAnimation() {
  // Get splash screen element
  const splashScreen = document.getElementById('splashScreen');
  if (!splashScreen) return;
  
  // Make sure splash screen is visible
  splashScreen.style.display = 'flex';
  
  // Start the animations by adding classes to elements - all at once to avoid delays
  document.querySelector('.trng-text').classList.add('animate-trng');
  document.querySelector('.left-arm').classList.add('animate-left-arm');
  document.querySelector('.right-arm').classList.add('animate-right-arm');
  document.querySelector('.trkr-text').classList.add('animate-trkr');
  
  // Add the exit animations
  setTimeout(() => {
    splashScreen.classList.add('splash-exit');
    document.querySelector('.logo-container').classList.add('exit-up');
  }, 100);
  
  // Hide splash screen after animations complete
  setTimeout(() => {
    splashScreen.style.display = 'none';
  }, 3200); // Match total animation duration (2.7s delay + 0.5s fadeOut)
}

// Function to hide splash screen immediately (used when we shouldn't show it)
function hideSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  if (splashScreen) {
    splashScreen.style.display = 'none';
  }
}

// Function to check if we should show the animation
function shouldShowAnimation() {
  // Use a timestamp approach to detect fresh launches
  const lastOpenTimestamp = localStorage.getItem('pwaLastOpenTimestamp');
  const currentTime = Date.now();
  
  // If no timestamp or it's been more than 30 minutes, consider it a fresh launch
  const isFreshLaunch = !lastOpenTimestamp || (currentTime - parseInt(lastOpenTimestamp) > 30 * 60 * 1000);
  
  // Update the timestamp
  localStorage.setItem('pwaLastOpenTimestamp', currentTime.toString());
  
  // Check if this is the first time ever
  const isFirstTimeEver = !localStorage.getItem('pwaFirstOpenComplete');
  if (isFirstTimeEver) {
    localStorage.setItem('pwaFirstOpenComplete', 'true');
    return true; // Always show animation on first time ever
  }
  
  // For subsequent launches, only show if it's a fresh launch
  return isFreshLaunch;
}

// Main execution starts here - when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we should show the animation
  if (shouldShowAnimation()) {
    // Start the animation
    startSplashAnimation();
  } else {
    // Hide the splash screen immediately
    hideSplashScreen();
  }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    // Page becoming visible again - hide splash if it's been more than 5 seconds since load
    // This handles the case when the page is refreshed or restored from back/forward cache
    if (Date.now() - pageLoadTime > 5000) {
      hideSplashScreen();
    }
  }
});

// For testing: This function can be called from console to reset the animation state
function resetSplashAnimation() {
  localStorage.removeItem('pwaFirstOpenComplete');
  localStorage.removeItem('pwaLastOpenTimestamp');
  console.log('Animation flags reset. Close the app completely and reopen to see animation.');
}
