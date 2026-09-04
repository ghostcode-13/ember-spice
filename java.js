// Nav scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when link clicked
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


// Device-based AOS animation
function setDeviceAnimations() {
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 1199 && window.innerWidth > 600;

    document.querySelectorAll('.menu-img').forEach((item, index) => {
        item.setAttribute('data-aos', isMobile ? 'zoom-in' : index % 2 === 0 ? 'fade-right' : 'fade-left');
        item.setAttribute('data-aos-duration', isMobile ? '950' : '1000');
        item.setAttribute('data-aos-easing', 'ease-out-cubic');
    });

    document.querySelectorAll('.menu-info').forEach((item, index) => {
        item.setAttribute('data-aos', isMobile ? 'zoom-in' : index % 2 === 0 ? 'fade-left' : 'fade-right');
        item.setAttribute('data-aos-duration', isMobile ? '950' : '1000');
        item.setAttribute('data-aos-delay', isMobile ? '80' : '150');
        item.setAttribute('data-aos-easing', 'ease-out-cubic');
    });

    document.querySelectorAll('.menu-header, .menu-strip').forEach(item => {
        item.setAttribute('data-aos', isMobile ? 'zoom-in' : 'fade-up');
        item.setAttribute('data-aos-duration', isMobile ? '950' : '950');
        item.setAttribute('data-aos-easing', 'ease-out-cubic');
    });
}

setDeviceAnimations();

AOS.init({
    easing: 'ease-out-cubic',
    once: false,
    mirror: true,
    offset: window.innerWidth <= 600 ? 90 : 90,
    anchorPlacement: 'top-bottom'
});

window.addEventListener('load', () => {
    AOS.refresh();
});

window.addEventListener('resize', () => {
    setDeviceAnimations();
    AOS.refreshHard();
});


// Chef stats counter animation
const chefStats = document.querySelectorAll('.chef-stat-number');

const countUp = (el) => {
    const target = +el.getAttribute('data-count');
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
    };
    requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

chefStats.forEach(stat => statObserver.observe(stat));


// Testimonials carousel
const testimonials = [
    {
        text: "The jollof alone is worth the trip — smoky, rich, and cooked exactly like my grandmother used to. Ember & Spice gets it right.",
        name: "Ifeoma A.",
        role: "Lagos, Nigeria",
        rating: 5,
        image: "./images/ifeoma.jpg.jpeg",
        zoom: 1.6,
        posX: 50,
        posY: 35
    },
    {
        text: "Booked a table for a birthday dinner and the suya platter stole the show. Service was warm, the ambiance even warmer.",
        name: "Tunde O.",
        role: "Abuja, Nigeria",
        rating: 5,
        image: "./images/tunde.jpg.jpeg",
        zoom: 1.6,
        posX: 50,
        posY: 40
    },
    {
        text: "Every dish tastes like it has a story behind it. The oxtail stew fell apart the second my fork touched it. Unreal.",
        name: "Chiamaka N.",
        role: "Enugu, Nigeria",
        rating: 5,
        image: "./images/chiamaka.jpg.jpeg",
        zoom: 1.6,
        posX: 50,
        posY: 35
    },
    {
        text: "First time trying Nigerian fine dining and this exceeded every expectation. The catfish pepper soup was fire, literally.",
        name: "David K.",
        role: "Port Harcourt, Nigeria",
        rating: 4,
        image: "./images/david.jpg.",
        zoom: 1.6,
        posX: 50,
        posY: 35
    }
];


let tIndex = 0;
let tTimer;
const T_DURATION = 6000;

const tText = document.getElementById('testimonial-text');
const tName = document.getElementById('testimonial-name');
const tRole = document.getElementById('testimonial-role');
const tAvatar = document.getElementById('testimonial-avatar');
const tRating = document.getElementById('testimonial-rating');
const tDotsWrap = document.getElementById('testimonial-dots');


function buildDots() {
    tDotsWrap.innerHTML = '';
    testimonials.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 't-dot';
        dot.innerHTML = '<div class="t-dot-fill"></div>';
        dot.addEventListener('click', () => goToTestimonial(i));
        tDotsWrap.appendChild(dot);
    });
}

function renderTestimonial(i) {
    const t = testimonials[i];

    tText.classList.add('fade-swap');
    setTimeout(() => {
        tText.textContent = t.text;
        tName.textContent = t.name;
        tRole.textContent = t.role;
        tAvatar.src = t.image;
        tAvatar.alt = t.name;
        tAvatar.style.objectPosition = `${t.posX}% ${t.posY}%`;
        tAvatar.style.transform = `scale(${t.zoom})`;
        tRating.innerHTML = "★".repeat(t.rating) + `<span class="empty">${"★".repeat(5 - t.rating)}</span>`;
        tText.classList.remove('fade-swap');
    }, 250);

    const dots = tDotsWrap.querySelectorAll('.t-dot');
    dots.forEach((dot, idx) => {
        dot.classList.remove('active', 'done');
        const fill = dot.querySelector('.t-dot-fill');
        fill.style.animation = 'none';
        fill.offsetHeight; // reflow
        fill.style.animation = '';

        if (idx < i) dot.classList.add('done');
        if (idx === i) {
            dot.classList.add('active');
            dot.querySelector('.t-dot-fill').style.animationDuration = T_DURATION + 'ms';
        }
    });
}

function goToTestimonial(i) {
    tIndex = i;
    renderTestimonial(tIndex);
    resetTimer();
}

function nextTestimonial() {
    tIndex = (tIndex + 1) % testimonials.length;
    renderTestimonial(tIndex);
}

function resetTimer() {
    clearInterval(tTimer);
    tTimer = setInterval(nextTestimonial, T_DURATION);
}

if (tText) {
    buildDots();
    renderTestimonial(0);
    resetTimer();
}

// Reservation form (placeholder submit handling)
const reserveForm = document.querySelector('.reserve-form');
if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Reservation request sent! We will confirm shortly.');
        reserveForm.reset();
    });
}



// Footer ember particles
const emberContainer = document.getElementById('footer-embers');

function spawnEmber() {
    if (!emberContainer) return;
    const ember = document.createElement('div');
    ember.className = 'ember-particle';
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 3;
    const drift = (Math.random() - 0.5) * 60;
    ember.style.left = left + '%';
    ember.style.animationDuration = duration + 's';
    ember.style.setProperty('--drift', drift + 'px');
    emberContainer.appendChild(ember);
    setTimeout(() => ember.remove(), duration * 1000);
}

if (emberContainer) {
    setInterval(spawnEmber, 400);
}

// Footer newsletter (placeholder submit handling)
const newsForm = document.getElementById('footer-news-form');
if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks for subscribing! Watch your inbox for updates.');
        newsForm.reset();
    });
}


// Page loader
document.body.classList.add('loading');
const pageLoader = document.getElementById('page-loader');

function hideLoader() {
    if (pageLoader && !pageLoader.classList.contains('loaded')) {
        pageLoader.classList.add('loaded');
        document.body.classList.remove('loading');
    }
}

window.addEventListener('load', () => {
    setTimeout(hideLoader, 400);
});

// Safety net...never let the loader hang longer than 3.5s no matter what
setTimeout(hideLoader, 3500);