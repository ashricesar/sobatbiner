document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "sobatBinerUnit6QuizStateV1";
  const PROGRESS_KEY = "sobatbinerLearningProgressV2";
  const questionArea = document.getElementById("questionArea");
  const confirmButton = document.getElementById("confirmButton");
  const validationMessage = document.getElementById("validationMessage");
  const progressBar = document.getElementById("quizProgressBar");
  const progressText = document.getElementById("quizProgressText");
  const timerElement = document.getElementById("timer");
  const questionCard = document.getElementById("questionCard");
  const progressArea = document.getElementById("quizProgressArea");
  const resultCard = document.getElementById("resultCard");
  const startModal = document.getElementById("startModal");
  const violationModal = document.getElementById("violationModal");

  const questionBank = {
    // BANK SOAL NOMOR 4
    soal4: [
      {
        question: "Bagaimana cara membaca posisi setiap digit?",
        options: [
          "Dimulai dari digit sebelah kiri, berurutan sampai digit paling kanan",
          "Dimulai dari digit sebelah kanan, berurutan sampai digit paling kiri",
          "Dimulai dari digit sebelah kiri, semua nilai tempatnya sama",
        ],
        answer: 1,
      },
      {
        question: "Ke arah mana nilai tempat bilangan biner semakin besar?",
        options: [
          "Semakin ke kanan",
          "Ke semua arah dengan nilai yang sama",
          "Semakin ke kiri",
        ],
        answer: 2,
      },
      {
        question:
          "Digit paling kanan pada bilangan biner menempati posisi pangkat berapa?",
        options: ["Pangkat 0", "Pangkat 1", "Pangkat 2"],
        answer: 0,
      },
    ],

    // BANK SOAL NOMOR 5
    soal5: [
      {
        question: "Pernyataan mana yang salah terkait sistem bilangan biner?",
        options: [
          "Setiap bergerak satu posisi ke kiri, nilai tempatnya menjadi dua kali lipat",
          "Sistem bilangan yang hanya menggunakan angka 0 dan 1",
          "Untuk mendapatkan digit biner, bilangan desimal harus dikalikan dengan 2 secara berulang",
        ],
        answer: 2,
      },
      {
        question:
          "Manakah pernyataan yang salah tentang sistem bilangan biner?",
        options: [
          "Sistem bilangan biner memiliki basis 2",
          "Sistem bilangan biner menggunakan angka 0 sampai 9",
          "Digit yang digunakan dalam sistem biner adalah 0 dan 1",
        ],
        answer: 1,
      },
      {
        question:
          "Pernyataan mana yang tidak tepat tentang nilai tempat biner?",
        options: [
          "Nilai tempat paling kanan adalah 1",
          "Nilai tempat bergerak ke kiri menjadi dua kali lipat",
          "Semua posisi dalam bilangan biner memiliki nilai tempat yang sama",
        ],
        answer: 2,
      },
    ],
  };

  let questions = [];
  let userAnswers = [];
  let answerResults = [];
  let currentQuestion = 0;
  let startTime = null;
  let timerInterval = null;
  let quizStarted = false;
  let quizFinished = false;
  let violationPending = false;
  let isRestoring = false;
  let isNavigatingAway = false;

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function randomFiveDigitBinary() {
    let binary;
    do {
      binary = "0" + randomNumber(0, 15).toString(2).padStart(4, "0");
    } while (
      (binary.match(/1/g) || []).length < 2 ||
      (binary.match(/1/g) || []).length > 3
    );
    return binary;
  }

  function prepareQuestions() {
    const decimal = randomNumber(1, 50);
    const binaryForDecimal = randomFiveDigitBinary();
    const binaryForPlaces = randomFiveDigitBinary();
    const q4 =
      questionBank.soal4[randomNumber(0, questionBank.soal4.length - 1)];
    const q5 =
      questionBank.soal5[randomNumber(0, questionBank.soal5.length - 1)];

    questions = [
      {
        type: "binaryToggle",
        question: `1. Berapa nilai biner dari desimal: ${decimal}`,
        answer: decimal.toString(2).padStart(8, "0"),
      },
      {
        type: "input",
        question: `2. Berapa nilai desimal dari biner: ${binaryForDecimal}`,
        binary: binaryForDecimal,
        answer: parseInt(binaryForDecimal, 2).toString(),
      },
      {
        type: "placeValue",
        question: `3. Berapa nilai tempat dari masing-masing digit biner ini: ${binaryForPlaces}`,
        digits: binaryForPlaces,
        answer: binaryForPlaces
          .split("")
          .map((digit, index) => (Number(digit) * 2 ** (4 - index)).toString()),
      },
      {
        type: "choice",
        question: `4. ${q4.question}`,
        options: shuffle(
          q4.options.map((text, index) => ({
            text,
            correct: index === q4.answer,
          })),
        ),
      },
      {
        type: "choice",
        question: `5. ${q5.question}`,
        options: shuffle(
          q5.options.map((text, index) => ({
            text,
            correct: index === q5.answer,
          })),
        ),
      },
    ];
    userAnswers = [];
    answerResults = [];
    currentQuestion = 0;
    quizFinished = false;
    quizStarted = false;
    startTime = null;
    saveState();
  }

  function saveState() {
    if (isRestoring) return;
    const state = {
      questions,
      userAnswers,
      answerResults,
      currentQuestion,
      startTime,
      quizStarted,
      quizFinished,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Status kuis Unit 6 tidak dapat disimpan.", error);
    }
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (
        !saved ||
        !Array.isArray(saved.questions) ||
        saved.questions.length !== 5
      )
        return false;
      isRestoring = true;
      questions = saved.questions;
      userAnswers = Array.isArray(saved.userAnswers) ? saved.userAnswers : [];
      answerResults = Array.isArray(saved.answerResults)
        ? saved.answerResults
        : [];
      currentQuestion = Math.min(
        Math.max(Number(saved.currentQuestion) || 0, 0),
        5,
      );
      startTime = saved.startTime || null;
      quizStarted = saved.quizStarted === true;
      quizFinished = saved.quizFinished === true;
      isRestoring = false;
      return true;
    } catch (error) {
      isRestoring = false;
      return false;
    }
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function elapsedSeconds() {
    return startTime
      ? Math.max(0, Math.floor((Date.now() - startTime) / 1000))
      : 0;
  }

  function updateTimer() {
    timerElement.textContent = formatTime(elapsedSeconds());
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateProgress() {
    const completed = currentQuestion;
    progressBar.style.width = `${(completed / 5) * 100}%`;
    progressText.textContent = `${completed}/5`;
  }

  function showQuestion() {
    const q = questions[currentQuestion];
    if (!q) return;
    validationMessage.textContent = "";
    let html = `<h2 class="unit6-question-title">${q.question}</h2>`;

    if (q.type === "binaryToggle") {
      html +=
        '<div class="unit6-binary-grid" id="binaryGrid" aria-label="Masukkan delapan digit biner">';
      for (let i = 0; i < 8; i++) {
        html += `<button class="unit6-bit" type="button" data-index="${i}" aria-pressed="false">0</button>`;
      }
      html += "</div>";
    } else if (q.type === "input") {
      html +=
        '<input class="unit6-answer-input" id="decimalAnswer" type="number" inputmode="numeric" step="1" placeholder="-" aria-label="Jawaban desimal">';
    } else if (q.type === "placeValue") {
      html += '<div class="unit6-place-grid">';
      for (let i = 0; i < 5; i++) {
        html += `<input class="unit6-place-input placeAnswer" type="number" inputmode="numeric" step="1" min="0" max="16" placeholder="-" aria-label="Nilai digit ke-${i + 1}">`;
      }
      html += "</div>";
    } else if (q.type === "choice") {
      html += '<div class="unit6-choice-list">';
      q.options.forEach((option, index) => {
        html += `<label class="unit6-choice"><input type="radio" name="unit6Choice" value="${index}"><span>${option.text}</span></label>`;
      });
      html += "</div>";
    }

    questionArea.innerHTML = html;
    confirmButton.textContent = "Konfirmasi →";
    confirmButton.disabled = false;
    updateProgress();
    restoreCurrentAnswer();
  }

  function restoreCurrentAnswer() {
    const savedAnswer = userAnswers[currentQuestion];
    if (savedAnswer === undefined) return;
    const q = questions[currentQuestion];
    if (q.type === "binaryToggle" && typeof savedAnswer === "string") {
      document
        .querySelectorAll(".unit6-bit")
        .forEach((button, index) =>
          setBitButton(button, savedAnswer[index] === "1"),
        );
    } else if (q.type === "input") {
      document.getElementById("decimalAnswer").value = savedAnswer;
    } else if (q.type === "placeValue" && Array.isArray(savedAnswer)) {
      document
        .querySelectorAll(".placeAnswer")
        .forEach((input, index) => (input.value = savedAnswer[index] ?? ""));
    } else if (q.type === "choice") {
      const radio = document.querySelector(
        `input[name="unit6Choice"][value="${Number(savedAnswer)}"]`,
      );
      if (radio) radio.checked = true;
    }
  }

  function setBitButton(button, isOne) {
    button.textContent = isOne ? "1" : "0";
    button.classList.toggle("active", isOne);
    button.setAttribute("aria-pressed", String(isOne));
  }

  function getCurrentAnswer() {
    const q = questions[currentQuestion];
    if (q.type === "binaryToggle") {
      return Array.from(document.querySelectorAll(".unit6-bit"))
        .map((button) => button.textContent)
        .join("");
    }
    if (q.type === "input")
      return document.getElementById("decimalAnswer").value.trim();
    if (q.type === "placeValue")
      return Array.from(document.querySelectorAll(".placeAnswer")).map(
        (input) => input.value.trim(),
      );
    const selected = document.querySelector(
      'input[name="unit6Choice"]:checked',
    );
    return selected ? selected.value : "";
  }

  function isAnswerComplete(answer, type) {
    if (type === "binaryToggle")
      return typeof answer === "string" && answer.length === 8;
    if (type === "input")
      return (
        answer !== "" &&
        Number.isFinite(Number(answer)) &&
        Number.isInteger(Number(answer))
      );
    if (type === "placeValue")
      return (
        Array.isArray(answer) &&
        answer.length === 5 &&
        answer.every(
          (value) =>
            value !== "" &&
            Number.isFinite(Number(value)) &&
            Number.isInteger(Number(value)),
        )
      );
    return answer !== "";
  }

  function evaluateAnswer(q, answer) {
    if (q.type === "binaryToggle") return answer === q.answer;
    if (q.type === "input") return String(Number(answer)) === q.answer;
    if (q.type === "placeValue")
      return answer.every(
        (value, index) => String(Number(value)) === q.answer[index],
      );
    return q.options[Number(answer)]?.correct === true;
  }

  function confirmAnswer() {
    if (quizFinished || !quizStarted) return;
    const q = questions[currentQuestion];
    const answer = getCurrentAnswer();
    if (!isAnswerComplete(answer, q.type)) {
      validationMessage.textContent =
        "Silakan isi atau pilih jawaban terlebih dahulu.";
      return;
    }

    userAnswers[currentQuestion] = answer;
    answerResults[currentQuestion] = evaluateAnswer(q, answer);
    currentQuestion++;
    saveState();
    updateProgress();

    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  }

  function markUnit6Complete() {
    // Fungsi progres global bersifat satu kali; pengulangan kuis tidak menambah progres
    if (typeof window.markSobatBinerActivity === "function") {
      window.markSobatBinerActivity("unit6Quiz");
    }
  }

  function finishQuiz() {
    quizFinished = true;
    if (timerInterval) clearInterval(timerInterval);
    saveState();
    updateProgress();
    questionCard.classList.add("hidden");
    progressArea.classList.add("hidden");
    resultCard.classList.remove("hidden");

    const score = answerResults.filter(Boolean).length;
    if (typeof window.playSobatSfx === "function") {
      window.playSobatSfx(score === 5 ? "applause" : "magic");
    }
    const duration = elapsedSeconds();
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    document.getElementById("scoreText").textContent = `${score}/5`;
    document.getElementById("durationText").textContent =
      `Lama pengerjaan ${String(minutes).padStart(2, "0")} menit ${String(seconds).padStart(2, "0")} detik`;

    let appreciation = "Tetap semangat! Terus berlatih, kamu pasti bisa!";
    if (score === 5) appreciation = "Kamu adalah master Binary!";
    else if (score === 4) appreciation = "Hebat! Tinggal satu lagi!";
    document.getElementById("appreciationText").textContent = appreciation;

    const resultsContainer = document.getElementById("answerResults");
    resultsContainer.replaceChildren();
    answerResults.forEach((isCorrect, index) => {
      const row = document.createElement("div");
      row.className = "unit6-answer-row";
      const label = document.createElement("span");
      label.textContent = `Soal ${index + 1}`;
      const status = document.createElement("span");
      status.className = `unit6-answer-status ${isCorrect ? "correct" : "incorrect"}`;
      status.textContent = isCorrect ? "Benar" : "Salah";
      row.append(label, status);
      resultsContainer.appendChild(row);
    });
    markUnit6Complete();
  }

  function resetOnlyUnit6Progress() {
    try {
      const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
      delete progress.unit6Quiz;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      if (typeof window.updateSobatBinerProgress === "function")
        window.updateSobatBinerProgress();
    } catch (error) {
      console.warn("Progres Unit 6 tidak dapat diperbarui.", error);
    }
  }

  function triggerViolation() {
    if (!quizStarted || quizFinished || violationPending) return;
    violationPending = true;
    if (timerInterval) clearInterval(timerInterval);
    resetOnlyUnit6Progress();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {}
    questions = [];
    userAnswers = [];
    answerResults = [];
    currentQuestion = 0;
    quizStarted = false;
    quizFinished = false;
    violationModal.classList.remove("hidden");
    if (typeof window.playSobatSfx === "function") window.playSobatSfx("wrong");
  }

  function beginNewAttempt() {
    prepareQuestions();
    startTime = Date.now();
    quizStarted = true;
    saveState();
    resultCard.classList.add("hidden");
    questionCard.classList.remove("hidden");
    progressArea.classList.remove("hidden");
    timerElement.textContent = "00:00";
    showQuestion();
    startTimer();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".unit6-bit");
    if (!button || !quizStarted) return;
    const isOne = button.textContent === "0";
    setBitButton(button, isOne);
    const answer = getCurrentAnswer();
    userAnswers[currentQuestion] = answer;
    saveState();
  });

  confirmButton.addEventListener("click", confirmAnswer);
  document.getElementById("startButton").addEventListener("click", () => {
    startModal.classList.add("hidden");
    beginNewAttempt();
  });
  document
    .getElementById("retryButton")
    .addEventListener("click", beginNewAttempt);
  document.getElementById("violationOkButton").addEventListener("click", () => {
    violationModal.classList.add("hidden");
    violationPending = false;
    beginNewAttempt();
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("#decimalAnswer, .placeAnswer")) {
      userAnswers[currentQuestion] = getCurrentAnswer();
      saveState();
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches('input[name="unit6Choice"]')) {
      userAnswers[currentQuestion] = getCurrentAnswer();
      saveState();
    }
  });

  // Refresh/navigasi halaman biasa tidak dihitung sebagai pelanggaran
  window.addEventListener("beforeunload", () => {
    isNavigatingAway = true;
  });

  // Mendeteksi ketika halaman tidak terlihat
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && !isNavigatingAway)
      triggerViolation();
  });

  // Mendeteksi ketika jendela halaman kehilangan fokus
  window.addEventListener("blur", () => {
    if (!isNavigatingAway) {
      triggerViolation();
    }
  });

  if (loadState()) {
    if (quizFinished) {
      questionCard.classList.add("hidden");
      progressArea.classList.add("hidden");
      resultCard.classList.remove("hidden");
      const score = answerResults.filter(Boolean).length;
      document.getElementById("scoreText").textContent = `${score}/5`;
      const duration = elapsedSeconds();
      document.getElementById("durationText").textContent =
        `Lama pengerjaan ${String(Math.floor(duration / 60)).padStart(2, "0")} menit ${String(duration % 60).padStart(2, "0")} detik`;
      document.getElementById("appreciationText").textContent =
        score === 5
          ? "Kamu adalah master Binary!"
          : score === 4
            ? "Hebat! Tinggal satu lagi!"
            : "Tetap semangat! Terus berlatih, kamu pasti bisa!";
      answerResults.forEach((isCorrect, index) => {
        const row = document.createElement("div");
        row.className = "unit6-answer-row";
        const label = document.createElement("span");
        label.textContent = `Soal ${index + 1}`;
        const status = document.createElement("span");
        status.className = `unit6-answer-status ${isCorrect ? "correct" : "incorrect"}`;
        status.textContent = isCorrect ? "Benar" : "Salah";
        row.append(label, status);
        document.getElementById("answerResults").appendChild(row);
      });
    } else if (quizStarted) {
      showQuestion();
      startTimer();
    } else {
      startModal.classList.remove("hidden");
      if (typeof window.playSobatSfx === "function")
        window.playSobatSfx("notif");
    }
  } else {
    prepareQuestions();
    startModal.classList.remove("hidden");
    if (typeof window.playSobatSfx === "function") window.playSobatSfx("notif");
  }
});
