document.addEventListener("DOMContentLoaded", function() {
    
    const loadingContainer = document.getElementById('loading-container');
    const loadingProgress = document.getElementById('loading-progress');
    const body = document.body;

    body.classList.add('loading');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) {
            progress = 100;
        }
        loadingProgress.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loadingContainer) {
                    loadingContainer.style.transition = 'opacity 0.5s ease';
                    loadingContainer.style.opacity = '0';
                }
                body.classList.remove('loading');
                
                setTimeout(() => {
                    if (loadingContainer) {
                        loadingContainer.style.display = 'none';
                    }
                    initAnimations();
                }, 500);
            }, 300);
        }
    }, 150);

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
        if (progress < 100) {
            progress = 100;
            if (loadingProgress) {
                loadingProgress.style.width = '100%';
            }
        }
    }
});