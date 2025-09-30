// Contact Page JavaScript
// Specific functionality for the Contact page

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
    initializeContactForm();
    initializeFAQ();
    initializeBookingModal();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeCounters();
    initializeContactInteractions();
});

// Initialize contact page specific features
function initializeContactPage() {
    // Add smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize navigation highlighting
    highlightCurrentPage();
    
    // Initialize contact info hover effects
    initializeContactInfoEffects();
    
    // Initialize social links tracking
    initializeSocialTracking();
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'contact.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
// contact-form-fix.js
(function () {
  document.addEventListener('DOMContentLoaded', initializeContactForm);

  function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Use a robust selector for the submit button
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.querySelector('#success-message') || document.querySelector('.success-message');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(form)) {
        submitForm(form, submitButton, successMessage);
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      // don't call undefined debounce — use the implemented one below
      input.addEventListener('input', debounce(() => {
        if (input.classList.contains('error')) validateField(input);
      }, 250));
    });

    initializeDynamicFormSections(form);
    initializeFormAutoSave(form);
  }

  // simple debounce utility
  function debounce(fn, wait = 300) {
    let t;
    return function (...args) {
      const ctx = this;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(ctx, args), wait);
    };
  }

  // Form-level validation
  function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    const email = form.querySelector('input[type="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
      showFieldError(email, 'Please enter a valid email address');
      isValid = false;
    }

    const phone = form.querySelector('input[type="tel"]');
    if (phone && phone.value && !isValidPhone(phone.value)) {
      showFieldError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    return isValid;
  }

  function validateField(field) {
    if (!field) return true;
    const value = String(field.value || '').trim();
    const fieldGroup = field.closest('.form-group') || field.parentElement;

    // clear previous error
    if (fieldGroup) {
      fieldGroup.classList.remove('error');
      const prev = fieldGroup.querySelector('.error-message');
      if (prev) prev.remove();
    }

    if (field.hasAttribute('required') && !value) {
      showFieldError(field, 'This field is required');
      return false;
    }

    if (field.type === 'email' && value && !isValidEmail(value)) {
      showFieldError(field, 'Please enter a valid email address');
      return false;
    }

    if (field.type === 'tel' && value && !isValidPhone(value)) {
      showFieldError(field, 'Please enter a valid phone number');
      return false;
    }

    if (field.hasAttribute('minlength')) {
      const minLength = parseInt(field.getAttribute('minlength'), 10);
      if (value.length < minLength) {
        showFieldError(field, `Minimum ${minLength} characters required`);
        return false;
      }
    }

    return true;
  }

  function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group') || field.parentElement;
    if (!fieldGroup) return;
    fieldGroup.classList.add('error');

    let errorElement = fieldGroup.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      fieldGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    const cleaned = phone.replace(/\s/g, '');
    return /^[\+]?[1-9][\d\-\(\)]{7,}$/.test(cleaned);
  }

  // Toggle spinner + text without clobbering markup
  function setButtonLoading(btn, loading) {
    if (!btn) return;
    const loadingSpan = btn.querySelector('.btn-loading');
    const textSpan = btn.querySelector('.btn-text');
    if (loading) {
      btn.classList.add('loading');
      btn.disabled = true;
      if (loadingSpan) loadingSpan.style.display = 'inline-block';
      if (textSpan) textSpan.style.display = 'none';
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
      if (loadingSpan) loadingSpan.style.display = 'none';
      if (textSpan) textSpan.style.display = 'inline';
    }
  }

  async function submitForm(form, submitButton, successMessage) {
    setButtonLoading(submitButton, true);
    const formData = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: form.method || 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      setButtonLoading(submitButton, false);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Form submission failed');
      }

      if (successMessage) {
        successMessage.classList.add('show');
        successMessage.style.backgroundColor = '';
        successMessage.style.color = '';
        successMessage.textContent = "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.";
      }

      form.reset();
      clearFormAutoSave();

      // safe call: only call tracking if defined
      const data = Object.fromEntries(formData.entries());
      if (typeof window.trackContactFormSubmission === 'function') {
        window.trackContactFormSubmission(data);
      }

      if (successMessage) successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { if (successMessage) successMessage.classList.remove('show'); }, 10000);

    } catch (err) {
      setButtonLoading(submitButton, false);
      if (successMessage) {
        successMessage.classList.add('show');
        successMessage.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
        successMessage.style.backgroundColor = '#ff4444';
        successMessage.style.color = '#fff';
      }
      console.error('Form submission error:', err);
    }
  }

  // Adapt dynamic UI to your HTML (select based)
  function initializeDynamicFormSections(form) {
    const serviceSelect = form.querySelector('select[name="projectType"]') || form.querySelector('select[name="service"]');
    const projectDetails = document.querySelector('.project-details');

    if (serviceSelect && projectDetails) {
      serviceSelect.addEventListener('change', function () {
        if (this.value && this.value !== '') {
          projectDetails.style.display = 'block';
          projectDetails.classList.add('fade-in', 'animate');
        } else {
          projectDetails.style.display = 'none';
          projectDetails.classList.remove('animate');
        }
      });
    }

    const budgetSelect = form.querySelector('select[name="budget"]');
    if (budgetSelect) {
      budgetSelect.addEventListener('change', function () {
        budgetSelect.classList.add('changed');
        setTimeout(() => budgetSelect.classList.remove('changed'), 200);
      });
    }

    const timelineSelect = form.querySelector('select[name="timeline"]');
    if (timelineSelect) {
      timelineSelect.addEventListener('change', function () {
        timelineSelect.classList.add('changed');
        setTimeout(() => timelineSelect.classList.remove('changed'), 200);
      });
    }
  }

  // Auto-save helpers
  function initializeFormAutoSave(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    loadFormAutoSave(form);
    inputs.forEach(input => {
      input.addEventListener('input', debounce(saveFormAutoSave, 1000));
    });
  }

  function saveFormAutoSave() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem('contactFormAutoSave', JSON.stringify(data));
  }

  function loadFormAutoSave() {
    const saved = localStorage.getItem('contactFormAutoSave');
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      const form = document.querySelector('.contact-form');
      if (!form) return;
      Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (!field) return;
        if (field.type === 'radio' || field.type === 'checkbox') {
          if (field.value === data[key]) field.checked = true;
        } else {
          field.value = data[key];
        }
      });
    } catch (e) {
      console.error('Error loading auto-saved form data:', e);
    }
  }

  function clearFormAutoSave() {
    localStorage.removeItem('contactFormAutoSave');
  }

})();

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    if (otherToggle) otherToggle.textContent = '+';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                if (toggle) toggle.textContent = '+';
            } else {
                item.classList.add('active');
                if (toggle) toggle.textContent = '-';
            }
            
            // Track FAQ interaction
            trackFAQInteraction(question.textContent, !isActive);
        });
        
        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Booking modal functionality
function initializeBookingModal() {
    const bookingButtons = document.querySelectorAll('[data-booking]');
    const modal = document.querySelector('.booking-modal');
    const closeButton = modal?.querySelector('.booking-modal-close');
    
    if (!modal) return;
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showBookingModal();
        });
    });
    
    if (closeButton) {
        closeButton.addEventListener('click', hideBookingModal);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideBookingModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideBookingModal();
        }
    });
}

// Show booking modal
function showBookingModal() {
    const modal = document.querySelector('.booking-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
}

// Hide booking modal
function hideBookingModal() {
    const modal = document.querySelector('.booking-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Contact info hover effects
function initializeContactInfoEffects() {
    const contactItems = document.querySelectorAll('.contact-info-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click to copy functionality for email and phone
        const emailLink = item.querySelector('a[href^="mailto:"]');
        const phoneLink = item.querySelector('a[href^="tel:"]');
        
        if (emailLink) {
            emailLink.addEventListener('click', function(e) {
                e.preventDefault();
                const email = this.textContent;
                copyToClipboard(email, 'Email address copied to clipboard!');
            });
        }
        
        if (phoneLink) {
            phoneLink.addEventListener('click', function(e) {
                e.preventDefault();
                const phone = this.textContent;
                copyToClipboard(phone, 'Phone number copied to clipboard!');
            });
        }
    });
}

// Copy to clipboard functionality
function copyToClipboard(text, message) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyToClipboard(text, message);
        });
    } else {
        fallbackCopyToClipboard(text, message);
    }
}

// Fallback copy to clipboard
function fallbackCopyToClipboard(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast(message);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

// Show toast notification
function showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--dark-color);
            color: var(--white);
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 2000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
    }, 3000);
}

// Counter animations
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                
                if (isNaN(target)) return;
                
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, 50);
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.7 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for contact info grid
                if (entry.target.classList.contains('contact-info-grid')) {
                    const items = entry.target.querySelectorAll('.contact-info-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('scale-in', 'animate');
                        }, index * 200);
                    });
                }
                
                // Special handling for FAQ items
                if (entry.target.classList.contains('faq-container')) {
                    const items = entry.target.querySelectorAll('.faq-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in', 'animate');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.contact-info-grid, .contact-form-container, .faq-container, .contact-hero .hero-stats'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Social links tracking
function initializeSocialTracking() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.classList[1]; // Assumes second class is platform name
            trackSocialClick(platform);
        });
    });
}

// Contact interactions
function initializeContactInteractions() {
    // Track page engagement
    let engagementStartTime = Date.now();
    let hasScrolled = false;
    let hasInteracted = false;
    
    // Track scroll
    window.addEventListener('scroll', function() {
        if (!hasScrolled) {
            hasScrolled = true;
            trackContactEngagement('scroll');
        }
    });
    
    // Track form interactions
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('input', function() {
            if (!hasInteracted) {
                hasInteracted = true;
                trackContactEngagement('form_interaction');
            }
        });
    }
    
    // Track time on page
    window.addEventListener('beforeunload', function() {
        const timeSpent = Date.now() - engagementStartTime;
        trackContactEngagement('time_spent', { duration: timeSpent });
    });
}

// Form validation initialization
function initializeFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    // Add custom validation messages
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            
            let message = 'Please fill out this field.';
            
            if (input.type === 'email') {
                message = 'Please enter a valid email address.';
            } else if (input.type === 'tel') {
                message = 'Please enter a valid phone number.';
            } else if (input.hasAttribute('minlength')) {
                const minLength = input.getAttribute('minlength');
                message = `Please enter at least ${minLength} characters.`;
            }
            
            showFieldError(input, message);
        });
    });
}

// Add dynamic styles for contact page
function addContactPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            font-family: inherit;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .contact-info-item.scale-in {
            animation: scaleIn 0.6s ease-out;
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .faq-item.fade-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            animation: focusPulse 0.3s ease;
        }
        
        @keyframes focusPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .btn-submit.loading {
            position: relative;
            color: transparent;
        }
        
        .btn-submit.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
document.addEventListener('DOMContentLoaded', addContactPageStyles);

// Analytics tracking functions
function trackContactFormSubmission(data) {
    // Analytics tracking would go here
    console.log('Contact form submitted:', data);
}

function trackFAQInteraction(question, opened) {
    // Analytics tracking would go here
    console.log(`FAQ ${opened ? 'opened' : 'closed'}:`, question);
}

function trackSocialClick(platform) {
    // Analytics tracking would go here
    console.log('Social link clicked:', platform);
}

function trackContactEngagement(action, data = {}) {
    // Analytics tracking would go here
    console.log('Contact engagement:', action, data);
}

// Export functions for potential external use
window.ContactPageJS = {
    validateForm,
    showBookingModal,
    hideBookingModal,
    copyToClipboard,
    showToast
};

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard navigation for contact info items
function initializeKeyboardNavigation() {
    const contactItems = document.querySelectorAll('.contact-info-item');
    
    contactItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', initializeKeyboardNavigation);

// Form progress tracking
function initializeFormProgress() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    const totalFields = inputs.length;
    
    function updateProgress() {
        let filledFields = 0;
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                filledFields++;
            }
        });
        
        const progress = (filledFields / totalFields) * 100;
        
        // Create or update progress bar
        let progressBar = document.querySelector('.form-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <span class="progress-text">Form completion: 0%</span>
            `;
            progressBar.style.cssText = `
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(212, 175, 55, 0.1);
                border-radius: 10px;
                text-align: center;
            `;
            
            const progressBarElement = progressBar.querySelector('.progress-bar');
            progressBarElement.style.cssText = `
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            `;
            
            const progressFill = progressBar.querySelector('.progress-fill');
            progressFill.style.cssText = `
                height: 100%;
                background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
                transition: width 0.3s ease;
                width: 0%;
            `;
            
            form.insertBefore(progressBar, form.firstChild);
        }
        
        const progressFill = progressBar.querySelector('.progress-fill');
        const progressText = progressBar.querySelector('.progress-text');
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `Form completion: ${Math.round(progress)}%`;
    }
    
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
    });
    
    // Initial progress update
    updateProgress();
}

// Initialize form progress tracking
document.addEventListener('DOMContentLoaded', initializeFormProgress);