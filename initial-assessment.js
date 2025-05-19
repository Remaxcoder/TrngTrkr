document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('initialAssessmentForm');
  const sections = document.querySelectorAll('.form-section');
  const progressBar = document.getElementById('progressBar');
  
  let currentSection = 0;
  const totalSections = sections.length;
  
  // Function to update progress bar
  function updateProgress() {
    const progress = ((currentSection + 1) / totalSections) * 100;
    progressBar.style.width = `${progress}%`;
  }
  
  // Function to show a specific section
  function showSection(index) {
    sections.forEach((section, i) => {
      section.classList.toggle('active', i === index);
    });
    currentSection = index;
    updateProgress();
  }
  
  // Get current week number
  function getCurrentWeek() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
    return weekNumber;
  }

  // Helper functions from questionnaire.js
  function collectFormData() {
    const form = document.getElementById('initialAssessmentForm');
    const formData = {};
    
    // Get all inputs, selects and textareas
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.type === 'radio') {
        if (input.checked) {
          formData[input.name] = input.value;
        }
      } else if (input.type === 'checkbox') {
        formData[input.id] = input.checked;
      } else {
        formData[input.id] = input.value;
      }
    });
    
    return formData;
  }
  
  function validateFormData(formData) {
    const requiredFields = ['weight', 'benchWeight', 'curlsWeight', 'deadliftWeight', 'pullups', 'rowsWeight', 'shoulderWeight', 'squatWeight'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Udfyld venligst alle obligatoriske felter.`);
        currentSection = 0;
        showSection(0);
        return false;
      }
    }
    
    return true;
  }

  function submitForm() {
    const formData = collectFormData();
      
    if (validateFormData(formData)) {
      const submitBtn = document.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
        
      submitBtn.textContent = 'Gemmer...';
      submitBtn.disabled = true;
        
      setTimeout(() => {
        // Get current week number
        const currentWeek = getCurrentWeek();
        const weekKey = `week${currentWeek}`;
        
        // Save the data for this week
        localStorage.setItem(weekKey, JSON.stringify(formData));
        
        // Also save individual fields for backward compatibility
        Object.entries(formData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        
        // Save the last completed week
        localStorage.setItem('lastCompletedWeek', currentWeek);
        
        // Mark questionnaire as completed for this week
        localStorage.setItem('lastQuestionnaireCompletion', new Date().toISOString());
        
        // Show success message
        alert('Din profil er blevet gemt!');
          
        // Redirect to home page
        window.location.href = 'index.html';
      }, 1500);
    }
  }
  
  // Load any existing values from localStorage
  const fields = [
    'weight',
    'benchWeight',
    'curlsWeight',
    'deadliftWeight',
    'pullups',
    'rowsWeight',
    'shoulderWeight',
    'squatWeight'
  ];

  fields.forEach(field => {
    const savedValue = localStorage.getItem(field);
    if (savedValue) {
      const input = document.getElementById(field);
      if (input) {
        input.value = savedValue;
      }
    }
  });

  // Handle next section buttons
  document.querySelectorAll('.next-section').forEach(button => {
    button.addEventListener('click', () => {
      if (currentSection < totalSections - 1) {
        showSection(currentSection + 1);
      }
    });
  });

  // Handle previous section buttons
  document.querySelectorAll('.prev-section').forEach(button => {
    button.addEventListener('click', () => {
      if (currentSection > 0) {
        showSection(currentSection - 1);
      }
    });
  });

  // Add submit button event listener
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.addEventListener('click', submitForm);

  // Initialize progress bar
  updateProgress();
}); 