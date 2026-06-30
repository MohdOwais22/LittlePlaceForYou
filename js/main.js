/* ===================================================================
   MAIN.JS — interactions for index.html
   =================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const hasGsap = typeof gsap !== "undefined";
  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------- landing -> main experience ----------------
     Bound first and kept independent of GSAP so the button always
     works even if an animation library fails to load. ---------------- */
  const enterBtn = document.getElementById("enterBtn");
  const landing = document.getElementById("landing");
  const experience = document.getElementById("experience");

  function revealExperience() {
    if (hasGsap) {
      const tl = gsap.timeline();
      tl.to(landing, { opacity: 0, y: -30, duration: 1, ease: "power2.inOut" })
        .set(landing, { display: "none" })
        .set(experience, { display: "block" })
        .fromTo(
          experience,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: "power2.out" }
        )
        .add(() => animateEnvelopesIn(), "-=0.6");
    } else {
      landing.style.display = "none";
      experience.style.display = "block";
      experience.style.opacity = "1";
      document.querySelectorAll("#envelopeGrid .envelope").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
    window.scrollTo({ top: 0 });
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", revealExperience);
  }

  if (!hasGsap) {
    // Animation library failed to load — skip the rest of the
    // decorative animation setup but keep core interactions working.
    setupBasicEnvelopeGrid();
    setupBasicLetterModal();
    return;
  }

  /* ---------------- custom cursor ---------------- */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && matchMedia("(hover:hover)").matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
    });
    document.querySelectorAll("a, button, .envelope").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: "power3.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
    });
  });

  /* ---------------- soft particles ---------------- */
  const particleField = document.getElementById("particles");
  if (particleField) {
    const count = window.innerWidth < 640 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 4 + Math.random() * 10;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "vw";
      p.style.bottom = -20 - Math.random() * 40 + "px";
      const dur = 14 + Math.random() * 18;
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = (Math.random() * dur) + "s";
      particleField.appendChild(p);
    }
  }

  /* ---------------- landing entrance ---------------- */
  gsap.fromTo(
    "#landing .reveal",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power2.out", delay: 0.3 }
  );

  /* ---------------- build envelope grid ---------------- */
  const grid = document.getElementById("envelopeGrid");
  if (grid && typeof LETTERS !== "undefined") {
    LETTERS.forEach((letter, i) => {
      const card = document.createElement("div");
      card.className = "envelope reveal";
      card.dataset.id = letter.id;
      card.innerHTML = `
        <div class="flap"></div>
        <div class="seal">${letter.initial}</div>
        <div class="envelope-label">
          <p class="font-display text-xl sm:text-2xl text-[var(--ink)] leading-snug">${letter.title}</p>
        </div>
      `;
      card.addEventListener("click", () => openLetter(letter.id));
      grid.appendChild(card);
    });
  }

  function animateEnvelopesIn() {
    gsap.to("#envelopeGrid .envelope", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
    });
  }

  /* ---------------- scroll reveals (gallery teaser, footer, etc) ---------------- */
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      }
    );
  });

  /* ---------------- letter modal ---------------- */
  const modal = document.getElementById("letterModal");
  const modalBackdrop = document.getElementById("letterBackdrop");
  const modalClose = document.getElementById("letterClose");
  const modalBody = document.getElementById("letterBody");

  function openLetter(id) {
    const letter = LETTERS.find((l) => l.id === id);
    if (!letter) return;

    const isLast = letter.id === "last";

    if (isLast) {
      openLastSequence(letter);
      return;
    }

    modalBody.innerHTML = buildLetterMarkup(letter);
    modal.classList.remove("pointer-events-none");
    gsap.set(modal, { display: "flex" });
    gsap.fromTo(modalBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo(
      "#letterSheet",
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
    );
    gsap.fromTo(
      "#letterBody p, #letterBody .letter-meta",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, delay: 0.25, ease: "power2.out" }
    );
    document.body.style.overflow = "hidden";
  }

  function closeLetter() {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(modal, { display: "none" });
        document.body.style.overflow = "";
        modalBody.innerHTML = "";
      },
    });
    tl.to("#letterSheet", { opacity: 0, y: 24, duration: 0.4, ease: "power2.in" });
    tl.to(modalBackdrop, { opacity: 0, duration: 0.35 }, "-=0.2");
  }

  if (modalClose) modalClose.addEventListener("click", closeLetter);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeLetter);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLetter();
  });

  function buildLetterMarkup(letter) {
    const paragraphs = letter.body
      .split("\n\n")
      .map((p) => `<p class="font-hand text-2xl sm:text-3xl leading-relaxed text-[var(--ink)] mb-5">${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

    const image = letter.image
      ? `<div class="letter-meta my-6"><img src="${letter.image}" alt="" class="rounded-lg shadow-md max-h-80 mx-auto"/></div>`
      : "";

    const audio = letter.audio
      ? `<div class="letter-meta my-6 flex items-center gap-3 justify-center">
           <audio controls preload="none" src="${letter.audio}" class="w-full max-w-xs"></audio>
         </div>`
      : "";

    const video = letter.video
      ? `<div class="letter-meta my-6"><video controls preload="none" src="${letter.video}" class="rounded-lg shadow-md max-h-80 mx-auto w-full"></video></div>`
      : "";

    const spotify = letter.spotify
      ? `<div class="letter-meta my-6"><iframe style="border-radius:12px" src="${letter.spotify}" width="100%" height="152" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>`
      : "";

    const signature = letter.signature
      ? `<p class="letter-meta font-hand text-3xl text-right mt-8">${letter.signature}</p>`
      : "";

    return `
      <p class="letter-meta uppercase tracking-[0.2em] text-xs text-[var(--ink-soft)] mb-6 text-center">${letter.title}</p>
      ${image}
      ${paragraphs}
      ${video}
      ${audio}
      ${spotify}
      ${signature}
    `;
  }

  /* ---------------- Open Last — cinematic sequence ---------------- */
  function openLastSequence(letter) {
    const cine = document.getElementById("cinematic");
    const cineText = document.getElementById("cinematicText");
    cineText.innerHTML = "";
    gsap.set(cine, { display: "flex", opacity: 0 });
    document.body.style.overflow = "hidden";

    const lines = letter.body.split("\n\n");
    lines.forEach((line) => {
      const p = document.createElement("p");
      p.className = "font-display text-2xl sm:text-4xl leading-relaxed text-[var(--cream)] mb-7 opacity-0";
      p.textContent = line;
      cineText.appendChild(p);
    });
    const sig = document.createElement("p");
    sig.className = "font-hand text-4xl sm:text-5xl text-[var(--gold)] mt-10 opacity-0";
    sig.textContent = letter.signature || "";
    cineText.appendChild(sig);

    const closeBtn = document.createElement("button");
    closeBtn.id = "cinematicClose";
    closeBtn.className = "mt-14 magnetic text-[var(--cream)]/70 uppercase tracking-[0.2em] text-xs border border-[var(--cream)]/30 rounded-full px-6 py-3 opacity-0 hover:text-[var(--cream)] hover:border-[var(--cream)] transition-colors";
    closeBtn.textContent = "Close gently";
    cineText.appendChild(closeBtn);

    const tl = gsap.timeline();
    tl.to(cine, { opacity: 1, duration: 1.2, ease: "power2.out" });
    cineText.querySelectorAll("p").forEach((p) => {
      tl.to(p, { opacity: 1, duration: 1.4, ease: "power1.out" }, "+=0.3");
    });
    tl.to(closeBtn, { opacity: 1, duration: 1, ease: "power1.out" }, "+=0.4");

    closeBtn.addEventListener("click", () => {
      gsap.to(cine, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(cine, { display: "none" });
          document.body.style.overflow = "";
        },
      });
    });
  }

  /* ---------------- fallbacks used only if GSAP fails to load ---------------- */
  function setupBasicEnvelopeGrid() {
    const grid = document.getElementById("envelopeGrid");
    if (!grid || typeof LETTERS === "undefined") return;
    LETTERS.forEach((letter) => {
      const card = document.createElement("div");
      card.className = "envelope";
      card.dataset.id = letter.id;
      card.innerHTML = `
        <div class="flap"></div>
        <div class="seal">${letter.initial}</div>
        <div class="envelope-label">
          <p class="font-display text-xl sm:text-2xl text-[var(--ink)] leading-snug">${letter.title}</p>
        </div>
      `;
      card.addEventListener("click", () => window.basicOpenLetter(letter.id));
      grid.appendChild(card);
    });
  }

  function setupBasicLetterModal() {
    const modal = document.getElementById("letterModal");
    const modalBackdrop = document.getElementById("letterBackdrop");
    const modalClose = document.getElementById("letterClose");
    const modalBody = document.getElementById("letterBody");
    const cine = document.getElementById("cinematic");
    const cineText = document.getElementById("cinematicText");

    window.basicOpenLetter = function (id) {
      const letter = LETTERS.find((l) => l.id === id);
      if (!letter) return;

      if (letter.id === "last") {
        cineText.innerHTML = letter.body
          .split("\n\n")
          .map((line) => `<p class="font-display text-2xl sm:text-4xl leading-relaxed text-[var(--cream)] mb-7">${line}</p>`)
          .join("") + (letter.signature ? `<p class="font-hand text-4xl sm:text-5xl text-[var(--gold)] mt-10">${letter.signature}</p>` : "");
        const closeBtn = document.createElement("button");
        closeBtn.className = "mt-14 text-[var(--cream)]/70 uppercase tracking-[0.2em] text-xs border border-[var(--cream)]/30 rounded-full px-6 py-3";
        closeBtn.textContent = "Close gently";
        closeBtn.addEventListener("click", () => {
          cine.style.display = "none";
          document.body.style.overflow = "";
        });
        cineText.appendChild(closeBtn);
        cine.style.display = "flex";
        cine.style.opacity = "1";
        document.body.style.overflow = "hidden";
        return;
      }

      const paragraphs = letter.body
        .split("\n\n")
        .map((p) => `<p class="font-hand text-2xl sm:text-3xl leading-relaxed text-[var(--ink)] mb-5">${p}</p>`)
        .join("");
      modalBody.innerHTML = `
        <p class="uppercase tracking-[0.2em] text-xs text-[var(--ink-soft)] mb-6 text-center">${letter.title}</p>
        ${letter.image ? `<div class="my-6"><img src="${letter.image}" alt="" class="rounded-lg shadow-md max-h-80 mx-auto"/></div>` : ""}
        ${paragraphs}
        ${letter.video ? `<div class="my-6"><video controls preload="none" src="${letter.video}" class="rounded-lg shadow-md max-h-80 mx-auto w-full"></video></div>` : ""}
        ${letter.audio ? `<div class="my-6 flex justify-center"><audio controls preload="none" src="${letter.audio}" class="w-full max-w-xs"></audio></div>` : ""}
        ${letter.signature ? `<p class="font-hand text-3xl text-right mt-8">${letter.signature}</p>` : ""}
      `;
      modal.style.display = "flex";
      modal.classList.remove("pointer-events-none");
      document.body.style.overflow = "hidden";
    };

    function closeBasicLetter() {
      modal.style.display = "none";
      document.body.style.overflow = "";
      modalBody.innerHTML = "";
    }
    if (modalClose) modalClose.addEventListener("click", closeBasicLetter);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeBasicLetter);
  }
});
