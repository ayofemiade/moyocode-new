// Portfolio Page JavaScript
// Specific functionality for the Portfolio page

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioPage();
    initializePortfolioFilter();
    initializeViewToggle();
    initializePortfolioModals();
    initializeScrollAnimations();
    initializeLightbox();
    initializePortfolioSearch();
    initializeInfiniteScroll();
});

// Portfolio data (in a real application, this would come from an API)
const portfolioData = {
    'locoba': {
        title: 'LOCOBA - Loyola Old Boys Association',
        category: 'Web Development',
        description: 'A comprehensive alumni networking platform for Loyola College old boys, featuring event management, member directory, and community engagement tools.',
        client: 'Loyola Old Boys Association',
        date: '2024',
        url: 'https://locoba.org',
        tags: ['React', 'Node.js', 'MongoDB', 'Event Management'],
        features: [
            { title: 'Alumni Directory', description: 'Searchable member database with professional profiles' },
            { title: 'Event Management', description: 'Future and past event organization and registration' },
            { title: 'Networking Hub', description: 'Professional networking and mentorship connections' },
            { title: 'News & Updates', description: 'Alumni news, achievements, and association updates' }
        ],
        challenge: 'Building a platform that could effectively connect alumni across different graduation years while maintaining privacy and professional networking standards.',
        solution: 'Implemented robust privacy controls, professional networking features, and intuitive event management system.',
        result: 'Increased alumni engagement by 250% and successful organization of multiple networking events with high attendance rates.'
    },
    'bgms': {
        title: 'BGMS Foundation - Non-Profit Website',
        category: 'Web Development',
        description: 'A modern, accessible website for a non-profit organization focused on community development and social impact.',
        client: 'BGMS Foundation',
        date: '2024',
        url: 'https://badekumissionary.org',
        tags: ['WordPress', 'PHP', 'MySQL', 'Accessibility'],
        features: [
            { title: 'Donation System', description: 'Secure online donation processing' },
            { title: 'Event Management', description: 'Community event organization tools' },
            { title: 'Volunteer Portal', description: 'Volunteer registration and management' },
            { title: 'Impact Tracking', description: 'Visual representation of foundation impact' }
        ],
        challenge: 'Building an accessible website that meets WCAG 2.1 AA standards while maintaining visual appeal.',
        solution: 'Implemented comprehensive accessibility features, semantic HTML, and thorough testing with screen readers.',
        result: 'Increase in online donations and growth in volunteer registrations.'
    },
    'sbo': {
        title: 'SBO Foundation - Community Impact Website',
        category: 'Web Development',
        description: 'A comprehensive foundation website dedicated to community giving and social impact, featuring donation systems, project showcases, and impact tracking.',
        client: 'SBO Foundation',
        date: '2023',
        url: 'https://sbofoundation.ng',
        tags: ['Vue.js', 'Laravel', 'PostgreSQL', 'Payment Gateway'],
        features: [
            { title: 'Donation System', description: 'Secure online donation processing with multiple payment options' },
            { title: 'Project Showcase', description: 'Visual presentation of community projects and initiatives' },
            { title: 'Impact Tracking', description: 'Real-time tracking and reporting of foundation impact' },
            { title: 'Volunteer Portal', description: 'Community volunteer registration and engagement platform' }
        ],
        challenge: 'Creating a trustworthy platform that would inspire confidence in donors and effectively showcase the foundation\'s community impact.',
        solution: 'Implemented transparent reporting systems, secure payment processing, and compelling visual storytelling of community projects.',
        result: 'Significant increase in online donations and expanded community reach, with the founder testifying to measurable growth in contributions.'
    },
    'funmilola': {
        title: 'Funmilola Adetoye - Personal Brand',
        category: 'Branding & Web Design',
        description: 'Complete brand identity and website design for a professional consultant, including logo design, brand guidelines, and responsive website.',
        client: 'Funmilola Adetoye',
        date: '2023',
        url: 'https://funmilolaadetoye.com',
        tags: ['Branding', 'UI/UX', 'WordPress', 'SEO'],
        features: [
            { title: 'Brand Identity', description: 'Logo design and brand guidelines' },
            { title: 'Professional Website', description: 'Responsive portfolio and blog' },
            { title: 'SEO Optimization', description: 'Search engine optimization strategy' },
            { title: 'Content Strategy', description: 'Content planning and creation guidelines' }
        ],
        challenge: 'Creating a distinctive brand identity that reflects professionalism while standing out in a competitive market.',
        solution: 'Developed a unique visual identity with consistent messaging across all touchpoints.',
        result: 'Increase in website traffic and growth in client inquiries within 3 months.'
    }
};

// Initialize portfolio page specific features
function initializePortfolioPage() {
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
    
    // Initialize portfolio statistics animation
    initializeStatsAnimation();
    
    // Initialize masonry layout
    initializeMasonryLayout();
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'portfolio.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Portfolio filter functionality
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items with animation
            portfolioItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filter === 'all' || itemCategory === filter) {
                    // Show item with staggered animation
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.classList.add('fade-in', 'animate');
                    }, index * 100);
                } else {
                    // Hide item
                    item.classList.remove('animate');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update URL without page reload
            const url = new URL(window.location);
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            window.history.pushState({}, '', url);
        });
    });
    
    // Apply filter from URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter');
    if (filterFromUrl) {
        const filterButton = document.querySelector(`[data-filter="${filterFromUrl}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
}

// View toggle functionality (grid/list/masonry)
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (!portfolioGrid) return;
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid class
            portfolioGrid.className = 'portfolio-grid';
            if (view !== 'grid') {
                portfolioGrid.classList.add(view + '-view');
            }
            
            // Reinitialize masonry if needed
            if (view === 'masonry') {
                setTimeout(initializeMasonryLayout, 300);
            }
            
            // Save preference
            localStorage.setItem('portfolioView', view);
        });
    });
    
    // Load saved view preference
    const savedView = localStorage.getItem('portfolioView');
    if (savedView) {
        const viewButton = document.querySelector(`[data-view="${savedView}"]`);
        if (viewButton) {
            viewButton.click();
        }
    }
}

// Portfolio modals functionality
function initializePortfolioModals() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            if (projectId && portfolioData[projectId]) {
                showCaseStudyModal(portfolioData[projectId]);
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Global functions for HTML onclick handlers
function openCaseStudy(projectId) {
    if (portfolioData[projectId]) {
        showCaseStudyModal(portfolioData[projectId]);
    }
}

function closeCaseStudy() {
    const modal = document.querySelector('.case-study-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Get project image based on project data
function getProjectImage(project) {
    const imageMap = {
        'locoba': 'images/locoba-alumni-website-homepage.png',
        'bgms': 'images/badeku-missionary-website-homepage.png',
        'sbo': 'images/sbo-foundation-website-homepage.png',
        'funmilola': 'images/portfolio-website-homepage.png'
    };
    
    // If project is an object, get the key from portfolioData
    if (typeof project === 'object') {
        const projectKey = Object.keys(portfolioData).find(key => portfolioData[key] === project);
        return imageMap[projectKey] || 'images/locoba-alumni-website-homepage.png';
    }
    
    // If project is a string key
    return imageMap[project] || 'images/locoba-alumni-website-homepage.png';
}

// Show case study modal
function showCaseStudyModal(project) {
    // Get existing modal or create new one
    let modal = document.querySelector('.case-study-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'case-study-modal';
        document.body.appendChild(modal);
    }
    
    // Create or update modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header" style="background-image: url('${getProjectImage(project)}');">
                <button class="modal-close" onclick="closeCaseStudy()">&times;</button>
            </div>
            <div class="modal-body">
                <h2 class="modal-title">${project.title}</h2>
                <p class="modal-subtitle">${project.category}</p>
                
                <div class="modal-section">
                    <h3>📋 Project Overview</h3>
                    <p class="modal-description">${project.description}</p>
                    <div class="modal-meta">
                        <span class="modal-client">Client: ${project.client}</span>
                        <span class="modal-date">Year: ${project.date}</span>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>🎯 Challenge</h3>
                    <p class="modal-challenge">${project.challenge}</p>
                </div>
                
                <div class="modal-section">
                    <h3>💡 Solution</h3>
                    <p class="modal-solution">${project.solution}</p>
                </div>
                
                <div class="modal-section">
                    <h3>📈 Results</h3>
                    <p class="modal-result">${project.result}</p>
                </div>
                
                <div class="modal-section">
                    <h3>⚡ Key Features</h3>
                    <div class="modal-features">
                        ${project.features.map(feature => `
                            <div class="feature-item">
                                <div class="feature-title">${feature.title}</div>
                                <div class="feature-description">${feature.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>🛠️ Technologies Used</h3>
                    <div class="modal-tags">
                        ${project.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <a href="${project.url}" target="_blank" class="btn-primary">View Live Project</a>
                    <a href="contact.html" class="btn-secondary">Start Similar Project</a>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCaseStudy();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeCaseStudy();
        }
    });
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Statistics animation
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const originalText = statNumber.textContent;
                
                // Special handling for "24/7" format
                if (originalText.includes('24/7') || originalText.includes('24<span') || originalText.includes('24 <span')) {
                    // Don't animate 24/7, just ensure it displays correctly
                    statNumber.innerHTML = '24<span class="stat-separator">/</span>7';
                    statsObserver.unobserve(statNumber);
                    return;
                }
                
                const target = parseInt(originalText.replace(/[^0-9]/g, ''));
                const suffix = originalText.replace(/[0-9]/g, '');
                
                if (isNaN(target)) return;
                
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        statNumber.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = Math.floor(current) + suffix;
                    }
                }, 50);
                
                statsObserver.unobserve(statNumber);
            }
        });
    }, { threshold: 0.7 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
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
                
                // Special handling for portfolio grid
                if (entry.target.classList.contains('portfolio-grid')) {
                    const items = entry.target.querySelectorAll('.portfolio-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in', 'animate');
                        }, index * 100);
                    });
                }
                
                // Special handling for tech grid
                if (entry.target.classList.contains('tech-grid')) {
                    const items = entry.target.querySelectorAll('.tech-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('scale-in', 'animate');
                        }, index * 50);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.portfolio-stats, .portfolio-grid, .tech-grid, .featured-grid'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Lightbox functionality for portfolio images
function initializeLightbox() {
    const portfolioImages = document.querySelectorAll('.portfolio-image img');
    
    portfolioImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            showLightbox(this.src, this.alt);
        });
    });
}

// Show lightbox
function showLightbox(imageSrc, imageAlt) {
    // Create lightbox if it doesn't exist
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Add close functionality
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            lightbox.classList.remove('show');
        });
        
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => {
            lightbox.classList.remove('show');
        });
    }
    
    // Update lightbox content
    lightbox.querySelector('.lightbox-image').src = imageSrc;
    lightbox.querySelector('.lightbox-image').alt = imageAlt;
    lightbox.querySelector('.lightbox-caption').textContent = imageAlt;
    
    // Show lightbox
    lightbox.classList.add('show');
}

// Portfolio search functionality
function initializePortfolioSearch() {
    const searchInput = document.querySelector('.portfolio-search');
    if (!searchInput) return;
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        portfolioItems.forEach(item => {
            const title = item.querySelector('.portfolio-title').textContent.toLowerCase();
            const description = item.querySelector('.portfolio-description').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.portfolio-tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            if (matches) {
                item.style.display = 'block';
                item.classList.add('fade-in', 'animate');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate');
            }
        });
    });
}

// Masonry layout initialization
function initializeMasonryLayout() {
    const grid = document.querySelector('.portfolio-grid.masonry');
    if (!grid) return;
    
    // Simple masonry implementation
    const items = grid.querySelectorAll('.portfolio-item');
    const columnCount = getComputedStyle(grid).columnCount;
    
    if (columnCount !== 'auto') {
        items.forEach((item, index) => {
            item.style.breakInside = 'avoid';
            item.style.marginBottom = '40px';
        });
    }
}

// Infinite scroll functionality
function initializeInfiniteScroll() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;
    
    let loading = false;
    let page = 1;
    
    const loadMoreItems = () => {
        if (loading) return;
        loading = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real application, this would fetch more items from an API
            console.log(`Loading page ${page + 1}`);
            page++;
            loading = false;
        }, 1000);
    };
    
    // Check if user scrolled to bottom
    window.addEventListener('scroll', debounce(() => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            loadMoreItems();
        }
    }, 100));
}

// Add dynamic styles for portfolio page
function addPortfolioPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .lightbox.show {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 10px;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 2rem;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .lightbox-caption {
            color: white;
            margin-top: 15px;
            font-size: 1.1rem;
        }
        
        .portfolio-search {
            width: 100%;
            max-width: 400px;
            padding: 15px 20px;
            border: 2px solid var(--light-gray);
            border-radius: 50px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: var(--white);
        }
        
        .portfolio-search:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        
        .portfolio-item.fade-in {
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
        
        .loading-spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid var(--light-gray);
            border-radius: 50%;
            border-top-color: var(--accent-color);
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
document.addEventListener('DOMContentLoaded', addPortfolioPageStyles);

// Export functions for potential external use
window.PortfolioPageJS = {
    initializePortfolioFilter,
    initializeViewToggle,
    showCaseStudyModal,
    showLightbox
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

// Portfolio analytics tracking
function trackPortfolioInteraction(action, project) {
    // Analytics tracking would go here
    console.log(`Portfolio interaction: ${action} on ${project}`);
}

// Add interaction tracking
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectName = this.querySelector('.portfolio-title').textContent;
            trackPortfolioInteraction('view', projectName);
        });
    });
});

// Keyboard navigation for portfolio items
function initializeKeyboardNavigation() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let currentIndex = -1;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, portfolioItems.length - 1);
            portfolioItems[currentIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            portfolioItems[currentIndex].focus();
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            portfolioItems[currentIndex].click();
        }
    });
    
    // Make portfolio items focusable
    portfolioItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('focus', () => {
            currentIndex = index;
        });
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', initializeKeyboardNavigation);

// Lazy loading for portfolio images
function initializePortfolioLazyLoading() {
    const images = document.querySelectorAll('.portfolio-image img[data-src]');
    
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
document.addEventListener('DOMContentLoaded', initializePortfolioLazyLoading);