document.addEventListener('DOMContentLoaded', () => {
    
    // 1. THEME MANAGER
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }

    const navContainer = document.querySelector('.nav-links');
    
    // Inserimento Toggle Button DENTRO .nav-links
    if (navContainer) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        
        const isDark = body.getAttribute('data-theme') === 'dark';
        toggleBtn.innerHTML = isDark ? 'Mode: Dark' : 'Mode: Light';
        toggleBtn.setAttribute('aria-label', 'Cambia tema');
        
        toggleBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                toggleBtn.innerHTML = 'Mode: Light';
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggleBtn.innerHTML = 'Mode: Dark';
            }
        });
        
        // Lo inseriamo DENTRO la nav-links per condividere la bolla
        navContainer.appendChild(toggleBtn);
    }


    // 2. NAV MENU MORPHING CURSOR (Link + Toggle)
    if (navContainer) {
        // Ora tracciamo ANCHE il bottone
        const navItems = document.querySelectorAll('.nav-links a, .nav-links button');
        
        const cursor = document.createElement('div');
        cursor.className = 'nav-liquid-cursor';
        navContainer.appendChild(cursor); // La bolla vive qui dentro

        function moveNavCursor(target) {
            const containerRect = navContainer.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            // Calcolo posizione relativa
            const relLeft = targetRect.left - containerRect.left;
            
            cursor.style.width = `${targetRect.width}px`;
            cursor.style.transform = `translateX(${relLeft}px)`;
            cursor.style.opacity = '1';
        }

        navItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                moveNavCursor(e.target);
            });
            
            // Se è il link attivo, posiziona la bolla lì all'avvio
            if (item.classList.contains('active')) {
                setTimeout(() => moveNavCursor(item), 50);
            }
        });

        navContainer.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-links a.active');
            if (activeLink) {
                moveNavCursor(activeLink);
            } else {
                // Se non c'è link attivo nascondi bolla
                cursor.style.opacity = '0';
            }
        });
        
        window.addEventListener('resize', () => {
            const activeLink = document.querySelector('.nav-links a.active');
            if (activeLink) moveNavCursor(activeLink);
        });
    }

    // 3. SOCIAL GRID MORPHING
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
            item.addEventListener('mouseenter', (e) => moveSocialCursor(e.target.closest('.social-icon-link')));
        });
        socialContainer.addEventListener('mouseleave', () => socialCursor.style.opacity = '0');
        window.addEventListener('resize', () => socialCursor.style.opacity = '0');
    }

    // --- 4. ACTIVE GLASS TRACKING (Cards, Buttons & Git Rows) ---
    // Abbiamo aggiunto .git-row al selettore
    const tiltElements = document.querySelectorAll('.tilt-card, .tilt-card-button, .git-row');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Inietta coordinate per la luce CSS
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);

            // Applica il TILT 3D solo se NON è una riga del git (le righe sono piatte, il contenitore si muove)
            if (!el.classList.contains('git-row')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4; 
                const rotateY = ((x - centerX) / centerX) * 4;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            // Reset solo per gli elementi che ruotano
            if (!el.classList.contains('git-row')) {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }
        });
    });
});