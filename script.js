// ===== CARREGAR HEADER =====
async function loadComponent(id, file) {
    const res = await fetch(file);
    const data = await res.text();
    document.getElementById(id).innerHTML = data;

    // s� roda para o header
    if (id === "header") {
        initHeader();
    }
}
loadComponent("header", "header.html");
loadComponent("footer", "footer.html");


// ===== FUN��ES DO HEADER =====
function initHeader() {

    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");
    const header = document.getElementById("main-header");

    // menu mobile
    toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });

    // fechar menu ao clicar
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    });

    // scroll
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 10);
    });

    // link ativo
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}
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
        // Exibe um aviso visual para você saber que o erro é o protocolo file://
        if (window.location.protocol === 'file:') {
            console.warn("DICA: O fetch não funciona via file://. Use um servidor local (F5 no Visual Studio).");
        }
    }
}