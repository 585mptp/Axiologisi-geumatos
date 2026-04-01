// ===========================
// INITIALIZATION
// ===========================
const initialData = {
    date: new Date().toISOString().split("T")[0],
    sent: false,
    breakfast: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
    lunch: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
    dinner: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 }
};

function initializeStorage() {
    const stored = JSON.parse(localStorage.getItem("mealData"));
    const today = new Date().toISOString().split("T")[0];

    if (!stored || stored.date !== today) {
        localStorage.setItem("mealData", JSON.stringify({ ...initialData, date: today }));
    }
}

// ===========================
// HELPER FUNCTIONS
// ===========================
function getMealPeriod() {
    const hour = new Date().getHours();
    console.log("Current hour:", hour);
    if (hour < 11) return "breakfast";
    if (hour < 17) return "lunch";
    return "dinner";
}

function showThanksMessage() {
    const thanks = document.getElementById("thanksMessage");
    thanks.style.display = "block";
    thanks.classList.remove("fade-out");

    setTimeout(() => {
        thanks.classList.add("fade-out");
        setTimeout(() => {
            thanks.style.display = "none";
        }, 500);
    }, 2000);
}

// ===========================
// SAVE RESPONSE (BUTTON CLICK)
// ===========================
function saveResponse(choice) {
    resetMealIfChanged(); // <- new
    const data = JSON.parse(localStorage.getItem("mealData"));
    const period = getMealPeriod();

    if (data[period][choice] !== undefined) {
        data[period][choice]++;
    }

    localStorage.setItem("mealData", JSON.stringify(data));
    showThanksMessage();
}

// ===========================
// SEND DAILY DATA
// ===========================
async function sendDailyData() {
    const data = JSON.parse(localStorage.getItem("mealData"));

    if (!data || data.sent) return;

    try {
        const res = await fetch("/api/save-day", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            data.sent = true;
            localStorage.setItem("mealData", JSON.stringify(data));
            console.log("Daily data sent successfully!");
            // Reset all counts for next day
            const newData = {
                date: new Date().toISOString().split("T")[0],
                sent: false,
                breakfast: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
                lunch: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
                dinner: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 }
            };
            localStorage.setItem("mealData", JSON.stringify(newData));
        }
    } catch (err) {
        console.log("Send failed, will retry later:", err);
    }
}

// ===========================
// AUTO SEND TRIGGERS
// ===========================
function setupAutoSend() {
    // Retry every minute after 22:30
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 23 && now.getMinutes() >= 30) {
            sendDailyData();
        }
    }, 60000);

    // Also send on page load if data not sent
    const data = JSON.parse(localStorage.getItem("mealData"));
    const now = new Date();
    if (now.getHours() >= 22 && !data.sent) {
        sendDailyData();
    }
}

// ===========================
// INITIALIZE
// ===========================
window.onload = () => {
    initializeStorage();
    setupAutoSend();
};

function resetMealIfChanged() {
    const data = JSON.parse(localStorage.getItem("mealData"));
    const currentPeriod = getMealPeriod();

    // Track last period
    if (!data.lastPeriod) data.lastPeriod = currentPeriod;

    if (data.lastPeriod !== currentPeriod) {
        // Reset counts for the new period
        data[currentPeriod] = {
            "Άριστο": 0,
            "Καλό": 0,
            "Μέτριο": 0,
            "Κακό": 0,
            "Πολύ κακό": 0
        };
        data.lastPeriod = currentPeriod; // update lastPeriod
        localStorage.setItem("mealData", JSON.stringify(data));
    }
}