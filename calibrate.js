// calibrate.js - Redesigned for better functionality and UX

// Status indicators
let gpsStatus = false;
let accStatus = false;

// Calibration state
let currentStepType = "normal";
let positions = [];
let accData = [];
let startTime = null;
let calibrationActive = false;
let stepCounter = 10;
let watchId = null;

// DOM elements
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const stepTypeSelect = document.getElementById("stepType");
const stepCountElement = document.getElementById("stepCount");
const resultPanel = document.getElementById("result");
const gpsStatusDot = document.querySelector("#gpsStatus .status-dot");
const accStatusDot = document.querySelector("#accStatus .status-dot");

// Step counts per type
const stepTypes = {
  normal: 10,
  long: 10,
  run: 10
};

// Initialize
function init() {
  // Hook up UI event handlers
  startBtn.addEventListener("click", startCalibration);
  stopBtn.addEventListener("click", stopCalibration);
  
  // Update step type when selected
  stepTypeSelect.addEventListener("change", () => {
    currentStepType = stepTypeSelect.value;
    startBtn.dataset.stepType = currentStepType;
    stepCounter = stepTypes[currentStepType];
    stepCountElement.textContent = stepCounter;
  });
  
  // Check capabilities
  checkDeviceCapabilities();
}

// Check what sensors are available
function checkDeviceCapabilities() {
  // Check if geolocation is available
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      () => {
        gpsStatus = true;
        gpsStatusDot.classList.remove("offline");
        gpsStatusDot.classList.add("online");
      },
      () => {
        gpsStatus = false;
        gpsStatusDot.classList.remove("online");
        gpsStatusDot.classList.add("offline");
      }
    );
  }
  
  // Check if accelerometer is available
  if (window.DeviceMotionEvent) {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS requires permission request
      accStatusDot.classList.remove("online");
      accStatusDot.classList.add("offline");
    } else {
      // For other browsers that support DeviceMotionEvent
      accStatus = true;
      accStatusDot.classList.remove("offline");
      accStatusDot.classList.add("online");
    }
  }
}

// Start calibration process
function startCalibration() {
  // Update UI
  document.querySelector(".card").classList.add("measuring");
  startBtn.disabled = true;
  stopBtn.disabled = false;
  
  // Reset data
  currentStepType = stepTypeSelect.value;
  positions = [];
  accData = [];
  stepCounter = stepTypes[currentStepType];
  stepCountElement.textContent = stepCounter;
  resultPanel.innerHTML = "";
  startTime = Date.now();
  calibrationActive = true;
  
  // Start accelerometer
  startAccelerometer();
  
  // Start GPS tracking
  startGPS();
  
  // Show feedback
  showToast("Kalibrering startet");
}

// Start accelerometer monitoring
function startAccelerometer() {
  if (window.DeviceMotionEvent) {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS requires permission
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
            accStatus = true;
            accStatusDot.classList.remove("offline");
            accStatusDot.classList.add("online");
          } else {
            showToast("Adgang til accelerometer nægtet");
            accStatus = false;
          }
        })
        .catch(error => {
          console.error("Accelerometer permission error:", error);
          showToast("Fejl med accelerometer adgang");
        });
    } else {
      // For non-iOS browsers
      window.addEventListener('devicemotion', handleMotion);
    }
  } else {
    showToast("Accelerometer ikke tilgængelig");
  }
}

// Start GPS tracking
function startGPS() {
  if ("geolocation" in navigator) {
    watchId = navigator.geolocation.watchPosition(
      position => {
        gpsStatus = true;
        gpsStatusDot.classList.remove("offline");
        gpsStatusDot.classList.add("online");
        
        // Save position data
        positions.push({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy
        });
      },
      error => {
        console.error("GPS error:", error);
        gpsStatus = false;
        gpsStatusDot.classList.remove("online");
        gpsStatusDot.classList.add("offline");
        showToast("GPS-fejl: " + error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  } else {
    showToast("GPS ikke tilgængelig");
  }
}

// Handle accelerometer data
function handleMotion(event) {
  if (!calibrationActive) return;
  
  const acc = event.accelerationIncludingGravity;
  if (acc && acc.x !== null) {
    accData.push({
      x: acc.x,
      y: acc.y,
      z: acc.z,
      timestamp: Date.now()
    });
  }
}

// Stop calibration and calculate results
function stopCalibration() {
  calibrationActive = false;
  document.querySelector(".card").classList.remove("measuring");
  startBtn.disabled = false;
  stopBtn.disabled = true;
  
  // Clean up event listeners
  window.removeEventListener('devicemotion', handleMotion);
  
  // Stop GPS tracking
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  
  // Calculate results
  const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
  const distance = calculateDistance(positions);
  const avgStepLength = distance / stepTypes[currentStepType];
  
  // Calculate estimated steps from accelerometer data
  const stepCount = analyzeAccelerometerForSteps(accData);
  
  // Save calibration data to localStorage for step counter algorithm
  localStorage.setItem(`stepLength_${currentStepType}`, avgStepLength.toFixed(4));
  localStorage.setItem(`stepCalibration_${currentStepType}_date`, new Date().toISOString());
  localStorage.setItem(`stepCalibration_${currentStepType}_accuracy`, positions.length > 5 ? "high" : "low");
  
  // Save additional parameters that help with step detection algorithm
  if (accData.length > 50) {
    // Calculate accelerometer pattern signatures for this step type
    const accPattern = calculateAccelerometerPattern(accData);
    localStorage.setItem(`stepPattern_${currentStepType}`, JSON.stringify(accPattern));
  }
  
  // Display results
  resultPanel.innerHTML = `
    <h3>Resultater</h3>
    <div class="result-item">
      <span>Skridttype:</span>
      <strong>${getStepTypeName(currentStepType)}</strong>
    </div>
    <div class="result-item">
      <span>Gået distance:</span>
      <strong>${distance.toFixed(2)} meter</strong>
    </div>
    <div class="result-item">
      <span>Gennemsnitlig skridtlængde:</span>
      <strong>${avgStepLength.toFixed(2)} m</strong>
    </div>
    <div class="result-item">
      <span>Estimeret antal skridt:</span>
      <strong>${stepCount} skridt</strong>
    </div>
    <div class="result-item">
      <span>Tid brugt:</span>
      <strong>${elapsedTime.toFixed(1)} sek</strong>
    </div>
    <div class="result-item">
      <span>ACC målinger:</span>
      <strong>${accData.length}</strong>
    </div>
    <div class="result-item">
      <span>GPS punkter:</span>
      <strong>${positions.length}</strong>
    </div>
    <div class="calibration-info">
      <p>Kalibreringen er gemt og vil forbedre præcisionen af skridttælling.</p>
    </div>
  `;
  
  showToast("Kalibrering afsluttet");
}

// Calculate distance using the Haversine formula
function calculateDistance(coords) {
  if (coords.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 1; i < coords.length; i++) {
    totalDistance += haversine(coords[i-1], coords[i]);
  }
  
  return totalDistance;
}

// Haversine formula to calculate distance between GPS coordinates
function haversine(p1, p2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = p1.lat * Math.PI / 180; // lat in radians
  const φ2 = p2.lat * Math.PI / 180;
  const Δφ = (p2.lat - p1.lat) * Math.PI / 180;
  const Δλ = (p2.lon - p1.lon) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  const distance = R * c;
  
  // Filter out unlikely movements (GPS jitter)
  if (distance < 0.2) return 0; // Ignore movements less than 20cm
  
  return distance;
}

// Basic step detection from accelerometer data
function detectSteps(accData) {
  // Implement advanced step detection (placeholder)
  // This would normally analyze the accelerometer data to detect step patterns
  return accData;
}

// Analyze accelerometer data to estimate step count
function analyzeAccelerometerForSteps(accData) {
  if (accData.length < 20) return 0; // Not enough data
  
  let steps = 0;
  const minPeakDistance = 500; // Minimum milliseconds between steps
  let lastPeakTime = 0;
  
  // Calculate magnitude to combine x, y, and z components
  const magnitudes = accData.map(sample => {
    return {
      magnitude: Math.sqrt(sample.x*sample.x + sample.y*sample.y + sample.z*sample.z),
      timestamp: sample.timestamp
    };
  });
  
  // Apply simple smoothing (moving average)
  const windowSize = 5;
  const smoothed = [];
  
  for (let i = 0; i < magnitudes.length; i++) {
    if (i < windowSize - 1) {
      smoothed.push(magnitudes[i]);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += magnitudes[i - j].magnitude;
    }
    
    smoothed.push({
      magnitude: sum / windowSize,
      timestamp: magnitudes[i].timestamp
    });
  }
  
  // Calculate mean and standard deviation
  const mean = smoothed.reduce((sum, val) => sum + val.magnitude, 0) / smoothed.length;
  const stdDev = Math.sqrt(
    smoothed.reduce((sum, val) => sum + Math.pow(val.magnitude - mean, 2), 0) / smoothed.length
  );
  
  // Set peak threshold dynamically based on data variance
  const peakThreshold = mean + 1.2 * stdDev;
  
  // Detect peaks (potential steps)
  for (let i = 1; i < smoothed.length - 1; i++) {
    const prev = smoothed[i-1].magnitude;
    const current = smoothed[i].magnitude;
    const next = smoothed[i+1].magnitude;
    const timestamp = smoothed[i].timestamp;
    
    // Check if this is a peak
    if (current > prev && current > next && current > peakThreshold) {
      // Check if enough time has passed since last peak
      if (timestamp - lastPeakTime > minPeakDistance) {
        steps++;
        lastPeakTime = timestamp;
      }
    }
  }
  
  return steps;
}

// Calculate signature pattern for this step type from accelerometer data
function calculateAccelerometerPattern(accData) {
  // Extract features that help identify this specific type of step
  // These will be used by the step counter algorithm
  
  // 1. Calculate average peak-to-peak time
  const peakTimes = [];
  let lastPeakTime = 0;
  
  // Calculate magnitudes
  const magnitudes = accData.map(sample => ({
    magnitude: Math.sqrt(sample.x*sample.x + sample.y*sample.y + sample.z*sample.z),
    timestamp: sample.timestamp
  }));
  
  // Find peaks
  for (let i = 5; i < magnitudes.length - 5; i++) {
    if (isLocalMaximum(magnitudes, i, 5)) {
      if (lastPeakTime > 0) {
        peakTimes.push(magnitudes[i].timestamp - lastPeakTime);
      }
      lastPeakTime = magnitudes[i].timestamp;
    }
  }
  
  // 2. Calculate average magnitude
  const avgMagnitude = magnitudes.reduce((sum, v) => sum + v.magnitude, 0) / magnitudes.length;
  
  // 3. Calculate typical Z-axis profile for this step type
  const zProfile = calculateAxisProfile(accData, 'z');
  
  return {
    avgPeakInterval: peakTimes.length > 0 ? 
      peakTimes.reduce((sum, val) => sum + val, 0) / peakTimes.length : 0,
    avgMagnitude: avgMagnitude,
    zProfile: zProfile,
    variability: calculateVariability(magnitudes),
    timestamp: Date.now()
  };
}

// Check if a point is a local maximum in the time series
function isLocalMaximum(data, index, windowSize) {
  const current = data[index].magnitude;
  
  for (let i = Math.max(0, index - windowSize); i < index; i++) {
    if (data[i].magnitude >= current) return false;
  }
  
  for (let i = index + 1; i <= Math.min(data.length - 1, index + windowSize); i++) {
    if (data[i].magnitude >= current) return false;
  }
  
  return true;
}

// Calculate the typical profile for a given axis
function calculateAxisProfile(accData, axis) {
  // This creates a simplified representation of an "average step" on this axis
  const samples = 20; // Number of sample points to represent a step
  const profile = new Array(samples).fill(0);
  let count = 0;
  
  // Find sections that likely represent individual steps
  const stepSections = findStepSections(accData);
  
  stepSections.forEach(section => {
    if (section.end - section.start > 5) { // Ensure enough data points
      count++;
      
      // Resample this section to standard number of points
      for (let i = 0; i < samples; i++) {
        const pos = section.start + Math.floor((section.end - section.start) * (i / samples));
        if (pos < accData.length) {
          profile[i] += accData[pos][axis];
        }
      }
    }
  });
  
  // Average the profiles if we found any steps
  if (count > 0) {
    for (let i = 0; i < samples; i++) {
      profile[i] /= count;
    }
  }
  
  return profile;
}

// Find sections in accelerometer data that likely represent individual steps
function findStepSections(accData) {
  const sections = [];
  const magnitudes = [];
  
  // Calculate magnitudes
  for (let i = 0; i < accData.length; i++) {
    const acc = accData[i];
    magnitudes.push(Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z));
  }
  
  // Find likely step sections by looking for peaks
  let inStep = false;
  let stepStart = 0;
  const threshold = calculateDynamicThreshold(magnitudes);
  
  for (let i = 0; i < magnitudes.length; i++) {
    if (!inStep && magnitudes[i] > threshold) {
      inStep = true;
      stepStart = i;
    } else if (inStep && magnitudes[i] < threshold) {
      inStep = false;
      if (i - stepStart > 3) { // Avoid tiny sections
        sections.push({start: Math.max(0, stepStart - 3), end: i + 3});
      }
    }
  }
  
  return sections;
}

// Calculate a dynamic threshold for peak detection
function calculateDynamicThreshold(values) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return mean + Math.sqrt(variance) * 0.7;
}

// Calculate variability (smoothness) of step pattern
function calculateVariability(magnitudes) {
  let diffs = 0;
  
  for (let i = 1; i < magnitudes.length; i++) {
    diffs += Math.abs(magnitudes[i].magnitude - magnitudes[i-1].magnitude);
  }
  
  return magnitudes.length > 1 ? diffs / (magnitudes.length - 1) : 0;
}

// Show toast message
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
    
    // Add CSS for toast in JavaScript to keep it self-contained
    const style = document.createElement("style");
    style.textContent = `
      #toast {
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 12px 24px;
        border-radius: 20px;
        font-size: 16px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      #toast.show {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Display message
  toast.textContent = message;
  toast.classList.add("show");
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Get human-readable step type name
function getStepTypeName(type) {
  const names = {
    normal: "Normal gang",
    long: "Lungende skridt",
    run: "Løbende"
  };
  
  return names[type] || type;
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);