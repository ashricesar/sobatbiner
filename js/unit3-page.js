/* Interaksi Unit 3: progres hanya bertambah jika jawaban kuis benar. */
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".unit2-option");
  const feedback = document.getElementById("unit3-feedback");

  const alreadyCompleted = (() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("sobatbinerLearningProgressV2")) || {};
      return saved.unit3Question === true;
    } catch (_) {
      return false;
    }
  })();

  if (alreadyCompleted) {
    feedback.hidden = false;
    feedback.className = "unit2-feedback success";
    feedback.textContent =
      "✓ Kamu sudah menyelesaikan aktivitas Unit 3. Hebat!";
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
          "✓ Tepat sekali, kamu hebat! Sistem bilangan biner menggunakan dua digit, yaitu 0 dan 1, dengan nilai tempat berbasis dua.";
        options.forEach((item) => {
          item.disabled = true;
        });
        if (typeof window.markSobatBinerActivity === "function") {
          window.markSobatBinerActivity("unit3Question");
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
