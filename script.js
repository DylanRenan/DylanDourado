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


// ===== INICIALIZAR =====
document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initCounters();
});
