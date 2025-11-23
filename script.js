/* =========================================
              START OF SCRIPT.JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- Toggle and Theme Manager --- */
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }

    const header = document.querySelector('.site-header');
    const navContainer = document.querySelector('.nav-links');

    if (header) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Cambia tema');
        
        const updateIcon = () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            toggleBtn.innerHTML = isDark ? 
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' : 
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        };
        
        updateIcon();

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
        
        header.appendChild(toggleBtn);

        toggleBtn.addEventListener('mousemove', (e) => {
            const rect = toggleBtn.getBoundingClientRect();
            toggleBtn.style.setProperty('--x', `${e.clientX - rect.left}px`);
            toggleBtn.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    }

    /* --- Navigation Menu Morphing Cursor --- */
    if (navContainer) {
        const navItems = document.querySelectorAll('.nav-links a');
        
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
            
            if (link.classList.contains('active')) {
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
        
        window.addEventListener('resize', () => {
            const activeLink = document.querySelector('.nav-links a.active');
            if (activeLink) moveNavCursor(activeLink);
        });
    }


    /* --- Social Grid Morphing --- */
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


    /* --- Active Glass Tracking --- */
    const tiltElements = document.querySelectorAll('.tilt-card, .btn-apple, .git-row');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);

            if (!el.classList.contains('git-row') && !el.classList.contains('btn-apple')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4; 
                const rotateY = ((x - centerX) / centerX) * 4;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            }
            
            if (el.classList.contains('btn-apple')) {
                 el.style.transform = `scale(1.02)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            if (!el.classList.contains('git-row')) {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }
        });
    });

    /* --- Scroll Detection --- */
    const handleScroll = () => {
        if (window.scrollY > 20) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

});

/* =========================================
              END OF SCRIPT.JS
   ========================================= */