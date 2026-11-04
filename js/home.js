document.addEventListener("DOMContentLoaded", () => {
  const bulb = document.getElementById("bulb-visual");
  const bulbButton = document.getElementById("bulb-toggle");
  const bulbState = document.getElementById("bulb-state");

  if (bulb && bulbButton && bulbState) {
    bulbButton.addEventListener("click", () => {
      const isOn = bulb.classList.toggle("is-on");
      bulbState.textContent = isOn ? "MENYALA = 1" : "MATI = 0";
      bulb.setAttribute(
        "aria-label",
        isOn ? "Lampu menyala, bernilai satu" : "Lampu mati, bernilai nol",
      );
    });
  }

  const notice = document.getElementById("learning-notice");
  const closeNotice = document.getElementById("notice-close");
  if (notice && closeNotice) {
    closeNotice.addEventListener("click", () =>
      notice.classList.add("is-hidden"),
    );
  }

  // reset seluruh progres hanya setelah pengguna mengonfirmasi
  const resetOpen = document.getElementById("reset-progress-open");
  const resetModal = document.getElementById("reset-progress-modal");
  const resetCancel = document.getElementById("reset-progress-cancel");
  const resetConfirm = document.getElementById("reset-progress-confirm");
  const resetDialog = resetModal?.querySelector(".reset-modal-dialog");

  if (resetOpen && resetModal && resetCancel && resetConfirm && resetDialog) {
    let previousFocus = null;

    const closeResetModal = () => {
      resetModal.hidden = true;
      document.body.style.overflow = "";
      previousFocus?.focus();
    };

    resetOpen.addEventListener("click", () => {
      previousFocus = document.activeElement;
      resetModal.hidden = false;
      document.body.style.overflow = "hidden";
      resetCancel.focus();
    });

    resetCancel.addEventListener("click", closeResetModal);
    resetModal.querySelectorAll("[data-reset-close]").forEach((element) => {
      element.addEventListener("click", closeResetModal);
    });

    resetModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeResetModal();
      }

      if (event.key === "Tab") {
        const focusable = [resetCancel, resetConfirm];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    resetConfirm.addEventListener("click", () => {
      try {
        localStorage.removeItem("sobatbinerLearningProgressV2");
        localStorage.removeItem("sobatBinerUnit6QuizStateV1");
        if (window.updateSobatBinerProgress) {
          window.updateSobatBinerProgress();
        }
        closeResetModal();

        const confirmation = document.getElementById("reset-progress-feedback");
        if (confirmation) confirmation.remove();

        const feedback = document.createElement("p");
        feedback.id = "reset-progress-feedback";
        feedback.className = "reset-progress-feedback";
        feedback.setAttribute("role", "status");
        feedback.textContent =
          "Progres berhasil direset. Yuk, mulai belajar lagi!";
        resetOpen.closest(".progress-card")?.append(feedback);
      } catch (error) {
        console.error("Progres Sobat Biner tidak berhasil direset.", error);
        closeResetModal();
        window.alert("Progres belum berhasil direset. Silakan coba lagi.");
      }
    });
  }

  if (window.lucide) window.lucide.createIcons();
});
