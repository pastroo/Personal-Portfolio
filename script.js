document.addEventListener('DOMContentLoaded', () => {
    // 1. Light / Dark Theme Engine
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateButtonUI(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        
        updateButtonUI(newTheme);
    });

    function updateButtonUI(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeToggle.innerHTML = '<span id="theme-icon">☀️</span> Light Theme';
        } else {
            themeIcon.textContent = '🌙';
            themeToggle.innerHTML = '<span id="theme-icon">🌙</span> Dark Theme';
        }
    }

    // 2. Scroll Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Typewriter Effect Homepage
    const typewriterElement = document.getElementById('typewriter');
    
    if (typewriterElement) {
        const textArray = ["Riccardo.", "a Developer.", "a Student."];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = textArray[textIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 1500; // Pause at End
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textArray.length;
                typeSpeed = 500; // Pause Before Restarting
            }

            setTimeout(type, typeSpeed);
        }

        // Starting
        setTimeout(type, 1000);
    }
});