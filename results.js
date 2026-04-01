function loadResults() {
    const container = document.getElementById("results");
    const data = JSON.parse(localStorage.getItem("mealRatings"));

    if (!data) {
        container.innerHTML = "<p>Δεν υπάρχουν δεδομένα.</p>";
        return;
    }

    let total = Object.values(data).reduce((sum, val) => sum + val, 0);

    let html = "";

    for (let key in data) {
        const count = data[key];
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

        html += `
            <div class="result-item" style="color: white;">
                <strong>${key}</strong>: ${count} (${percentage}%)
                <div class="bar">
                    <div class="fill" style="width:${percentage}%"></div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}
loadResults();