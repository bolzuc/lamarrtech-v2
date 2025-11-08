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

    function initAnimations() {
        try {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (e) {
            console.error('Error al inicializar Lucide:', e);
        }

        const slideUpElements = document.querySelectorAll('.slide-up-fade');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        slideUpElements.forEach(el => {
            observer.observe(el);
        });
    }

    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        initAnimations();
        initMobileMenu();
    } else {
        document.addEventListener('load', () => {
            initAnimations();
            initMobileMenu();
        }, false);
    }
});