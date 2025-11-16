// Este archivo contiene la lógica del sitio.
// Debe cargarse DESPUÉS de idiomas.js

// Función para establecer el idioma
function setLanguage(lang) {
    // translations se carga desde idiomas.js
    if (!translations[lang]) {
        console.error(`Idioma no encontrado: ${lang}`);
        return;
    }

    const elements = document.querySelectorAll('[data-lang-key]');
    const translationData = translations[lang];

    elements.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translationData[key]) {
            // Manejar diferentes tipos de elementos (ej. placeholders en inputs)
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder !== undefined) {
                    // Solo actualiza si 'placeholder' es una propiedad válida (evita errores en selects)
                    // Y si el placeholder actual no es un espacio (usado para la animación de label flotante)
                    if(element.placeholder.trim().length > 0 || !element.placeholder) {
                         element.placeholder = translationData[key];
                    }
                }
                // Si es un botón de submit
                if (element.type === 'submit' || element.type === 'button') {
                     element.value = translationData[key];
                }
            } else if (element.tagName === 'OPTION' && element.value === "") {
                // Para el option deshabilitado
                element.textContent = translationData[key];
            }
             else {
                // Para la mayoría de los elementos (p, h1, a, span, button, strong, etc.)
                
                // --- INICIO DE LA MODIFICACIÓN ---
                // Verificamos si el elemento tiene hijos que sean elementos (como el SVG de la flecha)
                const hasChildElements = Array.from(element.childNodes).some(node => node.nodeType === 1); // 1 = Element Node

                if (hasChildElements && element.firstChild && element.firstChild.nodeType === 3) { // 3 = Text Node
                    // Si tiene hijos elementos (SVG) Y su primer hijo es un nodo de texto
                    // Solo reemplazamos el contenido de ese primer nodo de texto.
                    // Esto preserva el SVG que viene después.
                    element.firstChild.textContent = translationData[key] + " "; // Añadir espacio para separar del icono
                } else {
                    // Si no tiene hijos elementos (es solo texto) o no empieza con texto,
                    // usamos innerHTML para renderizar tags como <br> y <strong>
                    element.innerHTML = translationData[key];
                }
                // --- FIN DE LA MODIFICACIÓN ---
            }
        } else {
            // console.warn(`Clave de traducción no encontrada para '${key}' en '${lang}'`);
        }
    });

    // Guardar preferencia en localStorage
    localStorage.setItem('lang', lang);

    // Actualizar el botón principal
    const langBtnText = document.querySelector('.lang-btn-text');
    if (langBtnText) {
        langBtnText.textContent = lang.toUpperCase();
    }

    // Actualizar la clase activa en el dropdown
    const langLinks = document.querySelectorAll('.lang-dropdown a');
    langLinks.forEach(link => {
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Cerrar el dropdown
    const langDropdown = document.querySelector('.lang-dropdown');
    if (langDropdown) {
        langDropdown.classList.remove('show');
    }
}


document.addEventListener("DOMContentLoaded", function() {

    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNavContainer = document.querySelector('.mobile-nav-container');
        const menuIconOpen = document.querySelector('#menu-icon-open');
        const menuIconClose = document.querySelector('#menu-icon-close');

        if (menuToggle && mobileNavContainer && menuIconOpen && menuIconClose) {
            menuToggle.addEventListener('click', function() {
                mobileNavContainer.classList.toggle('open');
                
                const isOpen = mobileNavContainer.classList.contains('open');
                menuIconOpen.style.display = isOpen ? 'none' : 'block';
                menuIconClose.style.display = isOpen ? 'block' : 'none';
            });
        }

        const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const submenuContent = this.nextElementSibling;
                const arrow = this.querySelector('.dropdown-arrow');

                if (submenuContent && submenuContent.classList.contains('mobile-submenu-content')) {
                    if (submenuContent.style.maxHeight) {
                        submenuContent.style.maxHeight = null;
                        if (arrow) {
                            arrow.classList.remove('rotated');
                        }
                    } else {
                        submenuContent.style.maxHeight = submenuContent.scrollHeight + "px";
                        if (arrow) {
                            arrow.classList.add('rotated');
                        }
                    }
                }
            });
        });
    }

    // --- MODIFICADO: Función para el botón de idioma ---
    function initLanguageSwitcher() {
        const langBtn = document.querySelector('.lang-btn');
        const langDropdown = document.querySelector('.lang-dropdown');

        if (langBtn && langDropdown) {
            // 1. Abrir/Cerrar dropdown con el botón
            langBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Evita que el clic se propague al window
                langDropdown.classList.toggle('show');
            });

            // 2. Cierra el dropdown si se hace clic fuera de él
            window.addEventListener('click', function(e) {
                if (langDropdown.classList.contains('show')) {
                    langDropdown.classList.remove('show');
                }
            });

            // 3. Evita que el clic en el dropdown lo cierre
            langDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // 4. Asignar eventos a los enlaces de idioma
            const langLinks = langDropdown.querySelectorAll('a[data-lang]');
            langLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const selectedLang = this.getAttribute('data-lang');
                    // 'setLanguage' ahora está definido globalmente en este script
                    setLanguage(selectedLang); 
                });
            });
        }
    }
    // --- FIN MODIFICADO ---


    function initAnimations() {
        // ... (código de animación existente si lo hay) ...
    }

    // --- Carga inicial ---
    // Verificamos que 'translations' se haya cargado desde idiomas.js
    if (typeof translations === 'undefined') {
        console.error("Error: El archivo idiomas.js no se cargó o no se cargó a tiempo.");
        return;
    }

    initAnimations();
    initMobileMenu();
    initLanguageSwitcher(); // Llamada a la función
    
    // Establecer idioma al cargar la página
    const savedLang = localStorage.getItem('lang') || 'es'; // 'es' como default
    setLanguage(savedLang);
});