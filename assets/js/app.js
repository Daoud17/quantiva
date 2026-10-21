
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       MOBILE NAVIGATION
    ========================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const menuClose = document.querySelector(".menu-close");
    const overlay = document.querySelector(".menu-overlay");

    let previousFocus = null;

    function openMenu() {
        if (!mobileMenu || !menuToggle || !overlay) return;

        previousFocus = document.activeElement;

        mobileMenu.inert = false;
        mobileMenu.classList.add("active");
        overlay.classList.add("active");

        mobileMenu.setAttribute("aria-hidden", "false");
        menuToggle.setAttribute("aria-expanded", "true");

        document.body.classList.add("menu-open");
        menuClose?.focus();
    }

    function closeMenu() {
        if (!mobileMenu || !menuToggle || !overlay) return;

        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");

        mobileMenu.setAttribute("aria-hidden", "true");
        menuToggle.setAttribute("aria-expanded", "false");

        mobileMenu.inert = true;
        document.body.classList.remove("menu-open");

        previousFocus?.focus?.();
    }

    menuToggle?.addEventListener("click", () => {
        if (mobileMenu?.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    menuClose?.addEventListener("click", closeMenu);
    overlay?.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (event) => {
        if (!mobileMenu?.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeMenu();
            return;
        }

        if (event.key === "Tab") {
            const focusable = Array.from(
                mobileMenu.querySelectorAll(
                    "a[href], button:not([disabled])"
                )
            );

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    window.addEventListener("resize", () => {
        if (
            window.innerWidth > 1100 &&
            mobileMenu?.classList.contains("active")
        ) {
            closeMenu();
        }
    });


    /* =========================================
       AUTOMATIC ACTIVE NAVIGATION
    ========================================= */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const navigationLinks = document.querySelectorAll(
        ".desktop-nav a, .mobile-nav a"
    );

    navigationLinks.forEach(link => {
        const linkPage = new URL(link.href).pathname.split("/").pop();

        link.classList.remove("active");
        link.removeAttribute("aria-current");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });


    /* =========================================
       QUANTIVA CONTACT FORM
    ========================================= */

    const contactForm = document.getElementById("quantivaContactForm");
    const contactPhone = document.getElementById("contactPhone");
    const contactSuccess = document.getElementById("contactSuccessMessage");

    if (contactForm && contactPhone && contactSuccess) {

        contactPhone.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, 9);
            this.setCustomValidity("");
        });

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const phone = contactPhone.value.trim();

            if (!/^0?\d{7,8}$/.test(phone)) {
                contactPhone.setCustomValidity(
                    "Please enter a valid Lebanese phone number."
                );
                contactPhone.reportValidity();
                return;
            }

            contactPhone.setCustomValidity("");

            // Demonstration only - no backend is configured
            contactSuccess.textContent =
                "Form completed successfully. " +
                "Message delivery is not yet configured.";

            contactSuccess.hidden = false;
            contactForm.reset();

            contactSuccess.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });

        contactForm.addEventListener("input", () => {
            contactSuccess.hidden = true;
        });
    }


    /* =========================================
       QUANTIVA HOME HERO SLIDER
    ========================================= */

    const heroSlides = document.querySelectorAll(
        ".quantiva-hero .hero-slide"
    );

    const heroIndicators = document.querySelectorAll(
        ".quantiva-hero .hero-indicator"
    );

    let currentHeroSlide = 0;
    let heroInterval = null;

    const heroDelay = 5000;

    function showHeroSlide(index) {
        heroSlides.forEach((slide, i) => {
            const active = i === index;

            slide.classList.toggle("active", active);
            slide.setAttribute("aria-hidden", String(!active));
            slide.inert = !active;
        });

        heroIndicators.forEach((indicator, i) => {
            indicator.classList.toggle("active", i === index);
        });

        currentHeroSlide = index;
    }

    function nextHeroSlide() {
        if (heroSlides.length === 0) return;

        showHeroSlide(
            (currentHeroSlide + 1) % heroSlides.length
        );
    }

    if (heroSlides.length > 0) {

        showHeroSlide(0);

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        function stopHeroSlider() {
            if (heroInterval !== null) {
                clearInterval(heroInterval);
                heroInterval = null;
            }
        }

        function startHeroSlider() {
            stopHeroSlider();

            if (
                heroSlides.length < 2 ||
                reducedMotion.matches ||
                document.hidden
            ) {
                return;
            }

            heroInterval = setInterval(
                nextHeroSlide,
                heroDelay
            );
        }

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopHeroSlider();
            } else {
                startHeroSlider();
            }
        });

        reducedMotion.addEventListener(
            "change",
            startHeroSlider
        );

        startHeroSlider();
    }

});


/* =========================================
   QUANTIVA - OUR DIFFERENCE EFFECTS
========================================= */

const revealItems = document.querySelectorAll(".reveal-up");
const counters = document.querySelectorAll(".counter");

let countersStarted = false;

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.2
});

revealItems.forEach((item) => {
    revealObserver.observe(item);
});

function animateCounter(counter) {
    const target = parseFloat(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";
    const isDecimal = String(counter.dataset.target).includes(".");
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * eased;

        if (isDecimal) {
            counter.textContent = currentValue.toFixed(3) + suffix;
        } else {
            counter.textContent = Math.floor(currentValue) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            if (isDecimal) {
                counter.textContent = target.toFixed(3) + suffix;
            } else {
                counter.textContent = Math.floor(target) + suffix;
            }
        }
    }

    requestAnimationFrame(updateCounter);
}

const differenceSection = document.querySelector(".quantiva-difference");

if (differenceSection) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !countersStarted) {
                counters.forEach((counter) => animateCounter(counter));
                countersStarted = true;
            }
        });
    }, {
        threshold: 0.3
    });

    counterObserver.observe(differenceSection);
}


/* =========================================
   QUANTIVA - RESEARCH PARTICLE NETWORK
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById(
        "researchNetworkCanvas"
    );

    if (!canvas) return;

    const section = canvas.closest(".research-areas-section");
    const ctx = canvas.getContext("2d");

    if (!section || !ctx) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let nodes = [];
    let width = 0;
    let height = 0;
    let frameId = null;
    let visible = false;

    const connectionDistance = 270;
    const particleSpeed = 0.22;

    /* =====================================
       CREATE PARTICLES
    ===================================== */

    function createParticles() {

        nodes = [];

        const count = Math.min(
            45,
            Math.max(18, Math.round(width * height / 28000))
        );

        for (let i = 0; i < count; i++) {

            const radius = 2 + Math.random() * 2.5;

            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,

                vx: (Math.random() - 0.5) * particleSpeed,
                vy: (Math.random() - 0.5) * particleSpeed,

                radius: radius
            });
        }
    }

    /* =====================================
       RESIZE CANVAS
    ===================================== */

    function resizeCanvas() {

        const rect = section.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createParticles();
        drawNetwork();
    }

    /* =====================================
       DRAW LINES
    ===================================== */

    function drawConnections() {

        for (let i = 0; i < nodes.length; i++) {

            for (let j = i + 1; j < nodes.length; j++) {

                const a = nodes[i];
                const b = nodes[j];

                const dx = a.x - b.x;
                const dy = a.y - b.y;

                const distance = Math.hypot(dx, dy);

                if (distance >= connectionDistance) continue;

                const opacity =
                    (1 - distance / connectionDistance) * 0.28;

                ctx.beginPath();

                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle =
                    `rgba(43, 167, 151, ${opacity})`;

                ctx.lineWidth = 1.3;
                ctx.stroke();
            }
        }
    }

    /* =====================================
       DRAW GLOWING DOTS
    ===================================== */

    function drawParticles() {

        nodes.forEach(node => {

            // Outer glow
            const glow = ctx.createRadialGradient(
                node.x,
                node.y,
                0,
                node.x,
                node.y,
                node.radius * 5
            );

            glow.addColorStop(
                0,
                "rgba(43, 167, 151, 0.25)"
            );

            glow.addColorStop(
                1,
                "rgba(43, 167, 151, 0)"
            );

            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                node.radius * 5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = glow;
            ctx.fill();

            // Main particle
            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                node.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(32, 156, 140, 0.85)";
            ctx.fill();
        });
    }

    /* =====================================
       DRAW COMPLETE NETWORK
    ===================================== */

    function drawNetwork() {

        ctx.clearRect(0, 0, width, height);

        drawConnections();
        drawParticles();
    }

    /* =====================================
       MOVE PARTICLES
    ===================================== */

    function moveParticles() {

        nodes.forEach(node => {

            node.x += node.vx;
            node.y += node.vy;

            if (node.x <= 0) {
                node.x = 0;
                node.vx = Math.abs(node.vx);
            } else if (node.x >= width) {
                node.x = width;
                node.vx = -Math.abs(node.vx);
            }

            if (node.y <= 0) {
                node.y = 0;
                node.vy = Math.abs(node.vy);
            } else if (node.y >= height) {
                node.y = height;
                node.vy = -Math.abs(node.vy);
            }
        });
    }

    /* =====================================
       ANIMATION LOOP
    ===================================== */

    function animate() {

        if (
            !visible ||
            document.hidden ||
            reducedMotion.matches
        ) {
            frameId = null;
            return;
        }

        moveParticles();
        drawNetwork();

        frameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {

        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    }

    function updateAnimation() {

        stopAnimation();

        drawNetwork();

        if (
            visible &&
            !document.hidden &&
            !reducedMotion.matches
        ) {
            frameId = requestAnimationFrame(animate);
        }
    }

    /* =====================================
       VISIBILITY OBSERVER
    ===================================== */

    const observer = new IntersectionObserver(
        entries => {

            visible = entries[0].isIntersecting;
            updateAnimation();

        },
        {
            threshold: 0.05
        }
    );

    observer.observe(section);

    /* =====================================
       RESPONSIVE RESIZE
    ===================================== */

    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
    });

    resizeObserver.observe(section);

    /* =====================================
       PAGE VISIBILITY & ACCESSIBILITY
    ===================================== */

    document.addEventListener(
        "visibilitychange",
        updateAnimation
    );

    reducedMotion.addEventListener(
        "change",
        updateAnimation
    );

    resizeCanvas();
});



/* =========================================
   QUANTIVA - EXPANDABLE SYSTEM CARDS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const systemCards = document.querySelectorAll(
        ".quantiva-systems .system-card"
    );

    if (!systemCards.length) return;

    systemCards.forEach(card => {

        const button = card.querySelector(".system-plus-btn");
        const details = card.querySelector(".system-expand");

        if (!button || !details) return;

        // Keep the collapsed content inaccessible
        details.inert = true;

        button.addEventListener("click", () => {

            const isOpen = card.classList.contains("is-open");
            const nextOpen = !isOpen;

            card.classList.toggle("is-open", nextOpen);

            button.setAttribute(
                "aria-expanded",
                String(nextOpen)
            );

            details.inert = !nextOpen;

            // Update the button label
            const heading = card.querySelector("h3");
            const title = heading
                ? heading.textContent.trim()
                : "system";

            button.setAttribute(
                "aria-label",
                nextOpen
                    ? `Show less about ${title}`
                    : `Show more about ${title}`
            );

            // Plus changes into minus
            const symbol = button.querySelector("span");

            if (symbol) {
                symbol.textContent = nextOpen ? "−" : "+";
            }

        });

    });

});
