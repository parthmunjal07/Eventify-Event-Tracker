let currentTab = "student";

// Tab Switching Function
function switchTab(tab) {
  currentTab = tab;
  const tabButtons = document.querySelectorAll(".tab-button");
  const forms = document.querySelectorAll("form");

  // Update active tab button
  tabButtons.forEach((btn, index) => {
    btn.classList.remove("active");
    if (
      (tab === "student" && index === 0) ||
      (tab === "admin" && index === 1)
    ) {
      btn.classList.add("active");
    }
  });

  // Show/hide forms
  forms.forEach((form, index) => {
    if (
      (tab === "student" && index === 0) ||
      (tab === "admin" && index === 1)
    ) {
      form.classList.remove("form-hidden");
    } else {
      form.classList.add("form-hidden");
    }
  });

  // Clear previous messages
  clearMessages();
}

// Show Error Message
function showError(message, type = "student") {
  const errorDiv =
    type === "student"
      ? document.getElementById("studentError")
      : document.getElementById("adminError");
  errorDiv.textContent = message;
  errorDiv.classList.add("show");
}

// Show Success Message
function showSuccess(message, type = "student") {
  const successDiv =
    type === "student"
      ? document.getElementById("studentSuccess")
      : document.getElementById("adminSuccess");
  successDiv.textContent = message;
  successDiv.classList.add("show");
}

// Clear All Messages
function clearMessages() {
  document.getElementById("studentError").classList.remove("show");
  document.getElementById("studentSuccess").classList.remove("show");
  document.getElementById("adminError").classList.remove("show");
  document.getElementById("adminSuccess").classList.remove("show");
}

// Validate Roll Number Format
function isValidRollNumber(rollNumber) {
  const rollRegex = /^\d{2}[A-Z]{2}\d{3}$/;
  return rollRegex.test(rollNumber);
}

// Validate Email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Student Form Submission
document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  clearMessages();

  const rollNumber = document.getElementById("rollNumber").value.trim();
  const password = document.getElementById("studentPassword").value;
  const rememberMe = document.querySelector('input[name="rememberMe"]').checked;

  // Validation
  if (!rollNumber) {
    showError("Please enter your roll number", "student");
    return;
  }

  if (!password) {
    showError("Please enter your password", "student");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters long", "student");
    return;
  }

  // Simulate API call
  console.log("Student Login:", {
    rollNumber,
    password,
    rememberMe,
    timestamp: new Date().toISOString(),
  });

  // Success message
  showSuccess("✓ Login successful! Redirecting...", "student");

  // Simulate redirect after 1.5 seconds
  setTimeout(() => {
    console.log("Redirecting to student dashboard...")
    window.location.href= "../student/dashboard.html"
  }, 700);
});

// Admin Form Submission
document.getElementById("adminForm").addEventListener("submit", function (e) {
  e.preventDefault();
  clearMessages();

  const adminEmail = document.getElementById("adminEmail").value.trim();
  const adminPassword = document.getElementById("adminPassword").value;
  const clubCode = document.getElementById("clubCode").value.trim();
  const rememberMe = document.querySelector(
    'input[name="rememberAdminMe"]'
  ).checked;

  // Validation
  if (!adminEmail) {
    showError("Please enter your email address", "admin");
    return;
  }

  if (!isValidEmail(adminEmail)) {
    showError("Please enter a valid email address", "admin");
    return;
  }

  if (!adminPassword) {
    showError("Please enter your password", "admin");
    return;
  }

  if (adminPassword.length < 6) {
    showError("Password must be at least 6 characters long", "admin");
    return;
  }

  if (!clubCode) {
    showError("Please enter your club code", "admin");
    return;
  }

  // Simulate API call
  console.log("Admin Login:", {
    adminEmail,
    adminPassword,
    clubCode,
    rememberMe,
    timestamp: new Date().toISOString(),
  });

  // Success message
  showSuccess("✓ Admin login successful! Redirecting...", "admin");

  // Simulate redirect after 1.5 seconds
  setTimeout(() => {
    console.log("Redirecting to admin dashboard...");
     window.location.href = "../admin/admin.html";
  }, 700);
});

// Set default form on page load
document.getElementById("studentForm").classList.remove("form-hidden");
document.getElementById("adminForm").classList.add("form-hidden");

// Real-time password validation feedback
document
  .getElementById("studentPassword")
  .addEventListener("input", function () {
    if (this.value.length < 6 && this.value.length > 0) {
      this.style.borderColor = "#ffa500";
    } else if (this.value.length >= 6) {
      this.style.borderColor = "#90EE90";
    } else {
      this.style.borderColor = "#e8e8e8";
    }
  });

document.getElementById("adminPassword").addEventListener("input", function () {
  if (this.value.length < 6 && this.value.length > 0) {
    this.style.borderColor = "#ffa500";
  } else if (this.value.length >= 6) {
    this.style.borderColor = "#90EE90";
  } else {
    this.style.borderColor = "#e8e8e8";
  }
});
