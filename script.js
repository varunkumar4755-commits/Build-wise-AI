const STORAGE_KEY = "buildwise-history";

const typeEl = document.getElementById("projectType");
const budgetEl = document.getElementById("budget");
const complexityEl = document.getElementById("complexity");
const runBtn = document.getElementById("runBtn");
const historyEl = document.getElementById("historyList");
const themeBtn = document.getElementById("themeBtn");

let barChart, pieChart;

function generatePlan(type, budget, complexity) {

  const base = {
    residential: [
      { phase: "Foundation", percent: 30 },
      { phase: "Structure", percent: 40 },
      { phase: "Finishing", percent: 30 }
    ],
    commercial: [
      { phase: "Compliance", percent: 25 },
      { phase: "Core Build", percent: 45 },
      { phase: "Deployment", percent: 30 }
    ],
    renovation: [
      { phase: "Assessment", percent: 25 },
      { phase: "Upgrades", percent: 45 },
      { phase: "Finish", percent: 30 }
    ]
  };

  const mult = complexity === "advanced" ? 1.2 : 1;

  return base[type].map(p => ({
    ...p,
    cost: Math.round(budget * p.percent / 100 * mult)
  }));
}

function saveHistory(r) {
  const h = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  h.unshift(r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0,10)));
  renderHistory();
}

function renderHistory() {
  const h = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  historyEl.innerHTML = h.length
    ? ""
    : "No saved projects yet.";

  h.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${p.projectType}</b> — ₹${p.budget}<br><small>${p.date}</small>`;
    historyEl.appendChild(div);
  });
}

runBtn.onclick = () => {

  const type = typeEl.value;
  const budget = Number(budgetEl.value || 0);
  const complexity = complexityEl.value;

  const plan = generatePlan(type, budget, complexity);

  saveHistory({
    id: Date.now(),
    projectType: type,
    budget,
    date: new Date().toLocaleString()
  });

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: plan.map(p => p.phase),
      datasets: [{
        label: "Cost (₹)",
        data: plan.map(p => p.cost),
        borderRadius: 10
      }]
    },
    options: {
      animation: {
        duration: 1600,
        easing: "easeOutElastic"
      },
      maintainAspectRatio: false
    }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: plan.map(p => p.phase),
      datasets: [{
        data: plan.map(p => p.percent)
      }]
    },
    options: {
      animation: {
        animateRotate: true,
        duration: 1800
      },
      maintainAspectRatio: false
    }
  });
};

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
};

renderHistory();
