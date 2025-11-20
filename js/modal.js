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

  // Handle form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
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
