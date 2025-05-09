document.addEventListener('DOMContentLoaded', function() {
  // Burger menu functionality (reusing from main script)
  document.getElementById('burgerMenu').addEventListener('click', function() {
    document.getElementById('sideMenu').classList.toggle('active');
  });

  // Form navigation
  const sections = document.querySelectorAll('.form-section');
  const totalSections = sections.length;
  let currentSection = 0;
  
  const progressBar = document.getElementById('progressBar');
  const currentSectionSpan = document.getElementById('currentSection');
  const totalSectionsSpan = document.getElementById('totalSections');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  // Initialize
  totalSectionsSpan.textContent = totalSections;
  updateView();
  
  // Event listeners for navigation buttons
  prevBtn.addEventListener('click', goToPrevSection);
  nextBtn.addEventListener('click', goToNextSection);
  submitBtn.addEventListener('click', submitForm);
  
  // Section navigation functions
  function updateView() {
    // Hide all sections
    sections.forEach((section, index) => {
      section.classList.remove('active');
    });
    
    // Show current section
    sections[currentSection].classList.add('active');
    
    // Update progress bar
    const progressPercentage = ((currentSection + 1) / totalSections) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    currentSectionSpan.textContent = currentSection + 1;
    
    // Update button visibility
    prevBtn.style.visibility = currentSection === 0 ? 'hidden' : 'visible';
    
    if (currentSection === totalSections - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'block';
    } else {
      nextBtn.style.display = 'block';
      submitBtn.style.display = 'none';
    }
    
    // Scroll to top of the form
    window.scrollTo({
      top: document.querySelector('.container').offsetTop,
      behavior: 'smooth'
    });
  }
  
  function goToPrevSection() {
    if (currentSection > 0) {
      currentSection--;
      updateView();
    }
  }
  
  function goToNextSection() {
    if (currentSection < totalSections - 1) {
      // Here you could add validation for required fields before proceeding
      // For example: if (validateCurrentSection()) { ... }
      
      currentSection++;
      updateView();
      
      // Add fancy transition effect
      sections[currentSection].style.opacity = 0;
      setTimeout(() => {
        sections[currentSection].style.opacity = 1;
      }, 50);
    }
  }
  
  function submitForm() {
    // Get all form data and validate
    const formData = collectFormData();
    
    if (validateFormData(formData)) {
      // Here you would typically send the data to your server
      // For now, let's simulate a submission process
      
      const submitBtn = document.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Gemmer...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        // Simulating server response delay
        console.log('Form data:', formData);
        
        // Store the data in localStorage
        localStorage.setItem('fitnessProfile', JSON.stringify(formData));
        
        // Show success message
        alert('Din profil er blevet gemt!');
        
        // Redirect to home page
        window.location.href = 'maal.html';
      }, 1500);
    }
  }
  
  // Helper functions
  function collectFormData() {
    const form = document.getElementById('fitnessForm');
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
    // Add your validation logic here
    // This is a simple example, you might want to expand it
    
    const requiredFields = ['age', 'height', 'weight'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Udfyld venligst alle obligatoriske felter i sektion 1.`);
        // Go back to the first section if validation fails
        currentSection = 0;
        updateView();
        return false;
      }
    }
    
    return true;
  }
  
  // Add visual feedback for input fields
  const allInputs = document.querySelectorAll('.form-input');
  
  allInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });
  
  // Add animated transitions for form elements
  document.querySelectorAll('.form-group').forEach((group, index) => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      group.style.transition = 'all 0.3s ease';
      group.style.opacity = '1';
      group.style.transform = 'translateY(0)';
    }, 100 + (index * 50));
  });
  
  // Add touch swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 100) {
      // Swiped left, go to next section
      if (currentSection < totalSections - 1) {
        goToNextSection();
      }
    }
    
    if (touchEndX > touchStartX + 100) {
      // Swiped right, go to previous section
      if (currentSection > 0) {
        goToPrevSection();
      }
    }
  }
});