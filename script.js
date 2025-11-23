document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. THEME MANAGER & TOGGLE ---
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    // Applica tema salvato
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }

    const header = document.querySelector('.site-header');
    const navContainer = document.querySelector('.nav-links');

    // Creazione e Inserimento Toggle (Solo se l'header esiste)
    if (header) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Cambia tema');
        
        // Funzione per disegnare l'icona corretta
        const updateIcon = () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            // Icone SVG: Luna (Dark) vs Sole (Light)
            toggleBtn.innerHTML = isDark ? 
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' : 
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        };
        
        updateIcon(); // Set iniziale

        toggleBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            updateIcon();
        });
        
        // INSERIMENTO: Lo aggiungiamo all'HEADER come 3° elemento (Destra)
        header.appendChild(toggleBtn);

        // Mouse Tracking per il Toggle (Luce Liquida)
        toggleBtn.addEventListener('mousemove', (e) => {
            const rect = toggleBtn.getBoundingClientRect();
            toggleBtn.style.setProperty('--x', `${e.clientX - rect.left}px`);
            toggleBtn.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    }


    // --- 2. NAV MENU MORPHING CURSOR (Bolla Menu) ---
    if (navContainer) {
        const navItems = document.querySelectorAll('.nav-links a');
        
        // Crea la bolla
        const cursor = document.createElement('div');
        cursor.className = 'nav-liquid-cursor';
        navContainer.appendChild(cursor);

        function moveNavCursor(target) {
            const containerRect = navContainer.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const relLeft = targetRect.left - containerRect.left;
            
            cursor.style.width = `${targetRect.width}px`;
            cursor.style.transform = `translateX(${relLeft}px)`;
            cursor.style.opacity = '1';
        }

        navItems.forEach(link => {
            link.addEventListener('mouseenter', (e) => moveNavCursor(e.target));
            
            // Se è attivo al caricamento, posiziona la bolla
            if (link.classList.contains('active')) {
                // Piccolo ritardo per assicurare che il layout sia pronto
                setTimeout(() => moveNavCursor(link), 50);
            }
        });

        navContainer.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-links a.active');
            if (activeLink) {
                moveNavCursor(activeLink);
            } else {
                cursor.style.opacity = '0';
            }
        });
        
        // Aggiorna posizione al ridimensionamento finestra
        window.addEventListener('resize', () => {
            const activeLink = document.querySelector('.nav-links a.active');
            if (activeLink) moveNavCursor(activeLink);
        });
    }


    // --- 3. SOCIAL GRID MORPHING (Bolla Social) ---
    const socialContainer = document.querySelector('.social-container');
    if (socialContainer) {
        const socialItems = document.querySelectorAll('.social-icon-link');
        const socialCursor = document.createElement('div');
        socialCursor.className = 'social-liquid-cursor';
        socialContainer.appendChild(socialCursor);

        function moveSocialCursor(target) {
            const relLeft = target.offsetLeft;
            const relTop = target.offsetTop;
            socialCursor.style.transform = `translate3d(${relLeft}px, ${relTop}px, 0)`;
            socialCursor.style.opacity = '1';
        }

        socialItems.forEach(item => {
            // Usa 'closest' per gestire se il mouse entra sull'SVG interno
            item.addEventListener('mouseenter', (e) => {
                const target = e.target.closest('.social-icon-link');
                if (target) moveSocialCursor(target);
            });
        });

        socialContainer.addEventListener('mouseleave', () => {
            socialCursor.style.opacity = '0';
        });
        
        window.addEventListener('resize', () => {
            socialCursor.style.opacity = '0';
        });
    }


    // --- 4. ACTIVE GLASS TRACKING (Cards & Buttons & Git Rows) ---
    // Selettore universale per tutto ciò che deve illuminarsi col mouse
    const tiltElements = document.querySelectorAll('.tilt-card, .btn-apple, .git-row');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Inietta coordinate CSS
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);

            // TILT 3D (Solo se NON è una riga git, che deve rimanere piatta)
            if (!el.classList.contains('git-row') && !el.classList.contains('btn-apple')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4; 
                const rotateY = ((x - centerX) / centerX) * 4;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            }
            
            // TILT SPECIFICO PER I BOTTONI (Più leggero)
            if (el.classList.contains('btn-apple')) {
                 el.style.transform = `scale(1.02)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            // Reset trasformazioni
            if (!el.classList.contains('git-row')) {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }
        });
    });

    // --- 5. SCROLL DETECTION (Menu Glass) ---
    const handleScroll = () => {
        if (window.scrollY > 20) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check iniziale

});