document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNavigation();
    initSmoothScrolling();
    initTabSwitching();
    initScrollAnimations();
    initCounterAnimations();
    initProgressBars();
    initHoverEffects();
    initLazyLoading();
    initScrollToTop();
    initAccordion();
    initImageSlider();
    
    // Enhanced Mobile Navigation
    function initMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        // Create nav toggle button if it doesn't exist
        if (!navToggle && navLinks) {
            createMobileToggle();
        }
        
        const toggle = navToggle || document.querySelector('.nav-toggle');
        if (!toggle || !navLinks) return;

        // Create overlay
        let overlay = document.querySelector('.mobile-nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-nav-overlay';
            document.body.appendChild(overlay);
        }

        // Create hamburger spans if they don't exist
        if (toggle.children.length === 0) {
            for (let i = 0; i < 3; i++) {
                const span = document.createElement('span');
                toggle.appendChild(span);
            }
        }

        // Enhanced toggle menu function
        function toggleMobileMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            navLinks.classList.add('active');
            overlay.classList.add('active');
            toggle.classList.add('active');
            document.body.classList.add('nav-open');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Add escape key listener
            document.addEventListener('keydown', handleEscapeKey);
        }

        function closeMobileMenu() {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            toggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Remove escape key listener
            document.removeEventListener('keydown', handleEscapeKey);
            
            // Close all dropdowns
            closeAllDropdowns();
        }

        function handleEscapeKey(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        }

        // Mobile dropdown functionality
        function initMobileDropdowns() {
            const dropdowns = navLinks.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');
                const submenu = dropdown.querySelector('.dropdown-menu');
                
                if (link && submenu) {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Close other dropdowns
                        dropdowns.forEach(other => {
                            if (other !== dropdown) {
                                other.classList.remove('active');
                            }
                        });
                        
                        // Toggle current dropdown
                        dropdown.classList.toggle('active');
                    });
                }
            });
        }

        function closeAllDropdowns() {
            const dropdowns = navLinks.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }

        // Event listeners
        toggle.addEventListener('click', toggleMobileMenu);
        overlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on a link (except dropdown toggles)
        navLinks.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && !link.parentElement.classList.contains('dropdown')) {
                closeMobileMenu();
            }
        });

        // Initialize mobile dropdowns
        initMobileDropdowns();

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            }, 250);
        });

        // Handle orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            }, 500);
        });
    }

    function createMobileToggle() {
        const navContainer = document.querySelector('.main-nav .container');
        if (!navContainer) return;

        const toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Toggle navigation');
        toggle.setAttribute('aria-expanded', 'false');

        // Create hamburger spans
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            toggle.appendChild(span);
        }

        // Insert toggle button
        navContainer.appendChild(toggle);

        // Update aria-expanded attribute
        toggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Media query handler for responsive behavior
    function handleMediaQuery(e) {
        if (e.matches) {
            // Desktop behavior
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
    }

    // Initialize media query listener
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    mediaQuery.addListener(handleMediaQuery);

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                        const targetPosition = target.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Tab switching functionality
    function initTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (tabButtons.length === 0) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding content
                const content = document.getElementById(targetTab);
                if (content) {
                    content.classList.add('active');
                }
            });
        });
    }

    // Scroll animations using Intersection Observer
    function initScrollAnimations() {
        if (!window.IntersectionObserver) return; // Skip if not supported

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.feature-card, .program-card, .attribute-card, .pillar-card, .skill-card, .outcome-category'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // Counter animations
    function initCounterAnimations() {
        if (!window.IntersectionObserver) return;

        const statsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent;
                    const end = parseInt(text.replace(/[^\d]/g, ''));
                    const suffix = text.replace(/[\d]/g, '');
                    
                    if (!isNaN(end) && end > 0) {
                        animateCounter(el, 0, end, suffix, 2000);
                    }
                    statsObserver.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.stat-number').forEach(stat => {
            if (stat) statsObserver.observe(stat);
        });
    }

    // Counter animation function
    function animateCounter(element, start, end, suffix, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const value = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // Progress bar animations
    function initProgressBars() {
        if (!window.IntersectionObserver) return;

        const progressObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.dataset.width || bar.style.width;
                    
                    if (targetWidth) {
                        bar.style.width = '0%';
                        bar.style.transition = 'width 1.5s ease-out';
                        
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 200);
                    }
                    
                    progressObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.bar-fill').forEach(bar => {
            if (bar) progressObserver.observe(bar);
        });
    }

    // Hover effects
    function initHoverEffects() {
        // Only add hover effects on non-touch devices
        if (!('ontouchstart' in window)) {
            const hoverElements = document.querySelectorAll(
                '.btn, .feature-card, .program-card, .attribute-card, .pillar-card, .skill-card'
            );
            
            hoverElements.forEach(el => {
                el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                
                el.addEventListener('mouseenter', () => {
                    el.style.transform = 'translateY(-5px) scale(1.02)';
                });
                
                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    }

    // Lazy loading for images
    function initLazyLoading() {
        if (!window.IntersectionObserver) {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
            return;
        }

        const imgObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        imgObserver.unobserve(img);
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }

    // Scroll to top button
    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed; 
            bottom: 20px; 
            right: 20px;
            background: #b91c1c; 
            color: white; 
            border: none;
            border-radius: 50%; 
            width: 50px; 
            height: 50px;
            font-size: 20px; 
            cursor: pointer;
            opacity: 0; 
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000; 
            box-shadow: 0 4px 12px rgba(185,28,28,0.3);
        `;
        document.body.appendChild(scrollBtn);

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Show/hide button based on scroll position
        let ticking = false;
        function updateScrollButton() {
            const shouldShow = window.pageYOffset > 300;
            scrollBtn.style.opacity = shouldShow ? '1' : '0';
            scrollBtn.style.visibility = shouldShow ? 'visible' : 'hidden';
            scrollBtn.style.transform = shouldShow ? 'translateY(0)' : 'translateY(20px)';
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollButton);
                ticking = true;
            }
        });
    }

    // Accordion functionality
    function initAccordion() {
        document.querySelectorAll('.accordion').forEach(accordion => {
            const items = accordion.querySelectorAll('.accordion-item');
            
            items.forEach((item, index) => {
                const header = item.querySelector('.accordion-item-header');
                const wrapper = item.querySelector('.accordion-item-description-wrapper');
                
                if (!header || !wrapper) return;
                
                // Set initial state
                if (index === 0) {
                    item.classList.add('open');
                    wrapper.style.display = 'block';
                } else {
                    wrapper.style.display = 'none';
                }
                
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isOpen = item.classList.contains('open');
                    
                    // Close all items
                    items.forEach(i => {
                        i.classList.remove('open');
                        const w = i.querySelector('.accordion-item-description-wrapper');
                        if (w) w.style.display = 'none';
                    });
                    
                    // Open clicked item if it wasn't already open
                    if (!isOpen) {
                        item.classList.add('open');
                        wrapper.style.display = 'block';
                    }
                });
            });
        });
    }

    // Image slider functionality
    function initImageSlider() {
        const slides = document.querySelectorAll('.main-slider .slider-slide');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        const dots = document.querySelectorAll('.slider-dots .dot');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval;
        let isTransitioning = false;

        function showSlide(index) {
            if (isTransitioning) return;
            isTransitioning = true;
            
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
            
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }

        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // Initialize
        showSlide(0);
        startAutoSlide();

        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoSlide();
                showSlide(index);
                startAutoSlide();
            });
        });

        // Pause on hover (desktop only)
        const slider = document.querySelector('.main-slider');
        if (slider && !('ontouchstart' in window)) {
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);
        }

        // Touch/swipe support for mobile
        if ('ontouchstart' in window && slider) {
            let touchStartX = 0;
            let touchEndX = 0;

            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    stopAutoSlide();
                    if (diff > 0) {
                        nextSlide(); // Swipe left - next slide
                    } else {
                        prevSlide(); // Swipe right - previous slide
                    }
                    startAutoSlide();
                }
            }
        }
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Expose utility functions globally
    window.SOCIUtils = { 
        debounce, 
        throttle
    };

    console.log('SOCI website scripts loaded successfully');
});