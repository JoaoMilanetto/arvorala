const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");
const revealEls = document.querySelectorAll(".reveal");
const projectsWrap = document.getElementById("projects-wrap");
const projectsTrack = document.getElementById("projects-track");
const form = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");

let lastY = window.scrollY;

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;

    header.classList.toggle("scrolled", y > 18);
    if (y > 140 && y > lastY + 4) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }
    lastY = y;

    updateProjectsTrack();
  },
  { passive: true }
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.2 }
);

revealEls.forEach((el) => observer.observe(el));

function updateProjectsTrack() {
  if (!projectsWrap || !projectsTrack) return;

  const rect = projectsWrap.getBoundingClientRect();
  const maxScroll = projectsWrap.offsetHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  const scrolled = Math.min(Math.max(-rect.top, 0), maxScroll);
  const progress = scrolled / maxScroll;
  const maxMove = Math.max(projectsTrack.scrollWidth - window.innerWidth, 0);
  const moveX = -maxMove * progress;

  projectsTrack.style.transform = `translate3d(${moveX}px, 0, 0)`;
}

window.addEventListener("resize", updateProjectsTrack);
updateProjectsTrack();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const mensagem = form.mensagem.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!nome || !email || !mensagem) {
    feedback.textContent = "Preencha todos os campos obrigatórios.";
    return;
  }

  if (!validEmail) {
    feedback.textContent = "Informe um e-mail válido.";
    return;
  }

  feedback.textContent = "Mensagem enviada com sucesso. Retornaremos em breve.";
  form.reset();
});
