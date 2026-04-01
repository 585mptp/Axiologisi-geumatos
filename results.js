function loadResults() {
    const container = document.getElementById("results");
    const data = JSON.parse(localStorage.getItem("mealData"));

    if (!data) {
        container.innerHTML = "<p>Δεν υπάρχουν δεδομένα.</p>";
        return;
    }

    let html = "";

    // Loop through each meal period
    ["breakfast", "lunch", "dinner"].forEach(period => {
        const meal = data[period];
        const total = Object.values(meal).reduce((sum, val) => sum + val, 0);

        html += `<h2 style="color: white;">${capitalize(period)}</h2>`;

        for (let key in meal) {
            const count = meal[key];
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
    });

    container.innerHTML = html;
}

// Helper to capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

loadResults();