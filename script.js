// ===== CARREGAR COMPONENTES =====
async function loadComponent(id, file) {
    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Erro ao carregar ${file}: ${res.statusText}`);
        const data = await res.text();
        document.getElementById(id).innerHTML = data;

        if (id === "header") {
            initHeader();
        }
    } catch (error) {
        console.error("Falha no loadComponent:", error);
        if (window.location.protocol === 'file:') {
            console.warn("DICA: O fetch não funciona via file://. Use um servidor local (F5 no Visual Studio).");
        }
    }
}
loadComponent("header", "header.html");
loadComponent("footer", "footer.html");


// ===== FUNÇÕES DO HEADER =====
function initHeader() {

    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");
    const header = document.getElementById("main-header");

    toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    });

    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 10);
    });

    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}


// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".reveal").forEach(el => {
        observer.observe(el);
    });
}


// ===== CONTADORES ANIMADOS =====
function initCounters() {
    const counters = document.querySelectorAll(".counter-number");
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"));
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target + "+";
        }
    }
    requestAnimationFrame(update);
}


// ===== CARROSSEL DE PROJETOS =====
function initCarousels() {
    document.querySelectorAll(".carousel").forEach(carousel => {
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
        const prev = carousel.querySelector(".carousel-btn.prev");
        const next = carousel.querySelector(".carousel-btn.next");
        const dotsContainer = carousel.parentElement.querySelector(".carousel-dots");
        if (!track || slides.length === 0) return;

        let index = 0;

        function update() {
            track.style.transform = `translateX(-${index * 100}%)`;
            if (dotsContainer) {
                dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, i) => {
                    dot.classList.toggle("active", i === index);
                });
            }
        }

        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            slides.forEach((_, i) => {
                const dot = document.createElement("button");
                dot.className = "carousel-dot" + (i === 0 ? " active" : "");
                dot.type = "button";
                dot.setAttribute("aria-label", `Ir para imagem ${i + 1}`);
                dot.addEventListener("click", () => { index = i; update(); });
                dotsContainer.appendChild(dot);
            });
        }

        if (prev) prev.addEventListener("click", () => {
            index = (index - 1 + slides.length) % slides.length;
            update();
        });
        if (next) next.addEventListener("click", () => {
            index = (index + 1) % slides.length;
            update();
        });

        if (slides.length <= 1) {
            if (prev) prev.style.display = "none";
            if (next) next.style.display = "none";
            if (dotsContainer) dotsContainer.style.display = "none";
        }
    });
}


// ===== INICIALIZAR =====
document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initCounters();
    initCarousels();
});
