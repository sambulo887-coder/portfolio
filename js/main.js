const byId = (id) => document.getElementById(id);

function titleFromRepoName(name) {
  if (!name) return "Project";
  return name
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function initTabs() {
  const tablist = document.querySelector("[data-tabs]");
  if (!tablist) return;

  const buttons = Array.from(tablist.querySelectorAll("[role='tab']"));
  const panels = Array.from(document.querySelectorAll("[role='tabpanel']"));

  function setActive(nextId) {
    for (const btn of buttons) {
      const isActive = btn.getAttribute("aria-controls") === nextId;
      btn.setAttribute("aria-selected", String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    }

    for (const panel of panels) {
      const isActive = panel.id === nextId;
      panel.setAttribute("aria-hidden", String(!isActive));
    }
  }

  for (const btn of buttons) {
    btn.addEventListener("click", () => setActive(btn.getAttribute("aria-controls")));
    btn.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const idx = buttons.indexOf(btn);
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = buttons[(idx + dir + buttons.length) % buttons.length];
      next.focus();
      setActive(next.getAttribute("aria-controls"));
    });
  }

  const first = buttons.find((b) => b.getAttribute("aria-selected") === "true") || buttons[0];
  if (first) setActive(first.getAttribute("aria-controls"));
}

async function loadProjects() {
  const root = byId("projectsGrid");
  if (!root) return;

  try {
    const projects = window.PORTFOLIO_PROJECTS;
    const list = Array.isArray(projects) ? projects : [];

    root.innerHTML = "";
    for (const p of list) {
      const title = titleFromRepoName(p.name);
      const desc = (p.description || "GitHub project.").trim();
      const lang = p.language || "Project";

      const el = document.createElement("article");
      el.className = "card project";
      el.innerHTML = `
        <div class="project-header">
          <h3>${escapeHtml(title)}</h3>
          <span class="badge">${escapeHtml(lang)}</span>
        </div>
        <p>${escapeHtml(desc)}</p>
        <a class="more" href="${escapeAttr(p.url)}" target="_blank" rel="noreferrer">
          View repo <span aria-hidden="true">→</span>
        </a>
      `;
      root.appendChild(el);
    }
  } catch (e) {
    root.innerHTML = `<div class="card">Could not load projects. Please refresh.</div>`;
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll("`", "&#096;");
}

function initMenu() {
  const btn = byId("menuBtn");
  const nav = byId("nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.tagName === "A") {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initMenu();
  loadProjects();
});
