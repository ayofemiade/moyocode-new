// About Page JavaScript
// Specific functionality for the About page

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
    initializeSkillAnimations();
    initializeCounterAnimations();
    initializeScrollAnimations();
    initializeToolsHover();
});

// Initialize about page specific features
function initializeAboutPage() {
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
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'about.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Animate skill bars when they come into view
function initializeSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length === 0) return;
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.getAttribute('data-percentage');
                
                // Add a slight delay for better visual effect
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                    
                    // Add a completion pulse effect
                    setTimeout(() => {
                        progressBar.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
                        setTimeout(() => {
                            progressBar.style.boxShadow = 'none';
                        }, 500);
                    }, 1500);
                }, 300);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Animate counters and statistics
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.counter, .stat-number');
    
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                
                if (isNaN(target)) return;
                
                let current = 0;
                const increment = target / 60; // Slower animation
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                        clearInterval(timer);
                        
                        // Add completion effect
                        counter.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            counter.style.transform = 'scale(1)';
                        }, 200);
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

// Initialize scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for grid items
                if (entry.target.parentElement.classList.contains('philosophy-grid') ||
                    entry.target.parentElement.classList.contains('advantages-grid') ||
                    entry.target.parentElement.classList.contains('tools-grid')) {
                    
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.philosophy-card, .skill-item, .tool-item, .advantage-item, .story-content, .story-image'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Enhanced tools section interactions
function initializeToolsHover() {
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach(tool => {
        tool.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'tool-ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        tool.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click effect for mobile
        tool.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1.05)';
            }, 150);
        });
    });
}

// Philosophy cards interaction
function initializePhilosophyCards() {
    const philosophyCards = document.querySelectorAll('.philosophy-card');
    
    philosophyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Subtle rotation effect
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
}

// Advantage items interaction
function initializeAdvantageItems() {
    const advantageItems = document.querySelectorAll('.advantage-item');
    
    advantageItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            // Highlight the number
            const number = this.querySelector('.advantage-number');
            if (number) {
                number.style.transform = 'scale(1.2) rotate(360deg)';
                number.style.background = 'linear-gradient(45deg, var(--primary-color), var(--accent-color))';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const number = this.querySelector('.advantage-number');
            if (number) {
                number.style.transform = 'scale(1) rotate(0deg)';
                number.style.background = 'var(--accent-color)';
            }
        });
    });
}

// Story section parallax effect
function initializeStoryParallax() {
    const storyImage = document.querySelector('.story-image');
    
    if (!storyImage) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        
        storyImage.style.transform = `translateY(${parallax}px)`;
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializePhilosophyCards();
    initializeAdvantageItems();
    initializeStoryParallax();
});

// Add CSS animations dynamically
function addAboutPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .tool-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple-effect 0.6s ease-out;
        }
        
        @keyframes ripple-effect {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
        
        .philosophy-card,
        .advantage-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .advantage-number {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .story-image {
            transition: transform 0.1s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
document.addEventListener('DOMContentLoaded', addAboutPageStyles);

// Export functions for potential external use
window.AboutPageJS = {
    initializeSkillAnimations,
    initializeCounterAnimations,
    initializeScrollAnimations
};

// Performance optimization: Debounce scroll events
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

// Add scroll performance optimization
window.addEventListener('scroll', debounce(function() {
    // Any scroll-based animations can be optimized here
}, 16)); // ~60fps