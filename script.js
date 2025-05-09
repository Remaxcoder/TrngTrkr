// Cirkeldiagram (armstørrelse)
const ctxCircle = document.getElementById('circleChart').getContext('2d');
new Chart(ctxCircle, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [90, 10], // fx 90% nuværende, 10% mangler til mål
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
document.getElementById('burgerMenu').addEventListener('click', function() {
  document.getElementById('sideMenu').classList.toggle('active');
});
document.getElementById('fitnessForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Collect form data
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  // Process data (e.g., send to server or store locally)
  console.log(data);
  alert('Tak for dine oplysninger!');
});


