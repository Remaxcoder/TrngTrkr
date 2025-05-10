document.addEventListener('DOMContentLoaded', function() {
  // Menu toggle functionality
  const burgerMenu = document.getElementById("burgerMenu");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  burgerMenu.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);

  function toggleMenu() {
    sideMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    
    // Toggle menu icon animation if needed
    // Add animation code here if desired
  }

  // Load and display fitness profile data
  loadProfileData();
});

function loadProfileData() {
  // Get the container where we'll put our data
  const container = document.getElementById("maalContainer");
  
  // Try to retrieve fitness profile from localStorage
  let profile;
  try {
    profile = JSON.parse(localStorage.getItem("fitnessProfile"));
  } catch (e) {
    console.error("Error parsing fitness profile:", e);
  }

  // If no data found or error in parsing
  if (!profile) {
    container.innerHTML = `
      <div class="card" style="--index: 0">
        <div class="card-title"><span class="icon">ℹ️</span>Ingen data</div>
        <div class="card-content">
          <p>Ingen data fundet. Gå tilbage og udfyld spørgeskemaet.</p>
        </div>
      </div>
    `;
    return;
  }

  // Group data into logical categories for display
  const categories = {
    "Personlig Information": {
      icon: "👤",
      fields: ["age", "height", "weight", "gender", "occupation"]
    },
    "Hvad Jeg Kan Nu": {
      icon: "💪",
      fields: [
        "benchWeight", "benchReps",
        "deadliftWeight", "deadliftReps",
        "squatWeight", "squatReps",
        "shoulderWeight", "shoulderReps",
        "pullups",
        "curlsWeight", "curlsReps",
        "rowsWeight", "rowsReps"
      ]
    },
    "Mine Mål": {
      icon: "🎯",
      fields: [
        "benchGoal",
        "deadliftGoal",
        "squatGoal",
        "shoulderGoal",
        "pullupGoal"
      ]
    },
    "Trænings Rutine": {
      icon: "🏋️",
      fields: ["trainFrequency", "sessionLength", "trainingSplit", "progressiveOverload", "trainingGoal"]
    },
    "Helbred & Livsstil": {
      icon: "🥗",
      fields: ["diet", "supplements", "moreSupplements", "sleep", "stress", "injuries", "activeOutside", "cardio"]
    },
    "Andre Trænings Detaljer": {
      icon: "📋",
      fields: ["deadline", "approach", "focus", "otherExercises", "otherGoals"]
    },
    "Ressourcer": {
      icon: "🔧",
      fields: ["gymAccess", "hasCoach"]
    }
  };

  // Display name mapping to make field names more readable
  const displayNames = {
    // Personal info
    "age": "Alder",
    "height": "Højde",
    "weight": "Vægt",
    "gender": "Køn",
    "occupation": "Beskæftigelse",
    
    // Strength goals
    "benchWeight": "Bænkpres vægt",
    "benchReps": "Bænkpres gentagelser",
    "benchGoal": "Bænkpres mål",
    "deadliftWeight": "Dødløft vægt",
    "deadliftReps": "Dødløft gentagelser",
    "deadliftGoal": "Dødløft mål",
    "squatWeight": "Squat vægt",
    "squatReps": "Squat gentagelser",
    "squatGoal": "Squat mål",
    "shoulderWeight": "Skulder vægt",
    "shoulderReps": "Skulder gentagelser",
    "shoulderGoal": "Skulder mål",
    "pullups": "Pull-ups",
    "pullupGoal": "Pull-ups mål",
    "curlsWeight": "Biceps curls vægt",
    "curlsReps": "Biceps curls gentagelser",
    "rowsWeight": "Rows vægt",
    "rowsReps": "Rows gentagelser",
    
    // Training routine
    "trainFrequency": "Træningsfrekvens",
    "sessionLength": "Træningssession længde",
    "trainingSplit": "Træningssplit",
    "progressiveOverload": "Progressiv overbelastning",
    "trainingGoal": "Træningsmål",
    
    // Health & lifestyle
    "diet": "Kost",
    "supplements": "Tilskud",
    "moreSupplements": "Andre tilskud",
    "sleep": "Søvn",
    "stress": "Stress niveau",
    "injuries": "Skader",
    "activeOutside": "Aktiv udenfor træning",
    "cardio": "Kardio",
    
    // Other goals
    "deadline": "Deadline",
    "approach": "Tilgang",
    "focus": "Fokusområde",
    "otherExercises": "Andre øvelser",
    "otherGoals": "Andre mål",
    
    // Resources
    "gymAccess": "Adgang til fitnesscenter",
    "hasCoach": "Har træner"
  };

  // Generate HTML for each category
  let html = '';
  let index = 0;
  
  Object.entries(categories).forEach(([categoryName, category]) => {
    // Check if this category has any data
    const hasData = category.fields.some(field => profile[field]);
    
    if (hasData) {
      let cardContent = '';
      
      category.fields.forEach(field => {
        if (profile[field]) {
          const displayName = displayNames[field] || field;
          cardContent += `
            <div class="data-item">
              <span class="data-label">${displayName}</span>
              <span class="data-value">${profile[field]}</span>
            </div>
          `;
        }
      });
      
      // Add specific classes for current stats and goals cards
      let cardClass = '';
      if (categoryName === "Hvad Jeg Kan Nu") {
        cardClass = 'current-stats';
      } else if (categoryName === "Mine Mål") {
        cardClass = 'goals';
      }
      
      html += `
        <div class="card ${cardClass}" style="--index: ${index}">
          <div class="card-title"><span class="icon">${category.icon}</span>${categoryName}</div>
          <div class="card-content">
            ${cardContent}
          </div>
        </div>
      `;
      
      index++;
    }
  });
  
  // Insert the generated HTML into the container
  container.innerHTML = html;
}

function navigateTo(page) {
  window.location.assign(page); // Dette bevarer PWA-mode bedre end nogle andre metoder
}