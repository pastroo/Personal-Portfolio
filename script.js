document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestione Tema Chiaro/Scuro (Glassmorphism)
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

    // 2. Animazioni allo scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Ferma l'osservazione una volta animato
            }
        });
    }, {
        threshold: 0.1, // Attiva l'animazione quando il 10% dell'elemento è visibile
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Effetto Typewriter (Macchina da scrivere) solo per la Home
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
                typeSpeed = 2000; // Pausa alla fine della parola
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textArray.length;
                typeSpeed = 500; // Pausa prima di iniziare nuova parola
            }

            setTimeout(type, typeSpeed);
        }

        // Inizia l'animazione
        setTimeout(type, 1000);
    }
});