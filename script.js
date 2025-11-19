// Navigation Toggle for Mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.rstory-nav-toggle');
    const navMenu = document.querySelector('.rstory-nav-menu');
    const body = document.querySelector('body');
    
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.rstory-nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            body.style.overflow = ''; // Restore scroll
            
            // Update active state
            setActiveNavLink(this);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Function to set active navigation link
    function setActiveNavLink(clickedLink) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
    }
    
    // Scroll spy to update active nav link based on section in view
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        // Find the current section in view
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });
        
        // If we're at the very top of the page, set Home as active
        if (scrollPos < 100) {
            currentSectionId = 'home';
        }
        
        // Update active nav link
        if (currentSectionId) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to corresponding link
            const activeLink = document.querySelector(`.rstory-nav-menu a[href="#${currentSectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Initialize active nav on page load
    updateActiveNavOnScroll();
    
    // Update active nav on scroll with throttle for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                updateActiveNavOnScroll();
            }, 100);
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Update active state
            setActiveNavLink(this);
        });
    });
    
    /// Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('rstory-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('rstory-theme', newTheme);
    });
    
    // Intersection Observer untuk animasi card
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.rstory-story-card, .rstory-category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Close menu on window resize (if resizing to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Set Home as active by default on page load
    const homeLink = document.querySelector('.rstory-nav-menu a[href="#home"]');
    if (homeLink && !document.querySelector('.rstory-nav-menu a.active')) {
        homeLink.classList.add('active');
    }
});