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
    
        /* =========================================
        LOGICA UNITO (Navigazione Flat)
        ========================================= */

        // Helper per gestire le transizioni
        function switchView(targetId) {
            const sections = document.querySelectorAll('.view-section');
            sections.forEach(s => s.style.display = 'none');
            
            const target = document.getElementById(targetId);
            target.style.display = (targetId === 'view-files') ? 'block' : 'grid';
            
            target.classList.remove('fade-in');
            void target.offsetWidth; // Trigger reflow
            target.classList.add('fade-in');
        }

        // 1. Apertura Anno -> Mostra Semestri
        window.openYear = function(anno) {
            const semView = document.getElementById('view-semesters');
            document.getElementById('unito-breadcrumb').innerHTML = `<span onclick="resetUniToView()">UniTO</span> / ${anno}`;
            document.getElementById('unito-title').innerText = anno + ".";

            semView.innerHTML = `
                <div class="glass-card" onclick="openSemester('${anno}', 'Primo Semestre')">
                    <div class="card-icon-wrapper">1️⃣</div>
                    <div class="hud-data">Periodo</div>
                    <h3>Primo Semestre</h3>
                    <p>Visualizza le materie</p>
                </div>
                <div class="glass-card" onclick="openSemester('${anno}', 'Secondo Semestre')">
                    <div class="card-icon-wrapper">2️⃣</div>
                    <div class="hud-data">Periodo</div>
                    <h3>Secondo Semestre</h3>
                    <p>Visualizza le materie</p>
                </div>
            `;
            switchView('view-semesters');
        };

        // 2. Apertura Semestre -> Mostra Materie
        window.openSemester = function(anno, semestre) {
            const subjView = document.getElementById('view-subjects');
            document.getElementById('unito-breadcrumb').innerHTML = `<span onclick="resetUniToView()">UniTO</span> / <span onclick="openYear('${anno}')">${anno}</span> / ${semestre}`;
            document.getElementById('unito-title').innerText = "Materie.";

            subjView.innerHTML = `
                <div class="glass-card" onclick="openSubject('${anno}', '${semestre}', 'Materia 1')">
                    <div class="card-icon-wrapper">📚</div>
                    <div class="hud-data">Corso</div>
                    <h3>Materia 1</h3>
                    <p>Esplora i laboratori</p>
                </div>
                <div class="glass-card" onclick="openSubject('${anno}', '${semestre}', 'Materia 2')">
                    <div class="card-icon-wrapper">💻</div>
                    <div class="hud-data">Corso</div>
                    <h3>Materia 2</h3>
                    <p>Esplora i laboratori</p>
                </div>
            `;
            switchView('view-subjects');
        };

        // 3. Apertura Materia -> Mostra Laboratori
        window.openSubject = function(anno, semestre, materia) {
            const labsView = document.getElementById('view-labs');
            document.getElementById('unito-breadcrumb').innerHTML = `<span onclick="openYear('${anno}')">${anno}</span> / <span onclick="openSemester('${anno}','${semestre}')">${semestre}</span> / ${materia}`;
            document.getElementById('unito-title').innerText = "Laboratori.";

            labsView.innerHTML = `
                <div class="glass-card" onclick="openLab('${anno}', '${semestre}', '${materia}', 'Laboratorio 1')">
                    <div class="card-icon-wrapper">📁</div>
                    <div class="hud-data">Directory</div>
                    <h3>Laboratorio 1</h3>
                    <p>File ed esercizi</p>
                </div>
            `;
            switchView('view-labs');
        };

        // 4. Apertura Laboratorio -> Mostra File
        window.openLab = function(anno, semestre, materia, lab) {
            const filesView = document.getElementById('view-files');
            document.getElementById('unito-breadcrumb').innerHTML = `... / <span onclick="openSubject('${anno}','${semestre}','${materia}')">${materia}</span> / ${lab}`;
            document.getElementById('unito-title').innerText = "File.";

            filesView.innerHTML = `
                <div class="glass-card">
                    <a href="#" class="git-row-minimal"><div class="git-hash">📄</div><div class="git-msg">esercizio_1.c</div><div class="git-date">2 KB</div></a>
                    <a href="#" class="git-row-minimal"><div class="git-hash">📄</div><div class="git-msg">README.md</div><div class="git-date">1 KB</div></a>
                </div>
            `;
            switchView('view-files');
        };

        // Reset Totale
        window.resetUniToView = function() {
            switchView('view-years');
            document.getElementById('unito-breadcrumb').innerText = "Archivio";
            document.getElementById('unito-title').innerText = "UniTO.";
        };

});

/* =========================================
              END OF SCRIPT.JS
   ========================================= */