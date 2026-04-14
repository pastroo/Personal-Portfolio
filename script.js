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
   5. LOGICA UNITO (Navigazione Drill-Down)
   ========================================= */

    // Livello 2: Mostra Materie
    window.openSemester = function(anno, semestre) {
        document.getElementById('view-years').style.display = 'none';
        const subjView = document.getElementById('view-subjects');
        subjView.style.display = 'grid';
        
        // Riavvia l'animazione
        subjView.classList.remove('fade-in');
        void subjView.offsetWidth; 
        subjView.classList.add('fade-in');

        document.getElementById('unito-breadcrumb').innerHTML = `<span onclick="resetUniToView()">UniTO</span> / ${anno} / ${semestre}`;
        document.getElementById('unito-title').innerText = "Materie.";

        // Generazione dinamica delle materie
        subjView.innerHTML = `
            <div class="glass-card" onclick="openSubject('${anno}', '${semestre}', 'Materia 1')" style="cursor:pointer">
                <div class="card-icon-wrapper">📚</div>
                <div class="hud-data">Corso</div>
                <h3>Materia 1</h3>
                <p>Esplora i laboratori</p>
            </div>
            <div class="glass-card" onclick="openSubject('${anno}', '${semestre}', 'Materia 2')" style="cursor:pointer">
                <div class="card-icon-wrapper">💻</div>
                <div class="hud-data">Corso</div>
                <h3>Materia 2</h3>
                <p>Esplora i laboratori</p>
            </div>
            <div class="glass-card" onclick="openSubject('${anno}', '${semestre}', 'Materia 3')" style="cursor:pointer">
                <div class="card-icon-wrapper">📊</div>
                <div class="hud-data">Corso</div>
                <h3>Materia 3</h3>
                <p>Esplora i laboratori</p>
            </div>
        `;
    };

    // Livello 3: Mostra Laboratori
    window.openSubject = function(anno, semestre, materia) {
        document.getElementById('view-subjects').style.display = 'none';
        document.getElementById('view-files').style.display = 'none'; // Se torniamo indietro
        const labsView = document.getElementById('view-labs');
        labsView.style.display = 'grid';
        
        labsView.classList.remove('fade-in');
        void labsView.offsetWidth;
        labsView.classList.add('fade-in');

        document.getElementById('unito-breadcrumb').innerHTML = `<span onclick="resetUniToView()">UniTO</span> / <span style="cursor:pointer" onclick="openSemester('${anno}', '${semestre}')">${semestre}</span> / ${materia}`;
        document.getElementById('unito-title').innerText = "Laboratori.";

        // Generazione dinamica dei laboratori
        labsView.innerHTML = `
            <div class="glass-card" onclick="openLab('${anno}', '${semestre}', '${materia}', 'Laboratorio 1')" style="cursor:pointer">
                <div class="card-icon-wrapper">📁</div>
                <div class="hud-data">Directory</div>
                <h3>Laboratorio 1</h3>
                <p>File ed esercizi</p>
            </div>
            <div class="glass-card" onclick="openLab('${anno}', '${semestre}', '${materia}', 'Laboratorio 2')" style="cursor:pointer">
                <div class="card-icon-wrapper">📁</div>
                <div class="hud-data">Directory</div>
                <h3>Laboratorio 2</h3>
                <p>File ed esercizi</p>
            </div>
        `;
    };

    // Livello 4: Mostra File
    window.openLab = function(anno, semestre, materia, lab) {
        document.getElementById('view-labs').style.display = 'none';
        const filesView = document.getElementById('view-files');
        filesView.style.display = 'block'; // Block, non grid, per la lista
        
        filesView.classList.remove('fade-in');
        void filesView.offsetWidth;
        filesView.classList.add('fade-in');

        document.getElementById('unito-breadcrumb').innerHTML = `<span onclick="resetUniToView()">UniTO</span> / ... / <span style="cursor:pointer" onclick="openSubject('${anno}', '${semestre}', '${materia}')">${materia}</span> / ${lab}`;
        document.getElementById('unito-title').innerText = "File del Laboratorio.";

        // Sfruttiamo le tue classi git-row-minimal per fare la lista dei file!
        filesView.innerHTML = `
            <div class="glass-card">
                <a href="#" class="git-row-minimal">
                    <div class="git-hash">📄</div>
                    <div class="git-msg">main.cpp</div>
                    <div class="git-date">12 KB</div>
                </a>
                <a href="#" class="git-row-minimal">
                    <div class="git-hash">📄</div>
                    <div class="git-msg">strutture.h</div>
                    <div class="git-date">4 KB</div>
                </a>
                <a href="#" class="git-row-minimal">
                    <div class="git-hash">📝</div>
                    <div class="git-msg">Appunti_Lezione.pdf</div>
                    <div class="git-date">1.2 MB</div>
                </a>
                <div style="margin-top: 30px; text-align: center;">
                    <button class="btn-apple" onclick="openSubject('${anno}', '${semestre}', '${materia}')">Torna ai Laboratori</button>
                </div>
            </div>
        `;
    };

    // Reset: Torna alla schermata principale (Anni)
    window.resetUniToView = function() {
        document.getElementById('view-years').style.display = 'grid';
        document.getElementById('view-subjects').style.display = 'none';
        document.getElementById('view-labs').style.display = 'none';
        document.getElementById('view-files').style.display = 'none';
        
        document.getElementById('unito-breadcrumb').innerHTML = "Archivio";
        document.getElementById('unito-title').innerText = "UniTO.";
        
        // Richiude tutte le card che erano state girate
        document.querySelectorAll('.flip-card').forEach(card => card.classList.remove('flipped'));
    };

});

/* =========================================
              END OF SCRIPT.JS
   ========================================= */