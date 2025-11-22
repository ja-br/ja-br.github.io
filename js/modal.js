document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('email-modal');
  const openBtn = document.getElementById('open-modal');
  const cancelBtn = document.getElementById('cancel-modal');
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Open modal
  openBtn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.add('active');
  });

  // Close modal on cancel
  cancelBtn.addEventListener('click', function() {
    closeModal();
  });

  // Close modal on overlay click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Client-side validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showValidationError(input, message) {
    let errorDiv = input.parentElement.querySelector('.validation-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'validation-error';
      errorDiv.style.color = '#721c24';
      errorDiv.style.fontSize = '0.9em';
      errorDiv.style.marginTop = '3px';
      input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    input.style.borderColor = '#721c24';
  }

  function clearValidationError(input) {
    const errorDiv = input.parentElement.querySelector('.validation-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    input.style.borderColor = '';
  }

  // Add validation on blur
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  emailInput.addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
      showValidationError(this, 'Please enter a valid email address');
    } else if (this.value) {
      clearValidationError(this);
    }
  });

  [subjectInput, messageInput].forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim().length < 3 && this.value.length > 0) {
        showValidationError(this, 'This field must be at least 3 characters');
      } else if (this.value) {
        clearValidationError(this);
      }
    });
  });

  // Handle form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous validation errors
    [emailInput, subjectInput, messageInput].forEach(clearValidationError);
    formStatus.textContent = '';
    formStatus.className = '';

    // Validate all fields
    let isValid = true;

    if (!emailInput.value) {
      showValidationError(emailInput, 'Email is required');
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showValidationError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      showValidationError(subjectInput, 'Subject is required');
      isValid = false;
    } else if (subjectInput.value.trim().length < 3) {
      showValidationError(subjectInput, 'Subject must be at least 3 characters');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showValidationError(messageInput, 'Message is required');
      isValid = false;
    } else if (messageInput.value.trim().length < 3) {
      showValidationError(messageInput, 'Message must be at least 3 characters');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Add spinner
    submitBtn.innerHTML = 'Sending<span class="spinner"></span>';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent successfully!';
        formStatus.className = 'success';
        form.reset();
        setTimeout(closeModal, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formStatus.textContent = 'Failed to send message. Please try again.';
      formStatus.className = 'error';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    formStatus.textContent = '';
    formStatus.className = '';
  }
});
