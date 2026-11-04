/* Aktivitas Unit 5: memainkan nilai tempat biner dan melihat hasil desimalnya. */
document.addEventListener("DOMContentLoaded", () => {
  const bitsContainer = document.getElementById("bits");
  const result = document.getElementById("result");
  const explanation = document.getElementById("explanation");
  const binaryResult = document.getElementById("binaryResult");
  const decimalResult = document.getElementById("decimalResult");
  const calculationList = document.getElementById("calculationList");
  const totalEquation = document.getElementById("totalEquation");
  const totalResult = document.getElementById("totalResult");

  let bits = Array(8).fill(0);
  let hasInteracted = false;

  function calculateDecimal() {
    return bits.reduce(
      (total, bit, index) => total + bit * 2 ** (7 - index),
      0,
    );
  }

  function createCalculation(decimal) {
    calculationList.replaceChildren();
    const values = [];

    bits.forEach((bit, index) => {
      const power = 7 - index;
      const placeValue = 2 ** power;
      const calculation = bit * placeValue;
      values.push(calculation);

      const row = document.createElement("div");
      row.className = `unit5-calculation-row ${bit === 0 ? "zero" : "active-row"}`;
      row.append(`${bit} × 2`);

      const superscript = document.createElement("sup");
      superscript.textContent = String(power);
      row.appendChild(superscript);
      row.append(` = ${bit} × ${placeValue} = `);

      if (calculation !== 0) {
        const answer = document.createElement("strong");
        answer.textContent = String(calculation);
        row.appendChild(answer);
      } else {
        row.append("0");
      }

      calculationList.appendChild(row);
    });

    const nonZeroValues = values.filter((value) => value !== 0);
    const equation = nonZeroValues.length > 0 ? nonZeroValues.join(" + ") : "0";

    totalEquation.textContent = `${equation} = ${decimal}`;
    totalResult.textContent = String(decimal);
  }

  function updateDisplay() {
    const binary = bits.join("");
    const decimal = calculateDecimal();

    binaryResult.textContent = binary;
    decimalResult.textContent = String(decimal);
    createCalculation(decimal);

    bitsContainer.replaceChildren();
    bits.forEach((bit, index) => {
      const power = 7 - index;
      const column = document.createElement("div");
      column.className = "unit5-bit-column";

      const powerLabel = document.createElement("div");
      powerLabel.className = "unit5-power";
      powerLabel.innerHTML = `2<sup>${power}</sup>`;

      const valueLabel = document.createElement("div");
      valueLabel.className = "unit5-place-value";
      valueLabel.textContent = String(2 ** power);

      const button = document.createElement("button");
      button.type = "button";
      button.className = `unit5-bit${bit === 1 ? " active" : ""}`;
      button.textContent = String(bit);
      button.setAttribute(
        "aria-label",
        `Nilai tempat ${2 ** power}, saat ini ${bit}. Klik untuk mengubah.`,
      );
      button.setAttribute("aria-pressed", String(bit === 1));
      button.addEventListener("click", () => {
        bits[index] = bits[index] === 0 ? 1 : 0;

        if (!hasInteracted) {
          hasInteracted = true;
          result.classList.remove("hidden");
          explanation.classList.remove("hidden");
          if (typeof window.markSobatBinerActivity === "function") {
            window.markSobatBinerActivity("unit5Practice");
          }
        }

        updateDisplay();
      });

      column.append(powerLabel, valueLabel, button);
      bitsContainer.appendChild(column);
    });
  }

  updateDisplay();
});
