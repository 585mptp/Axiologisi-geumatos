// ===========================
// INITIALIZATION
// ===========================

// Initial local date string function
function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Determine meal period based on local hour
function getMealPeriod() {
    const hour = new Date().getHours();
    if (hour < 11) return "breakfast";
    if (hour < 17) return "lunch";
    return "dinner";
}

// Initialize storage or reset for a new day
function initializeStorage() {
    const today = getLocalDateString();
    const stored = JSON.parse(localStorage.getItem("mealData"));

    if (!stored || stored.date !== today) {
        const newData = {
            date: today,
            sent: false, // not sent yet today
            lastPeriod: getMealPeriod(),
            breakfast: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
            lunch: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
            dinner: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 }
        };
        localStorage.setItem("mealData", JSON.stringify(newData));
        console.log("Storage initialized/reset for new day:", today);
    }
}

// ===========================
// UI HELPERS
// ===========================
function showThanksMessage() {
    const thanks = document.getElementById("thanksMessage");
    if (!thanks) return;

    thanks.style.display = "block";
    thanks.classList.remove("fade-out");

    setTimeout(() => {
        thanks.classList.add("fade-out");
        setTimeout(() => (thanks.style.display = "none"), 500);
    }, 2000);
}

// ===========================
// SAVE RESPONSE
// ===========================
function saveResponse(choice) {
    resetMealIfChanged();
    const data = JSON.parse(localStorage.getItem("mealData"));
    const period = getMealPeriod();

    if (data[period][choice] !== undefined) {
        data[period][choice]++;
        localStorage.setItem("mealData", JSON.stringify(data));
        console.log("Vote saved:", choice, "for", period);
    }

    showThanksMessage();
}

// ===========================
// RESET MEAL IF PERIOD CHANGED
// ===========================
function resetMealIfChanged() {
    const data = JSON.parse(localStorage.getItem("mealData"));
    const currentPeriod = getMealPeriod();

    if (data.lastPeriod !== currentPeriod) {
        data[currentPeriod] = { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 };
        data.lastPeriod = currentPeriod;
        localStorage.setItem("mealData", JSON.stringify(data));
        console.log("Meal period changed! Counts reset for", currentPeriod);
    }
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
            data.sent = true; // mark as sent for today
            localStorage.setItem("mealData", JSON.stringify(data));
            console.log("Daily data sent successfully!");
        }
    } catch (err) {
        console.log("Send failed, will retry later:", err);
    }
}

// ===========================
// AUTO SEND TRIGGERS
// ===========================
function setupAutoSend() {
    setInterval(() => {
        const data = JSON.parse(localStorage.getItem("mealData"));
        const now = new Date();

        // Send once per day, only between 22:00 and 23:59 local time
        if (!data.sent && now.getHours() >= 22) {
            sendDailyData();
        }
    }, 60000); // check every minute
}

// ===========================
// INITIALIZE
// ===========================
window.onload = () => {
    initializeStorage();
    setupAutoSend();
};