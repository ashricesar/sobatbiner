(() => {
  "use strict";

  const sounds = {
    pop: "sfx-pop.mp3",
    ding: "sfx-ding.mp3",
    "90sding": "sfx-90sding.mp3",
    wrong: "sfx-wrong-answer.mp3",
    notif: "sfx-notif.mp3",
    applause: "sfx-applause.mp3",
    magic: "sfx-magicspell.mp3",
  };

  const audioCache = {};
  window.playSobatSfx = function (name) {
    const file = sounds[name];
    if (!file) return;
    try {
      if (!audioCache[name]) audioCache[name] = new Audio(`sfx/${file}`);
      const audio = audioCache[name];
      audio.pause();
      audio.currentTime = 0;
      const playback = audio.play();
      if (playback && typeof playback.catch === "function")
        playback.catch(() => {});
    } catch (_) {
      // audio gagal dimuat tidak boleh mengganggu fungsi pembelajaran
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const targets = document.querySelectorAll(
      ".site-header, main > *, .hero-section, .hero-content, .hero-visual, " +
        ".unit1-card, .unit2-card, .unit4-workspace, .unit5-workspace, " +
        ".unit6-card, .calculator-card, .progress-card, .notice-card",
    );
    targets.forEach((element, index) => {
      if (element.classList.contains("notice-card")) return;
      element.classList.add("sb-reveal");
      element.style.setProperty(
        "--sb-delay",
        `${Math.min(index % 6, 5) * 85}ms`,
      );
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("sb-visible");
              currentObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 },
      );
      document
        .querySelectorAll(".sb-reveal")
        .forEach((element) => observer.observe(element));
    } else {
      document
        .querySelectorAll(".sb-reveal")
        .forEach((element) => element.classList.add("sb-visible"));
    }

    // Efek pop untuk notifikasi utama ketika pertama kali tampil.
    const homeNotice = document.getElementById("learning-notice");
    if (homeNotice && !homeNotice.classList.contains("is-hidden")) {
      window.playSobatSfx("pop");
      homeNotice.classList.add("sb-pop-in");
    }

    // Tombol-tombol navigasi/aksi beranda.
    document
      .getElementById("bulb-toggle")
      ?.addEventListener("click", () => window.playSobatSfx("pop"));
    document
      .getElementById("reset-progress-open")
      ?.addEventListener("click", () => window.playSobatSfx("wrong"));

    document.querySelectorAll('a[href="index.html"]').forEach((link) => {
      if (link.textContent.includes("Beranda")) {
        link.addEventListener("click", () => window.playSobatSfx("pop"));
      }
    });

    const startLearning = [...document.querySelectorAll("a,button")].find(
      (el) =>
        el.textContent.replace(/\s+/g, " ").trim().includes("Mulai Belajar"),
    );
    startLearning?.addEventListener("click", () => window.playSobatSfx("pop"));

    // Pilihan jawaban Unit 1–3.
    document
      .querySelectorAll(".unit1-option, .unit2-option")
      .forEach((option) => {
        option.addEventListener("click", () => {
          if (option.disabled) return;
          window.playSobatSfx(
            option.dataset.answer === "correct" ? "ding" : "wrong",
          );
        });
      });

    // Unit 4: setiap aksi konversi (klik tombol maupun Enter).
    const convertButton = document.getElementById("convertButton");
    convertButton?.addEventListener("click", () => window.playSobatSfx("ding"));
    const decimalInput = document.getElementById("decimalInput");
    decimalInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") window.playSobatSfx("ding");
    });

    // Unit 6: pilihan digit, opsi soal 4–5, konfirmasi, dan pengumuman modal
    document.addEventListener("click", (event) => {
      if (event.target.closest(".unit5-bit")) {
        window.playSobatSfx("90sding");
      }

      if (event.target.closest(".unit6-bit")) {
        window.playSobatSfx("90sding");
      }

      if (event.target.closest(".unit6-choice")) {
        window.playSobatSfx("90sding");
      }
    });
    document.getElementById("confirmButton")?.addEventListener("click", () => {
      window.playSobatSfx("ding");
    });

    const startModal = document.getElementById("startModal");
    const violationModal = document.getElementById("violationModal");
    if (startModal && !startModal.classList.contains("hidden")) {
      window.playSobatSfx("notif");
      startModal.classList.add("sb-modal-pop");
    }
    if (violationModal && !violationModal.classList.contains("hidden")) {
      window.playSobatSfx("wrong");
      violationModal.classList.add("sb-modal-pop");
    }

    document.querySelectorAll("#decimal-form, #binary-form").forEach((form) => {
      form.addEventListener("submit", () => window.playSobatSfx("ding"));
    });
  });
})();
