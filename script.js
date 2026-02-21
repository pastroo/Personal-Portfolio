/* =========================================
              START OF SCRIPT.JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. GESTIONE TEMA (CHIARO/SCURO)
       ========================================= */
    const body = document.body;
    // Cerca il bottone in base alla classe (o ID se l'hai aggiunto)
    const themeToggles = document.querySelectorAll('.theme-toggle'); 
    const savedTheme = localStorage.getItem('theme');
    
    // Applica il tema salvato al caricamento
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }

    // Aggiungi l'evento a tutti i bottoni toggle (nel caso ce ne sia più di uno, es. mobile/desktop)
    themeToggles.forEach(toggleBtn => {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    });

    /* =========================================
       2. CURSORE LIQUIDO NAVIGAZIONE (IOS STYLE)
       ========================================= */
    const navContainer = document.querySelector('.nav-links');
    
    if (navContainer) {
        const navItems = document.querySelectorAll('.nav-links a');
        
        // Crea l'elemento cursore e aggiungilo alla navbar
        const cursor = document.createElement('div');
        cursor.className = 'nav-liquid-cursor';
        navContainer.appendChild(cursor);

        // Funzione per muovere e ridimensionare il cursore
        const moveCursor = (target) => {
            if (!target) return;
            const containerRect = navContainer.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            // Calcola la posizione relativa all'interno del contenitore
            const left = targetRect.left - containerRect.left;
            
            cursor.style.width = `${targetRect.width}px`;
            cursor.style.transform = `translateX(${left}px)`;
            cursor.style.opacity = '1';
        };

        // Inizializza la posizione sulla voce di menu attiva al caricamento
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink) {
            // Piccolo delay per permettere al font di caricarsi e calcolare le dimensioni esatte
            setTimeout(() => moveCursor(activeLink), 50);
        }

        // Gestione Hover
        navItems.forEach(link => {
            link.addEventListener('mouseenter', (e) => moveCursor(e.target));
        });

        // Quando il mouse esce dalla navbar, torna all'elemento attivo
        navContainer.addEventListener('mouseleave', () => {
            const currentActive = document.querySelector('.nav-links a.active');
            if (currentActive) {
                moveCursor(currentActive);
            } else {
                cursor.style.opacity = '0';
            }
        });

        // Ricalcola la posizione in caso di ridimensionamento della finestra
        window.addEventListener('resize', () => {
            const currentActive = document.querySelector('.nav-links a.active');
            if (currentActive) moveCursor(currentActive);
        });
    }

    /* =========================================
       3. RILEVAMENTO SCROLL (Per effetti Navbar)
       ========================================= */
    const handleScroll = () => {
        if (window.scrollY > 20) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Controllo iniziale

    /* =========================================
       4. INDICATORE STATO LIVE TWITCH
       ========================================= */
    const liveLinks = document.querySelectorAll('.live-menu-item');
    
    // CONFIGURAZIONE MANUALE:
    // Imposta su 'true' quando vai in live, 'false' quando sei offline.
    const isBroadcasting = false; 

    if (isBroadcasting) {
        liveLinks.forEach(link => {
            link.classList.add('is-live');
            link.setAttribute('title', 'Attualmente in Live su Twitch!');
        });
    }

});

/* =========================================
              END OF SCRIPT.JS
   ========================================= */