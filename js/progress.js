const SOBATBINER_PROGRESS_KEY = "sobatbinerLearningProgressV2";

const SOBATBINER_ACTIVITIES = [
  { id: "unit1Question", statusId: "unit1-status" },
  { id: "unit2Question", statusId: "unit2-status" },
  { id: "unit3Question", statusId: "unit3-status" },
  { id: "unit4Practice", statusId: "unit4-status" },
  { id: "unit5Practice", statusId: "unit5-status" },
  { id: "unit6Quiz", statusId: "unit6-status" },
];

function getSobatBinerProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(SOBATBINER_PROGRESS_KEY));
    return saved && typeof saved === "object" && !Array.isArray(saved)
      ? saved
      : {};
  } catch (error) {
    console.warn("Data progres SobatBiner tidak dapat dibaca.", error);
    return {};
  }
}

function markSobatBinerActivity(activityId) {
  const isKnown = SOBATBINER_ACTIVITIES.some(
    (activity) => activity.id === activityId,
  );
  if (!isKnown) {
    console.warn(`Aktivitas progres tidak dikenal: ${activityId}`);
    return false;
  }

  const progress = getSobatBinerProgress();
  if (progress[activityId] === true) {
    updateSobatBinerProgress();
    return false;
  }

  progress[activityId] = true;
  try {
    localStorage.setItem(SOBATBINER_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Progres SobatBiner tidak berhasil disimpan.", error);
    return false;
  }

  updateSobatBinerProgress();
  return true;
}

function updateSobatBinerProgress() {
  const progress = getSobatBinerProgress();
  const completed = SOBATBINER_ACTIVITIES.filter(
    (activity) => progress[activity.id] === true,
  ).length;
  const total = SOBATBINER_ACTIVITIES.length;
  const percentage = Math.round((completed / total) * 100);

  const navBar = document.getElementById("nav-progress-bar");
  const navText = document.getElementById("nav-progress-text");
  const homeBar = document.getElementById("home-progress-bar");
  const homeText = document.getElementById("home-progress-text");

  if (navBar) navBar.style.width = `${percentage}%`;
  if (navText) navText.textContent = `${percentage}%`;
  if (homeBar) homeBar.style.width = `${percentage}%`;
  if (homeText) homeText.textContent = `${completed}/${total}`;

  SOBATBINER_ACTIVITIES.forEach((activity, index) => {
    const status = document.getElementById(activity.statusId);
    if (!status) return;
    const isComplete = progress[activity.id] === true;
    status.textContent = isComplete ? "✓ Selesai" : "Belum selesai";
    status.classList.toggle("completed", isComplete);
    status.classList.remove("in-progress");
    status.setAttribute(
      "aria-label",
      `Aktivitas ${index + 1}: ${isComplete ? "selesai" : "belum selesai"}`,
    );
  });

  return { completed, total, percentage };
}

window.markSobatBinerActivity = markSobatBinerActivity;
window.updateSobatBinerProgress = updateSobatBinerProgress;

document.addEventListener("DOMContentLoaded", updateSobatBinerProgress);
window.addEventListener("pageshow", updateSobatBinerProgress);
