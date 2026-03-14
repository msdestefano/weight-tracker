let entries = JSON.parse(localStorage.getItem("weightEntries")) || [];

const weightInput = document.getElementById("weightInput");
const saveBtn = document.getElementById("saveBtn");
const historyTable = document.querySelector("#historyTable tbody");

saveBtn.addEventListener("click", () => {
    const weight = weightInput.value;
    if (!weight) return;

    const today = new Date().toISOString().split("T")[0];

    // Remove existing entry for today
    entries = entries.filter(e => e.date !== today);

    entries.push({ date: today, weight });
    localStorage.setItem("weightEntries", JSON.stringify(entries));

    weightInput.value = "";
    renderTable();
    renderChart();
});

function renderTable() {
    historyTable.innerHTML = "";
    entries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(entry => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${entry.date}</td><td>${entry.weight}</td>`;
            historyTable.appendChild(row);
        });
}

let chart;

function renderChart() {
    const ctx = document.getElementById("weightChart").getContext("2d");

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = sorted.map(e => e.date);
    const data = sorted.map(e => e.weight);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Weight",
                data,
                borderColor: "#007bff",
                fill: false
            }]
        }
    });
}

renderTable();
renderChart();
