/* Aktivitas Unit 4: konversi bilangan desimal ke biner dengan pembagian berulang. */
document.addEventListener("DOMContentLoaded", () => {
  const bitsContainer = document.getElementById("bits");
  const input = document.getElementById("decimalInput");
  const convertButton = document.getElementById("convertButton");
  const result = document.getElementById("result");
  const explanation = document.getElementById("explanation");
  const decimalResult = document.getElementById("decimalResult");
  const binaryResult = document.getElementById("binaryResult");
  const divisionSteps = document.getElementById("divisionSteps");
  const finalBinary = document.getElementById("finalBinary");

  let bits = Array(8).fill(0);

  function createBits() {
    bitsContainer.replaceChildren();

    bits.forEach((bit, index) => {
      const power = 7 - index;
      const column = document.createElement("div");
      column.className = "unit4-bit-column";

      const powerLabel = document.createElement("div");
      powerLabel.className = "unit4-power";
      powerLabel.innerHTML = `2<sup>${power}</sup>`;

      const valueLabel = document.createElement("div");
      valueLabel.className = "unit4-place-value";
      valueLabel.textContent = String(2 ** power);

      const bitBox = document.createElement("div");
      bitBox.className = `unit4-bit${bit === 1 ? " active" : ""}`;
      bitBox.textContent = String(bit);
      bitBox.setAttribute(
        "aria-label",
        `Nilai bit untuk 2 pangkat ${power}: ${bit}`,
      );

      column.append(powerLabel, valueLabel, bitBox);
      bitsContainer.appendChild(column);
    });
  }

  function createDivisionSteps(divisions) {
    divisionSteps.replaceChildren();

    divisions.forEach((item) => {
      const step = document.createElement("div");
      step.className = "unit4-division-step";
      step.append(`${item.dividend} ÷ 2 = ${item.quotient} sisa `);

      const remainder = document.createElement("strong");
      remainder.textContent = String(item.remainder);
      step.appendChild(remainder);
      divisionSteps.appendChild(step);
    });
  }

  function convertNumber() {
    const rawValue = input.value.trim();
    if (rawValue === "") {
      alert("Masukkan bilangan desimal terlebih dahulu.");
      input.focus();
      return;
    }

    const decimal = Number(rawValue);
    if (!Number.isInteger(decimal)) {
      alert("Masukkan bilangan bulat, bukan bilangan desimal berkoma.");
      input.focus();
      return;
    }
    if (decimal < 0) {
      alert("Masukkan bilangan 0 atau lebih.");
      input.focus();
      return;
    }
    if (decimal > 255) {
      alert("Untuk aktivitas ini, masukkan bilangan 0 sampai 255.");
      input.focus();
      return;
    }

    let number = decimal;
    const divisions = [];
    const remainders = [];

    if (number === 0) {
      divisions.push({ dividend: 0, quotient: 0, remainder: 0 });
      remainders.push(0);
    } else {
      while (number > 0) {
        const dividend = number;
        const quotient = Math.floor(number / 2);
        const remainder = number % 2;
        divisions.push({ dividend, quotient, remainder });
        remainders.push(remainder);
        number = quotient;
      }
    }

    const binary = [...remainders].reverse().join("");
    const paddedBinary = binary.padStart(8, "0");
    bits = paddedBinary.split("").map(Number);

    decimalResult.textContent = String(decimal);
    binaryResult.textContent = binary;
    finalBinary.textContent = binary;
    createBits();
    createDivisionSteps(divisions);

    result.classList.remove("hidden");
    explanation.classList.remove("hidden");

    if (typeof window.markSobatBinerActivity === "function") {
      window.markSobatBinerActivity("unit4Practice");
    }
  }

  createBits();
  convertButton.addEventListener("click", convertNumber);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") convertNumber();
  });
});
