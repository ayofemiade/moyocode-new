// Services Page JavaScript
// Specific functionality for the Services page

document.addEventListener('DOMContentLoaded', function() {
    initializeServicesPage();
    initializeServiceCards();
    initializeProcessAnimation();
    initializePriceCalculator();
    initializeScrollAnimations();
    initializeCaseStudies();
    initializeServiceFilters();
});

// Initialize services page specific features
function initializeServicesPage() {
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
    
    // Initialize service comparison
    initializeServiceComparison();
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'services.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Enhanced service cards interactions
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            
            // Add glow effect
            this.style.boxShadow = '0 25px 70px rgba(212, 175, 55, 0.2)';
            
            // Animate icon
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
            
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Add click interaction for mobile
        card.addEventListener('click', function() {
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            // Show/hide additional details
            const details = this.querySelector('.service-details');
            if (details) {
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            }
        });
        
        // Add staggered animation on load
        setTimeout(() => {
            card.classList.add('fade-in-up', 'animate');
        }, index * 100);
    });
}

// Process steps animation
function initializeProcessAnimation() {
    const processSteps = document.querySelectorAll('.process-step');
    
    if (processSteps.length === 0) return;
    
    const processObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-step');
                    
                    // Animate step number
                    const stepNumber = entry.target.querySelector('.step-number');
                    if (stepNumber) {
                        stepNumber.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            stepNumber.style.transform = 'scale(1)';
                        }, 300);
                    }
                }, index * 200);
                
                processObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    processSteps.forEach(step => {
        processObserver.observe(step);
    });
}

// Dynamic price calculator
function initializePriceCalculator() {
    const priceCalculator = document.querySelector('.price-calculator');
    if (!priceCalculator) return;
    
    const serviceSelects = priceCalculator.querySelectorAll('select, input[type="checkbox"]');
    const priceDisplay = priceCalculator.querySelector('.calculated-price');
    
    // Base prices for different services
    const servicePrices = {
        'web-development': 2500,
        'mobile-app': 5000,
        'ui-ux-design': 1500,
        'branding': 1000,
        'seo': 800,
        'maintenance': 300
    };
    
    // Additional features pricing
    const featurePrices = {
        'ecommerce': 1000,
        'cms': 500,
        'analytics': 300,
        'social-integration': 200,
        'multilingual': 400
    };
    
    function calculatePrice() {
        let totalPrice = 0;
        
        // Calculate base service price
        serviceSelects.forEach(select => {
            if (select.type === 'checkbox' && select.checked) {
                totalPrice += featurePrices[select.value] || 0;
            } else if (select.tagName === 'SELECT') {
                totalPrice += servicePrices[select.value] || 0;
            }
        });
        
        // Update price display with animation
        if (priceDisplay) {
            priceDisplay.style.transform = 'scale(1.1)';
            priceDisplay.textContent = `$${totalPrice.toLocaleString()}`;
            
            setTimeout(() => {
                priceDisplay.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // Add event listeners
    serviceSelects.forEach(select => {
        select.addEventListener('change', calculatePrice);
    });
    
    // Initial calculation
    calculatePrice();
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
                
                // Special handling for grids
                if (entry.target.classList.contains('services-grid') ||
                    entry.target.classList.contains('additional-grid') ||
                    entry.target.classList.contains('advantages-grid')) {
                    
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in-up', 'animate');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.section-header, .services-grid, .additional-grid, .process-steps, .advantages-grid, .cases-grid'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

// Case studies modal functionality
function initializeCaseStudies() {
    const caseCards = document.querySelectorAll('.case-card');
    
    caseCards.forEach(card => {
        card.addEventListener('click', function() {
            const caseTitle = this.querySelector('h4').textContent;
            const caseDescription = this.querySelector('p').textContent;
            const caseTags = Array.from(this.querySelectorAll('.case-tag')).map(tag => tag.textContent);
            
            // Create and show modal
            showCaseModal(caseTitle, caseDescription, caseTags);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) rotateY(2deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
}

// Show case study modal
function showCaseModal(title, description, tags) {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.case-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'case-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3 class="modal-title"></h3>
                <p class="modal-description"></p>
                <div class="modal-tags"></div>
                <div class="modal-actions">
                    <button class="btn-primary">View Full Case Study</button>
                    <button class="btn-secondary">Contact Us</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // Update modal content
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-description').textContent = description;
    
    const tagsContainer = modal.querySelector('.modal-tags');
    tagsContainer.innerHTML = tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');
    
    // Show modal
    modal.classList.add('show');
}

// Service filters functionality
function initializeServiceFilters() {
    const filterButtons = document.querySelectorAll('.service-filter');
    const serviceCards = document.querySelectorAll('.service-card, .additional-service');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter services
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filter === 'all' || cardCategory === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in-up', 'animate');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate');
                }
            });
        });
    });
}

// Service comparison functionality
function initializeServiceComparison() {
    const compareButtons = document.querySelectorAll('.compare-service');
    const comparisonPanel = document.querySelector('.comparison-panel');
    let selectedServices = [];
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            const serviceName = this.getAttribute('data-service-name');
            
            if (selectedServices.find(s => s.id === serviceId)) {
                // Remove from comparison
                selectedServices = selectedServices.filter(s => s.id !== serviceId);
                this.classList.remove('selected');
                this.textContent = 'Compare';
            } else if (selectedServices.length < 3) {
                // Add to comparison
                selectedServices.push({ id: serviceId, name: serviceName });
                this.classList.add('selected');
                this.textContent = 'Remove';
            } else {
                // Show limit message
                showNotification('You can compare up to 3 services at once.');
            }
            
            updateComparisonPanel();
        });
    });
    
    function updateComparisonPanel() {
        if (!comparisonPanel) return;
        
        if (selectedServices.length > 0) {
            comparisonPanel.style.display = 'block';
            const servicesList = comparisonPanel.querySelector('.selected-services');
            servicesList.innerHTML = selectedServices.map(service => 
                `<span class="selected-service">${service.name}</span>`
            ).join('');
        } else {
            comparisonPanel.style.display = 'none';
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// FAQ functionality for services
function initializeServicesFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Service request form functionality
function initializeServiceRequestForm() {
    const serviceForm = document.querySelector('.service-request-form');
    if (!serviceForm) return;
    
    const serviceSelects = serviceForm.querySelectorAll('select[name="service"]');
    const budgetRange = serviceForm.querySelector('input[name="budget"]');
    const budgetDisplay = serviceForm.querySelector('.budget-display');
    
    // Update budget display
    if (budgetRange && budgetDisplay) {
        budgetRange.addEventListener('input', function() {
            budgetDisplay.textContent = `$${parseInt(this.value).toLocaleString()}`;
        });
    }
    
    // Form submission
    serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Service request sent successfully! We\'ll get back to you soon.', 'success');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeServicesFAQ();
    initializeServiceRequestForm();
});

// Add dynamic styles
function addServicesPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-step {
            animation: stepPulse 0.6s ease-out;
        }
        
        @keyframes stepPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .case-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .case-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: var(--white);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            position: relative;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .case-modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--text-secondary);
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: var(--primary-color);
        }
        
        .modal-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        
        .modal-description {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .modal-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 30px;
        }
        
        .modal-tag {
            background: var(--light-background);
            color: var(--primary-color);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .modal-actions {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white);
            color: var(--primary-color);
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1001;
            border-left: 4px solid var(--accent-color);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #28a745;
        }
        
        .notification-error {
            border-left-color: #dc3545;
        }
        
        .comparison-panel {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--white);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            display: none;
            z-index: 100;
        }
        
        .selected-service {
            background: var(--accent-color);
            color: var(--white);
            padding: 5px 10px;
            border-radius: 15px;
            margin-right: 10px;
            font-size: 0.9rem;
        }
        
        .service-card.expanded {
            transform: scale(1.05);
            z-index: 10;
        }
        
        .compare-service.selected {
            background: var(--accent-color);
            color: var(--white);
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
document.addEventListener('DOMContentLoaded', addServicesPageStyles);

// Export functions for potential external use
window.ServicesPageJS = {
    initializeServiceCards,
    initializeProcessAnimation,
    initializePriceCalculator,
    showCaseModal,
    showNotification
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

// Optimize scroll events
window.addEventListener('scroll', debounce(function() {
    // Any scroll-based optimizations
}, 16));

// Service analytics tracking
function trackServiceInteraction(action, service) {
    // Analytics tracking would go here
    console.log(`Service interaction: ${action} on ${service}`);
}

// Add interaction tracking to service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            trackServiceInteraction('click', serviceName);
        });
    });
});

// Lazy loading for service images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);