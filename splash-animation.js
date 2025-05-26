// This function handles the splash screen animation
function showSplashAnimation() {
  const splashScreen = document.getElementById('splashScreen');
  
  if (splashScreen) {
    // Make splash screen visible
    splashScreen.style.display = 'flex';
    
    // Start the animations by adding classes to elements
    setTimeout(() => {
      document.querySelector('.trng-text').classList.add('animate-trng');
    }, 100);
    
    setTimeout(() => {
      document.querySelector('.left-arm').classList.add('animate-left-arm');
    }, 100);
    
    setTimeout(() => {
      document.querySelector('.right-arm').classList.add('animate-right-arm');
    }, 100);
    
    setTimeout(() => {
      document.querySelector('.trkr-text').classList.add('animate-trkr');
    }, 100);
    
    // Add the exit animation classes to the splash screen and logo container
    setTimeout(() => {
      splashScreen.classList.add('splash-exit');
      document.querySelector('.logo-container').classList.add('exit-up');
    }, 100);
    
    // Hide splash screen after animations complete
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 3200); // Match total animation duration (2.7s delay + 0.5s fadeOut)
  }
}

// This variable helps track if the PWA has been shown in the current browser session
let appHasBeenShownInSession = false;

document.addEventListener('DOMContentLoaded', function() {
  // Get sessionStorage value (null if first load in this browser session)
  const appShownInSession = sessionStorage.getItem('appShownInSession');
  
  // Get localStorage value (null if first time ever or reinstalled)
  const appPreviouslyOpened = localStorage.getItem('appPreviouslyOpened');
  
  // Check if this is the first time the app is opened
  const isFirstTimeEver = !appPreviouslyOpened;
  
  // Check if this is a fresh launch (not from background)
  const isFreshLaunch = !appShownInSession;
  
  // Mark that the app has been shown in this session
  sessionStorage.setItem('appShownInSession', 'true');
  appHasBeenShownInSession = true;
  
  // If first time ever OR (first time in this session AND PWA support detected)
  if (isFirstTimeEver && isFreshLaunch) {
    // Mark that the app has been opened before (for future launches)
    localStorage.setItem('appPreviouslyOpened', 'true');
    
    // Show the splash animation
    showSplashAnimation();
  }
});

// Handle visibility changes (app going to background/foreground)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    // App is becoming visible again (from background)
    // We don't show the animation here as this is a resume, not a fresh launch
  } else {
    // App is going to background
    // No action needed
  }
});

// For testing: Reset the first-time flag (comment out in production)
// function resetAnimationFlags() {
//   localStorage.removeItem('appPreviouslyOpened');
//   sessionStorage.removeItem('appShownInSession');
//   console.log('Animation flags reset. Refresh to see animation again.');
// }
