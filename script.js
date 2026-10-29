const projects = [
  {
    name: "The Willow Tree",
    industry: "Restaurant",
    url: "",
    live: false,
    description: "A neighbourhood table, brought to life online.",
    desktopImage: "images/thewillowtree.png",
    thumbnail: "images/thewillowtree.png"
  },
  {
    name: "Kulan Café",
    industry: "Café",
    url: "",
    live: false,
    description: "A warm, welcoming home for good food and good company.",
    desktopImage: "images/Kulancafe.png",
    thumbnail: "images/Kulancafe.png"
  },
  {
    name: "Deadbeat Records",
    industry: "Vinyl store",
    url: "",
    live: false,
    description: "A little corner of the internet for records worth finding.",
    desktopImage: "images/deadbeatrecords.png",
    thumbnail: "images/deadbeatrecords.png"
  },
  {
    name: "Your business next",
    industry: "Your industry",
    url: "",
    live: false,
    isContactCta: true,
    description: "Whatever you do, let’s make a website that feels like you.",
    desktopImage: "",
    thumbnail: ""
  }
];

document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    siteNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const showcase = document.querySelector(".showcase");
if (showcase) {
  const screen = document.querySelector("#project-screen");
  const projectUrl = document.querySelector("#project-url");
  const projectCount = document.querySelector("#project-count");
  const projectIndustry = document.querySelector("#project-industry");
  const projectName = document.querySelector("#project-name");
  const projectDescription = document.querySelector("#project-description");
  const projectCta = document.querySelector("#project-cta");
  const projectConcept = document.querySelector("#project-concept");
  const progressList = document.querySelector("#project-progress");
  const projectList = document.querySelector("#project-list");
  const previousButton = document.querySelector("#previous-project");
  const nextButton = document.querySelector("#next-project");
  const duration = 5200;
  let activeIndex = 0;
  let timer;
  let transitionTimer;
  let remaining = duration;
  let startedAt = 0;
  let paused = false;
  let hovered = false;
  let focused = false;
  let touchStartX = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const progressButtons = projects.map((project, index) => {
    const button = document.createElement("button");
    button.className = "progress-button";
    button.type = "button";
    button.setAttribute("aria-label", `Show project ${index + 1}: ${project.name}`);
    button.innerHTML = '<span class="progress-track"></span><span class="progress-fill"></span>';
    button.addEventListener("click", () => showProject(index));
    progressList.append(button);
    return button;
  });

  const thumbnails = projects.map((project, index) => {
    const button = document.createElement("button");
    button.className = "project-list-item";
    button.type = "button";
    button.setAttribute("aria-label", `Show ${project.name}, ${project.industry}`);
    const image = project.thumbnail
      ? `<img src="${project.thumbnail}" alt="${project.name} full-page ${project.industry.toLowerCase()} website screenshot" loading="lazy" decoding="async">`
      : '<span class="project-list-placeholder" aria-hidden="true"></span>';
    button.innerHTML = `${image}<span class="mono-label">${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}</span><span class="project-list-name">${project.name}</span><span class="project-list-industry">${project.industry}</span>`;
    button.addEventListener("click", () => {
      showProject(index);
      showcase.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    projectList.append(button);
    return button;
  });

  function setImage(container, src, alt, loading) {
    container.replaceChildren();
    if (!src) {
      container.classList.add("is-empty");
      container.setAttribute("aria-label", "A space for your business website");
      return;
    }
    container.classList.remove("is-empty");
    container.removeAttribute("aria-label");
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.loading = loading;
    image.decoding = "async";
    container.append(image);
  }

  function validDestination(value) {
    try {
      const destination = new URL(value);
      return ["http:", "https:"].includes(destination.protocol) && destination.hostname.includes(".");
    } catch {
      return false;
    }
  }

  function pauseTimer() {
    if (paused) return;
    paused = true;
    window.clearTimeout(timer);
    remaining = Math.max(0, remaining - (performance.now() - startedAt));
    progressButtons[activeIndex].classList.add("is-paused");
  }

  function startTimer() {
    if (!paused || reducedMotion) return;
    if (document.hidden || hovered || focused) {
      progressButtons[activeIndex].classList.add("is-paused");
      return;
    }
    paused = false;
    startedAt = performance.now();
    progressButtons[activeIndex].classList.remove("is-paused");
    timer = window.setTimeout(() => showProject((activeIndex + 1) % projects.length), remaining);
  }

  function showProject(index) {
    window.clearTimeout(timer);
    window.clearTimeout(transitionTimer);
    paused = true;
    activeIndex = (index + projects.length) % projects.length;
    progressButtons.forEach((button) => button.classList.remove("is-active", "is-paused"));
    showcase.classList.add("is-changing");
    transitionTimer = window.setTimeout(() => {
      const project = projects[activeIndex];
      const hasLiveDestination = project.live && validDestination(project.url);
      projectUrl.textContent = hasLiveDestination ? new URL(project.url).host : "Concept preview";
      projectCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
      projectIndustry.textContent = project.industry;
      projectName.textContent = project.name;
      projectDescription.textContent = project.description;
      projectCta.hidden = !hasLiveDestination && !project.isContactCta;
      projectCta.href = hasLiveDestination ? project.url : "contact.html";
      projectCta.target = hasLiveDestination ? "_blank" : "";
      projectCta.rel = hasLiveDestination ? "noreferrer" : "";
      projectCta.innerHTML = hasLiveDestination
        ? 'Visit site <span aria-hidden="true">↗</span>'
        : 'Make this space yours <span aria-hidden="true">↗</span>';
      projectConcept.hidden = hasLiveDestination || project.isContactCta;
      setImage(screen, project.desktopImage, `${project.name} full-page ${project.industry.toLowerCase()} website screenshot`, "eager");
      screen.scrollTop = 0;
      progressButtons.forEach((button, buttonIndex) => {
        button.classList.toggle("is-active", buttonIndex === activeIndex);
        button.classList.remove("is-paused");
        button.setAttribute("aria-current", String(buttonIndex === activeIndex));
      });
      thumbnails.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === activeIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      remaining = duration;
      showcase.classList.remove("is-changing");
      paused = true;
      startTimer();
    }, 220);
  }

  previousButton.addEventListener("click", () => showProject(activeIndex - 1));
  nextButton.addEventListener("click", () => showProject(activeIndex + 1));
  showcase.addEventListener("mouseenter", () => { hovered = true; pauseTimer(); });
  showcase.addEventListener("mouseleave", () => { hovered = false; startTimer(); });
  showcase.addEventListener("focusin", () => { focused = true; pauseTimer(); });
  showcase.addEventListener("focusout", (event) => {
    if (!showcase.contains(event.relatedTarget)) {
      focused = false;
      startTimer();
    }
  });
  showcase.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  showcase.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) showProject(activeIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (event.key === "ArrowLeft") showProject(activeIndex - 1);
    if (event.key === "ArrowRight") showProject(activeIndex + 1);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseTimer();
    else startTimer();
  });

  progressButtons.forEach((button) => button.classList.remove("is-active"));
  showProject(0);
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const status = document.querySelector("#form-status");
  const params = new URLSearchParams(window.location.search);
  if (params.get("submitted") === "true") {
    contactForm.hidden = true;
    status.textContent = "Thanks for your note. I’ll be in touch soon.";
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.classList.remove("is-error");
    status.textContent = "Sending your note…";
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    try {
      const body = new URLSearchParams(new FormData(contactForm));
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body
      });
      if (!response.ok) throw new Error(`Form submission failed with status ${response.status}`);
      contactForm.hidden = true;
      status.textContent = "Thanks for your note. I’ll be in touch soon.";
      window.history.replaceState({}, "", `${window.location.pathname}?submitted=true`);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      status.classList.add("is-error");
      status.textContent = "Your note couldn’t be sent just now. Please try again or email me directly.";
      submitButton.disabled = false;
    }
  });
}

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => window.location.assign(destination.href), 180);
  });
});

window.requestAnimationFrame(() => document.body.classList.add("is-ready"));
