(function () {
  "use strict";

  const decimalForm = document.getElementById("decimal-form");
  const binaryForm = document.getElementById("binary-form");
  const decimalInput = document.getElementById("calc-dec-input");
  const binaryInput = document.getElementById("calc-bin-input");
  const decimalSteps = document.getElementById("calc-dec-steps");
  const binarySteps = document.getElementById("calc-bin-steps");

  if (
    !decimalForm ||
    !binaryForm ||
    !decimalInput ||
    !binaryInput ||
    !decimalSteps ||
    !binarySteps
  ) {
    return;
  }

  function addStep(container, text, type) {
    const item = document.createElement("div");

    item.className =
      "calculator-step sb-calc-reveal" + (type ? " " + type : "");

    item.textContent = text;

    // Jeda animasi berdasarkan urutan balok
    item.style.animationDelay = `${container.children.length * 120}ms`;

    container.appendChild(item);
  }

  function showError(container, message) {
    container.replaceChildren();
    addStep(container, message, "error-step");
  }

  function convertDecimalToBinary() {
    const rawValue = decimalInput.value.trim();
    const number = Number(rawValue);

    if (
      rawValue === "" ||
      !Number.isInteger(number) ||
      number < 0 ||
      number > 255
    ) {
      showError(decimalSteps, "Masukkan bilangan bulat dari 0 sampai 255.");
      return;
    }

    decimalSteps.replaceChildren();

    if (number === 0) {
      addStep(decimalSteps, "0 ÷ 2 = 0 sisa 0");
      addStep(decimalSteps, "hasilnya adalah 0", "result-step");
      return;
    }

    let current = number;
    const remainders = [];

    while (current > 0) {
      const quotient = Math.floor(current / 2);
      const remainder = current % 2;
      remainders.push(remainder);
      addStep(decimalSteps, `${current} ÷ 2 = ${quotient} sisa ${remainder}`);
      current = quotient;
    }

    addStep(decimalSteps, "dibaca dari bawah ke atas", "note-step");
    addStep(
      decimalSteps,
      `hasilnya adalah biner ${remainders.reverse().join("")}`,
      "result-step",
    );
  }

  function convertBinaryToDecimal() {
    const binary = binaryInput.value.trim();

    if (!binary || !/^[01]{1,8}$/.test(binary)) {
      showError(
        binarySteps,
        "Masukkan bilangan biner yang hanya terdiri dari angka 0 dan 1. (Maksimal 8 digit)",
      );
      return;
    }

    binarySteps.replaceChildren();
    let total = 0n;

    Array.from(binary).forEach((bit, index) => {
      const power = binary.length - 1 - index;
      const placeValue = 2n ** BigInt(power);
      const contribution = BigInt(bit) * placeValue;
      total += contribution;
      addStep(binarySteps, `${bit} × 2^${power} = ${contribution.toString()}`);
    });

    addStep(binarySteps, "seluruh hasilnya dijumlahkan");
    addStep(
      binarySteps,
      `hasilnya adalah desimal ${total.toString()}`,
      "result-step",
    );
  }

  decimalForm.addEventListener("submit", function (event) {
    event.preventDefault();
    convertDecimalToBinary();
  });

  binaryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    convertBinaryToDecimal();
  });

  // Kosongkan hasil saat pertama kali membuka kalkulator.
  decimalSteps.replaceChildren();
  binarySteps.replaceChildren();
})();
