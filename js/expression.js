document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".expression-section");

  sections.forEach((section) => {
    const buttons = section.querySelectorAll(".expression-option");
    const message = section.querySelector(".expression-message");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => {
          item.classList.remove("is-selected");
        });

        // Menandai emoji yang dipilih
        button.classList.add("is-selected");

        // Menampilkan pesan sesuai emoji
        message.textContent = button.dataset.message;
      });
    });
  });
});
