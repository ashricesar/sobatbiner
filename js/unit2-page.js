/* Interaksi Unit 2: progres hanya bertambah jika jawaban kuis benar. */
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".unit2-option");
  const feedback = document.getElementById("unit2-feedback");
  const alreadyCompleted = (() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("sobatbinerLearningProgressV2")) || {};
      return saved.unit2Question === true;
    } catch (_) {
      return false;
    }
  })();

  if (alreadyCompleted) {
    feedback.hidden = false;
    feedback.className = "unit2-feedback success";
    feedback.textContent =
      "✓ Kamu sudah menyelesaikan aktivitas Unit 2. Hebat!";
    options.forEach((option) => {
      option.disabled = true;
      if (option.dataset.answer === "correct")
        option.classList.add("is-correct");
    });
  }

  options.forEach((option) => {
    option.addEventListener("click", () => {
      if (option.disabled || alreadyCompleted) return;

      if (option.dataset.answer === "correct") {
        option.classList.add("is-correct");
        feedback.hidden = false;
        feedback.className = "unit2-feedback success";
        feedback.textContent =
          "✓ Tepat sekali, kamu hebat! Sistem bilangan desimal menggunakan sepuluh digit, yaitu 0 sampai 9, dengan nilai tempat berbasis sepuluh.";
        options.forEach((item) => {
          item.disabled = true;
        });
        if (typeof window.markSobatBinerActivity === "function") {
          window.markSobatBinerActivity("unit2Question");
        }
      } else {
        option.classList.add("is-wrong");
        feedback.hidden = false;
        feedback.className = "unit2-feedback error";
        feedback.textContent = "✕ Oops... Coba diingat-ingat lagi!";
        option.disabled = true;
      }
    });
  });
});
