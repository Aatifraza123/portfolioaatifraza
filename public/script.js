 
 // Theme Toggle
 
       const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        const themeIcon = themeToggle.querySelector('i');

        // Check for saved theme preference or default to 'light'
        const currentTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }

        // Mobile Menu Toggle
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');

        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Google Form submission
        const contactForm = document.getElementById('contactForm');
        const submitBtn = contactForm.querySelector('.btn');
        const successMessage = document.getElementById('successMessage');
        let submitted = false;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add loading state
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Sending...';
            
            // Set submitted flag
            submitted = true;
            
            // Submit form to Google Forms
            const formData = new FormData(contactForm);
            
            // Create a temporary form to submit to Google Forms
            const tempForm = document.createElement('form');
            tempForm.action = contactForm.action;
            tempForm.method = 'POST';
            tempForm.target = 'hidden_iframe';
            
            // Copy form data
            for (let [key, value] of formData.entries()) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                tempForm.appendChild(input);
            }
            
            document.body.appendChild(tempForm);
            tempForm.submit();
            document.body.removeChild(tempForm);
        });

        function formSubmitted() {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            
            // Show success message
            successMessage.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
            // Reset submitted flag
            submitted = false;
        }

        // Download Resume function
        function downloadResume() {
            // Create a link to the Google Drive resume
            const resumeUrl = 'https://drive.google.com/file/d/1dfMUw1_Gqi-zLfOndWdVj_LsI3hlY9fV/view?usp=drive_link';
            window.open(resumeUrl, '_blank');
        }

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, observerOptions);

        // Observe all sections for animations
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('loading');
            observer.observe(section);
        });

        // Skills animation on scroll
        const skillItems = document.querySelectorAll('.skill-item');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        skillItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
            skillObserver.observe(item);
        });

        // Project cards animation
        const projectCards = document.querySelectorAll('.project-card');
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, observerOptions);

        projectCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.8s ease';
            projectObserver.observe(card);
        });

        // Certificate cards animation
        const certificateCards = document.querySelectorAll('.certificate-card');
        const certificateObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, observerOptions);

        certificateCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            certificateObserver.observe(card);
        });

        // Typewriter effect for hero subtitle
        const typewriter = document.getElementById('typewriter');
        const cursor = document.querySelector('.cursor');
        const roles = [
            'B.Tech CSE Student',
            'Full Stack Developer',
            'MERN Stack Developer',
            'Java Programmer',
            'Python Developer',
            'Web Designer',
            'Software Engineer',
            'Database Administrator',
            'Machine Learning Enthusiast',
            'Problem Solver',
            'Tech Innovator',
            'Open Source Contributor'
        ];
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typewriter.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriter.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next
            }

            setTimeout(typeEffect, typeSpeed);
        }

        // Start typewriter effect when page loads
        window.addEventListener('load', () => {
            setTimeout(typeEffect, 1500);
        });

        // Add active class to current navigation item
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Add parallax effect to hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero');
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });

        // Add hover effect to social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Preloader (optional)
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // Add smooth reveal animation for elements
        const revealElements = document.querySelectorAll('.skill-item, .project-card, .certificate-card');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

        // Logout Button Functionality
// Logout Button Functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Clear any stored authentication data
        if (window.authToken) {
            delete window.authToken;
        }
        if (window.isLoggedIn) {
            window.isLoggedIn = false;
        }
        if (window.currentUser) {
            delete window.currentUser;
        }
        
        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Show logout message
        // alert('You have been logged out successfully!');

        // Redirect to auth page using the server route
        window.location.href = "/auth";
    });
}
