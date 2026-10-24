/**
 * KKK Wheel Care - Client-side Form Validation Module
 * Satisfies Requirement 3: JavaScript form validation for registration, login, profile, and payment.
 */

document.addEventListener('DOMContentLoaded', function () {
  initRegistrationValidation();
  initLoginValidation();
  initProfileValidation();
  initPaymentValidation();
  initBookingValidation();
});

// Helper: Show validation state
function setFieldStatus(input, isValid, message) {
  const parent = input.closest('.form-group, .mb-3, .col-md-6, .col-md-12, .col-12') || input.parentElement;
  let feedback = parent.querySelector('.invalid-feedback');

  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    parent.appendChild(feedback);
  }

  if (isValid) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.textContent = '';
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.textContent = message;
  }
}

function clearFieldStatus(input) {
  input.classList.remove('is-valid', 'is-invalid');
}

// -------------------------------------------------------------
// 1. REGISTRATION FORM VALIDATION
// -------------------------------------------------------------
function initRegistrationValidation() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const fullName = document.getElementById('regFullName');
  const email = document.getElementById('regEmail');
  const phone = document.getElementById('regPhone');
  const vehicleNumber = document.getElementById('regVehicleNumber');
  const vehicleType = document.getElementById('regVehicleType');
  const password = document.getElementById('regPassword');
  const confirmPassword = document.getElementById('regConfirmPassword');
  const terms = document.getElementById('regTerms');
  const strengthFill = document.getElementById('passwordStrengthFill');
  const strengthText = document.getElementById('passwordStrengthText');

  // Real-time password strength meter
  if (password) {
    password.addEventListener('input', function () {
      const val = password.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      if (strengthFill && strengthText) {
        if (val.length === 0) {
          strengthFill.style.width = '0%';
          strengthText.textContent = '';
        } else if (score <= 1) {
          strengthFill.style.width = '25%';
          strengthFill.style.backgroundColor = '#dc3545';
          strengthText.textContent = 'Weak (Needs min 8 chars, 1 uppercase, 1 digit, 1 special symbol)';
          strengthText.className = 'text-danger small mt-1';
        } else if (score === 2 || score === 3) {
          strengthFill.style.width = '65%';
          strengthFill.style.backgroundColor = '#ffc107';
          strengthText.textContent = 'Moderate password';
          strengthText.className = 'text-warning small mt-1';
        } else {
          strengthFill.style.width = '100%';
          strengthFill.style.backgroundColor = '#198754';
          strengthText.textContent = 'Strong password';
          strengthText.className = 'text-success small mt-1';
        }
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isFormValid = true;

    // Full name
    if (!fullName.value.trim() || fullName.value.trim().length < 3) {
      setFieldStatus(fullName, false, 'Please enter your full name (minimum 3 letters).');
      isFormValid = false;
    } else {
      setFieldStatus(fullName, true);
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      setFieldStatus(email, false, 'Please enter a valid email address (e.g., rahul@example.com).');
      isFormValid = false;
    } else {
      setFieldStatus(email, true);
    }

    // Phone (10 digits Indian/standard)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.value.trim())) {
      setFieldStatus(phone, false, 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      isFormValid = false;
    } else {
      setFieldStatus(phone, true);
    }

    // Vehicle Registration (e.g., TN01AB1234 or TN-01-AB-1234)
    const vehRegex = /^[A-Za-z0-9\s-]{6,14}$/;
    if (!vehRegex.test(vehicleNumber.value.trim())) {
      setFieldStatus(vehicleNumber, false, 'Enter a valid vehicle number (e.g., TN-07-BW-2024).');
      isFormValid = false;
    } else {
      setFieldStatus(vehicleNumber, true);
    }

    // Vehicle Type
    if (!vehicleType.value) {
      setFieldStatus(vehicleType, false, 'Please select your vehicle category.');
      isFormValid = false;
    } else {
      setFieldStatus(vehicleType, true);
    }

    // Password validation: min 8, 1 uppercase, 1 digit, 1 special char
    const pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!pwdRegex.test(password.value)) {
      setFieldStatus(password, false, 'Must be at least 8 chars with 1 uppercase letter, 1 number & 1 special character.');
      isFormValid = false;
    } else {
      setFieldStatus(password, true);
    }

    // Confirm Password
    if (confirmPassword.value !== password.value || !confirmPassword.value) {
      setFieldStatus(confirmPassword, false, 'Passwords do not match.');
      isFormValid = false;
    } else {
      setFieldStatus(confirmPassword, true);
    }

    // Terms
    if (!terms.checked) {
      terms.classList.add('is-invalid');
      isFormValid = false;
    } else {
      terms.classList.remove('is-invalid');
    }

    if (isFormValid) {
      const regSuccessAlert = document.getElementById('regSuccessAlert');
      if (regSuccessAlert) {
        regSuccessAlert.classList.remove('d-none');
        regSuccessAlert.scrollIntoView({ behavior: 'smooth' });
      }
      // Save mock user into localStorage for immediate login testing
      const newUser = {
        name: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        vehicleNumber: vehicleNumber.value.trim(),
        vehicleType: vehicleType.value,
        registeredAt: new Date().toLocaleDateString()
      };
      localStorage.setItem('kkk_current_user', JSON.stringify(newUser));

      setTimeout(function () {
        window.location.href = 'profile.html?registered=true';
      }, 1500);
    }
  });
}

// -------------------------------------------------------------
// 2. LOGIN FORM VALIDATION
// -------------------------------------------------------------
function initLoginValidation() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const demoFillBtn = document.getElementById('demoFillBtn');

  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', function () {
      emailInput.value = 'customer@kkkwheelcare.com';
      passwordInput.value = 'KkkCare@2026';
      clearFieldStatus(emailInput);
      clearFieldStatus(passwordInput);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
      setFieldStatus(emailInput, false, 'Please enter a valid registered email address.');
      isValid = false;
    } else {
      setFieldStatus(emailInput, true);
    }

    if (!passwordInput.value || passwordInput.value.length < 6) {
      setFieldStatus(passwordInput, false, 'Password must be at least 6 characters.');
      isValid = false;
    } else {
      setFieldStatus(passwordInput, true);
    }

    if (isValid) {
      // Store session state in localStorage
      const user = JSON.parse(localStorage.getItem('kkk_current_user')) || {
        name: 'Valued Customer',
        email: emailInput.value.trim(),
        phone: '9000000000',
        vehicleNumber: 'TN-00-AA-0000',
        vehicleType: 'SUV / Sedan',
        registeredAt: '2026-10-20'
      };
      localStorage.setItem('kkk_auth_token', 'mock_jwt_token_academic_eval_' + Date.now());
      localStorage.setItem('kkk_current_user', JSON.stringify(user));

      const alertBox = document.getElementById('loginSuccessAlert');
      if (alertBox) alertBox.classList.remove('d-none');

      setTimeout(function () {
        window.location.href = 'profile.html';
      }, 1000);
    }
  });
}

// -------------------------------------------------------------
// 3. PROFILE FORM VALIDATION & PERSISTENCE
// -------------------------------------------------------------
function initProfileValidation() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  // Pre-fill user data if found in localStorage
  const storedUser = JSON.parse(localStorage.getItem('kkk_current_user'));
  if (storedUser) {
    if (document.getElementById('profName')) document.getElementById('profName').value = storedUser.name || '';
    if (document.getElementById('profEmail')) document.getElementById('profEmail').value = storedUser.email || '';
    if (document.getElementById('profPhone')) document.getElementById('profPhone').value = storedUser.phone || '';
    if (document.getElementById('profVehicle')) document.getElementById('profVehicle').value = storedUser.vehicleNumber || '';
    if (document.getElementById('profHeaderName')) document.getElementById('profHeaderName').textContent = storedUser.name || 'Valued Customer';
    if (document.getElementById('profHeaderEmail')) document.getElementById('profHeaderEmail').textContent = storedUser.email || 'customer@kkkwheelcare.com';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('profName');
    const phone = document.getElementById('profPhone');
    const city = document.getElementById('profCity');
    const pincode = document.getElementById('profPincode');

    if (!name.value.trim()) {
      setFieldStatus(name, false, 'Name cannot be empty.');
      isValid = false;
    } else {
      setFieldStatus(name, true);
    }

    if (!/^[6-9]\d{9}$/.test(phone.value.trim())) {
      setFieldStatus(phone, false, 'Enter a valid 10-digit phone number.');
      isValid = false;
    } else {
      setFieldStatus(phone, true);
    }

    if (!city.value.trim()) {
      setFieldStatus(city, false, 'City name is required.');
      isValid = false;
    } else {
      setFieldStatus(city, true);
    }

    if (!/^\d{6}$/.test(pincode.value.trim())) {
      setFieldStatus(pincode, false, 'Enter a 6-digit postal code.');
      isValid = false;
    } else {
      setFieldStatus(pincode, true);
    }

    if (isValid) {
      const updatedUser = Object.assign(storedUser || {}, {
        name: name.value.trim(),
        phone: phone.value.trim(),
        city: city.value.trim(),
        pincode: pincode.value.trim()
      });
      localStorage.setItem('kkk_current_user', JSON.stringify(updatedUser));

      const alertBox = document.getElementById('profileSuccessAlert');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        setTimeout(() => alertBox.classList.add('d-none'), 3500);
      }
    }
  });
}

// -------------------------------------------------------------
// 4. MOCK PAYMENT WORKFLOW & FORM VALIDATION
// -------------------------------------------------------------
function initPaymentValidation() {
  const form = document.getElementById('paymentForm');
  if (!form) return;

  const cardRadio = document.getElementById('methodCard');
  const upiRadio = document.getElementById('methodUPI');
  const cardSection = document.getElementById('cardPaymentSection');
  const upiSection = document.getElementById('upiPaymentSection');

  // Toggle method views
  if (cardRadio && upiRadio && cardSection && upiSection) {
    cardRadio.addEventListener('change', function () {
      if (this.checked) {
        cardSection.classList.remove('d-none');
        upiSection.classList.add('d-none');
      }
    });
    upiRadio.addEventListener('change', function () {
      if (this.checked) {
        upiSection.classList.remove('d-none');
        cardSection.classList.add('d-none');
      }
    });
  }

  // Format 16-digit card input with spaces
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function (e) {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 16) val = val.substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
    });
  }

  // Format Expiry MM/YY
  const cardExpiryInput = document.getElementById('cardExpiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function (e) {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 4) val = val.substring(0, 4);
      if (val.length >= 3) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2);
      } else {
        e.target.value = val;
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    const isCard = cardRadio ? cardRadio.checked : true;

    if (isCard) {
      const cardName = document.getElementById('cardName');
      const cardNum = document.getElementById('cardNumber');
      const cardExp = document.getElementById('cardExpiry');
      const cardCvv = document.getElementById('cardCvv');

      if (!cardName.value.trim() || cardName.value.trim().length < 3) {
        setFieldStatus(cardName, false, 'Enter the full name on the card.');
        isValid = false;
      } else {
        setFieldStatus(cardName, true);
      }

      const rawNum = cardNum.value.replace(/\s/g, '');
      if (!/^\d{16}$/.test(rawNum)) {
        setFieldStatus(cardNum, false, 'Enter a valid 16-digit card number.');
        isValid = false;
      } else {
        setFieldStatus(cardNum, true);
      }

      if (!/^(0[1-9]|1[0-2])\/?([2-9][6-9])$/.test(cardExp.value.trim())) {
        setFieldStatus(cardExp, false, 'Valid MM/YY (future date) required.');
        isValid = false;
      } else {
        setFieldStatus(cardExp, true);
      }

      if (!/^\d{3,4}$/.test(cardCvv.value.trim())) {
        setFieldStatus(cardCvv, false, 'Valid 3 or 4-digit CVV required.');
        isValid = false;
      } else {
        setFieldStatus(cardCvv, true);
      }
    } else {
      // UPI validation
      const upiId = document.getElementById('upiId');
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(upiId.value.trim())) {
        setFieldStatus(upiId, false, 'Enter a valid UPI Virtual Payment Address (e.g., rahul@okhdfcbank).');
        isValid = false;
      } else {
        setFieldStatus(upiId, true);
      }
    }

    if (isValid) {
      // Trigger Mock Processing Modal / Receipt
      const modalEl = document.getElementById('paymentSuccessModal');
      const txnId = 'TXN-KKK-' + Math.floor(100000 + Math.random() * 900000);
      const receiptTxn = document.getElementById('receiptTxnId');
      if (receiptTxn) receiptTxn.textContent = txnId;

      if (window.bootstrap && modalEl) {
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
      } else {
        alert('Mock Payment Successful! Transaction Reference: ' + txnId);
      }
    }
  });
}

// -------------------------------------------------------------
// 5. SERVICE BOOKING VALIDATION
// -------------------------------------------------------------
function initBookingValidation() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const serviceSelect = document.getElementById('bookService');
  const dateInput = document.getElementById('bookDate');
  const timeSelect = document.getElementById('bookTime');
  const vehicleInput = document.getElementById('bookVehicle');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    if (!serviceSelect.value) {
      setFieldStatus(serviceSelect, false, 'Please select the service required.');
      isValid = false;
    } else {
      setFieldStatus(serviceSelect, true);
    }

    if (!dateInput.value) {
      setFieldStatus(dateInput, false, 'Please choose a booking date.');
      isValid = false;
    } else {
      setFieldStatus(dateInput, true);
    }

    if (!timeSelect.value) {
      setFieldStatus(timeSelect, false, 'Please select an appointment slot.');
      isValid = false;
    } else {
      setFieldStatus(timeSelect, true);
    }

    if (!vehicleInput.value.trim()) {
      setFieldStatus(vehicleInput, false, 'Please provide vehicle registration number.');
      isValid = false;
    } else {
      setFieldStatus(vehicleInput, true);
    }

    if (isValid) {
      // Store pending booking and redirect to payment
      const bookingData = {
        service: serviceSelect.options[serviceSelect.selectedIndex].text,
        price: serviceSelect.value,
        date: dateInput.value,
        time: timeSelect.value,
        vehicle: vehicleInput.value.trim()
      };
      localStorage.setItem('kkk_pending_booking', JSON.stringify(bookingData));
      window.location.href = 'payment.html?from=booking';
    }
  });
}
