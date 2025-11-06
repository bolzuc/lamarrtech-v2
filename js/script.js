document.addEventListener("DOMContentLoaded", function() {

    function initAnimations() {
        try {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            } else {
                console.error('Lucide icons no se pudieron cargar.');
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
    } else {
        document.addEventListener('load', initAnimations, false);
    }
});