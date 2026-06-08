// -----------------------------------------------------------------------------
// ESTADO GLOBAL DEL SLIDER
// -----------------------------------------------------------------------------
// Slide actual visible en la portada.
let currentSlide = 1;
// Id del intervalo automatico para poder iniciar/detener el slider.
let slideInterval;

// -----------------------------------------------------------------------------
// FUNCIONES DEL SLIDER
// -----------------------------------------------------------------------------
// Muestra el slide indicado por n y activa su circulo (tab) correspondiente.
function showSlide(n) {
    const slides = document.querySelectorAll('.slides img');
    const tabs = document.querySelectorAll('.tab .circle');

    // Limpia estado activo de todas las imagenes y tabs.
    slides.forEach((slide) => slide.classList.remove('active'));
    tabs.forEach((tab) => tab.classList.remove('active'));

    // Activa el slide y tab seleccionados.
    document.getElementById('slide' + n).classList.add('active');
    document.getElementById('tab' + n).classList.add('active');

    // Guarda el indice actual para el autoplay.
    currentSlide = n;
}

// Avanza al siguiente slide. Si llega al final, vuelve al primero.
function nextSlide() {
    let next = currentSlide + 1;
    const totalSlides = document.querySelectorAll('.slides img').length;

    if (next > totalSlides) {
        next = 1;
    }

    const lastSlide = document.getElementById('slide' + currentSlide);
    lastSlide.style.zIndex = '2';
    showSlide(next);
}

// Inicia rotacion automatica del slider cada 5 segundos.
function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
}

// Detiene rotacion automatica del slider.
function stopSlideShow() {
    clearInterval(slideInterval);
}

// -----------------------------------------------------------------------------
// INICIALIZACION PRINCIPAL
// -----------------------------------------------------------------------------
// Todo se ejecuta cuando el HTML ya termino de cargar.
document.addEventListener('DOMContentLoaded', () => {
    // Portada: mostrar primera foto y arrancar autoplay.
    showSlide(1);
    startSlideShow();

    // Si el usuario toca un tab, se pausa, cambia de slide y reinicia autoplay.
    const tabs = document.querySelectorAll('.tab .circle');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index + 1);
            startSlideShow();
        });
    });

    // -------------------------------------------------------------------------
    // PARALLAX EN HOME
    // -------------------------------------------------------------------------
    // Mueve elementos al hacer scroll para efecto de profundidad.
    window.addEventListener('scroll', function () {
        const slidesContent = document.querySelector('.slides');
        const homeLogo = document.querySelector('.home-logo');
        const homeContinue = document.querySelector('.home-continue');

        const value = window.scrollY;
        const altura = window.innerHeight * 0.8;

        slidesContent.style.top = value * 0.5 + 'px';
        homeLogo.style.opacity = 1 - value / altura;
        homeContinue.style.opacity = 1 - value / altura;
    });

    // -------------------------------------------------------------------------
    // BOTON DE MUSICA
    // -------------------------------------------------------------------------
    document.getElementById('play-button').addEventListener('click', function () {
        const audio = document.getElementById('song');
        audio.play();

        // Si en localStorage estaba marcado como reproduciendo, reanuda.
        window.onload = function () {
            if (localStorage.getItem('musicPlaying') === 'true') {
                audio.play();
            }
        };

        // Guarda el estado de reproduccion para futuras cargas.
        function saveMusicState() {
            localStorage.setItem('musicPlaying', !audio.paused);
        }

        // Al cambiar de pestana, pausa o reanuda automaticamente.
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                audio.pause();
            } else {
                audio.play();
            }
        });

        // Al salir de la pagina, guarda el estado actual del audio.
        window.addEventListener('beforeunload', saveMusicState);

        // Revela las secciones ocultas despues de iniciar la experiencia.
        const secciones = document.querySelectorAll('.hidden-element');
        secciones.forEach((seccion) => {
            seccion.style.display = 'flex';
        });
    });

    // -------------------------------------------------------------------------
    // COUNTDOWN
    // -------------------------------------------------------------------------
    // Fecha objetivo del evento: 3 de octubre de 2026 a las 17:00.
    const countdownDate = new Date('Oct 03, 2026 17:00:00').getTime();

    // Formato visual: agrega 0 a la izquierda (ej. 08).
    function formatNumber(number) {
        return number < 10 ? `0${number}` : number;
    }

    // Actualiza el contador cada segundo.
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        // Conversion de milisegundos a dias/horas/minutos/segundos totales reales.
        const safeDistance = Math.max(distance, 0);
        const days = Math.floor(safeDistance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((safeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((safeDistance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((safeDistance % (1000 * 60)) / 1000);

        // Pinta valores en el HTML.
        document.getElementById('days').textContent = formatNumber(days);
        document.getElementById('hours').textContent = formatNumber(hours);
        document.getElementById('minutes').textContent = formatNumber(minutes);
        document.getElementById('seconds').textContent = formatNumber(seconds);

        // Si la fecha ya paso, se reemplaza por mensaje final.
        if (distance < 0) {
            clearInterval(interval);
            document.getElementById('countdown-title').innerHTML = 'Reci�n casados!';
            document.getElementById('countdown').innerHTML = '';
        }
    }, 1000);

    // -------------------------------------------------------------------------
    // CRONOGRAMA: RESALTAR ITEM CENTRADO
    // -------------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        const items = document.querySelectorAll('.timeline-item');
        const windowHeight = window.innerHeight;

        items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;

            if (
                itemCenter >= windowHeight / 2 - rect.height / 2 &&
                itemCenter <= windowHeight / 2 + rect.height / 2
            ) {
                item.classList.add('highlight');
            } else {
                item.classList.remove('highlight');
            }
        });
    });

    // -------------------------------------------------------------------------
    // ANIMACIONES DE FONDO POR INTERSECCION
    // -------------------------------------------------------------------------
    // Agrega o quita clase .scrolled cuando el contenedor entra/sale del viewport.
    function addIntersectionObserver(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        container.classList.add('scrolled');
                    } else {
                        container.classList.remove('scrolled');
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(container);
    }

    // Secciones que usan transiciones de entrada.
    addIntersectionObserver('home-continue');
    addIntersectionObserver('photo-data-husband');
    addIntersectionObserver('photo-data-bride');
    addIntersectionObserver('countdown-container');
    addIntersectionObserver('parents');
    addIntersectionObserver('place');
    addIntersectionObserver('schedule');
    addIntersectionObserver('attendance');
    addIntersectionObserver('dev-name');

    // Al recargar, fuerza volver al inicio de la invitacion.
    window.onload = function () {
        window.location.hash = '#home';
    };

    // -------------------------------------------------------------------------
    // LOADING SCREEN
    // -------------------------------------------------------------------------
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    // Despu�s de 5s comienza a desaparecer.
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
    }, 5000);

    // Cuando termina la transicion, oculta loading y muestra contenido.
    loadingScreen.addEventListener('transitionend', () => {
        loadingScreen.style.display = 'none';
        mainContent.classList.add('show-content');
    });

    // -------------------------------------------------------------------------
    // FADE-IN AL HACER SCROLL
    // -------------------------------------------------------------------------
    const elements = document.querySelectorAll('.fade-in');

    // Activa .visible cuando un elemento entra en la ventana.
    const checkVisibility = () => {
        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

            if (isVisible) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        });
    };

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
});
