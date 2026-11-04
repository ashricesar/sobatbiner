/* Interaksi Unit 1: progres hanya bertambah jika jawaban kuis benar. */
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".unit1-option");
  const feedback = document.getElementById("unit1-feedback");
  const alreadyCompleted = (() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("sobatbinerLearningProgressV2")) || {};
      return saved.unit1Question === true;
    } catch (_) {
      return false;
    }
  })();

  if (alreadyCompleted) {
    feedback.hidden = false;
    feedback.className = "unit1-feedback success";
    feedback.textContent =
      "✓ Kamu sudah menyelesaikan aktivitas Unit 1. Hebat!";
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
        feedback.className = "unit1-feedback success";
        feedback.textContent =
          "✓ Tepat sekali, kamu hebat! Komputer mengenali sinyal listrik sebagai 0 pada kondisi rendah.";
        options.forEach((item) => {
          item.disabled = true;
        });
        if (typeof window.markSobatBinerActivity === "function") {
          window.markSobatBinerActivity("unit1Question");
        }
      } else {
        option.classList.add("is-wrong");
        feedback.hidden = false;
        feedback.className = "unit1-feedback error";
        feedback.textContent = "✕ Oops... Coba diingat-ingat lagi!";
        option.disabled = true;
      }
    });
  });
});
