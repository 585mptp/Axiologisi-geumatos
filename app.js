// ===========================
// LOCAL TIME HELPERS
// ===========================
function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getMealPeriod() {
    const hour = new Date().getHours();
    console.log("[getMealPeriod] Current hour:", hour);
    if (hour < 11) return "breakfast";
    if (hour < 17) return "lunch";
    return "dinner";
}

// ===========================
// INITIALIZATION
// ===========================
function initializeStorage() {
    const today = getLocalDateString();
    let stored = JSON.parse(localStorage.getItem("mealData"));
    console.log("[initializeStorage] Stored data before init:", stored);

    if (!stored || stored.date !== today) {
        const newData = {
            date: today,
            sent: false,
            lastPeriod: getMealPeriod(),
            breakfast: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
            lunch: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
            dinner: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 }
        };
        localStorage.setItem("mealData", JSON.stringify(newData));
        console.log("[initializeStorage] Storage initialized for new day:", newData);
    } else {
        console.log("[initializeStorage] Storage already up-to-date for today:", stored);
    }
}

// ===========================
// RESET MEAL PERIOD IF CHANGED
// ===========================
function resetMealIfChanged() {
    const data = JSON.parse(localStorage.getItem("mealData"));
    const currentPeriod = getMealPeriod();
    console.log("[resetMealIfChanged] Current period:", currentPeriod, "Last period:", data.lastPeriod);

    if (data.lastPeriod !== currentPeriod) {
        data[currentPeriod] = { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 };
        data.lastPeriod = currentPeriod;
        localStorage.setItem("mealData", JSON.stringify(data));
        console.log("[resetMealIfChanged] Counts reset for new period:", currentPeriod, data);
    } else {
        console.log("[resetMealIfChanged] No period change, counts unchanged.");
    }
}

// ===========================
// SAVE RESPONSE
// ===========================
function saveResponse(choice) {
    console.log("[saveResponse] Button clicked, choice:", choice);
    resetMealIfChanged();
    const data = JSON.parse(localStorage.getItem("mealData"));
    const period = getMealPeriod();

    if (data[period][choice] !== undefined) {
        data[period][choice]++;
        localStorage.setItem("mealData", JSON.stringify(data));

        // Show thank you message
        const thanks = document.getElementById("thanksMessage");
        // Εμφάνιση
        thanks.style.display = "block";
        thanks.classList.remove("fade-out");

        // Εξαφάνιση μετά από 2s
        setTimeout(() => {
            thanks.classList.add("fade-out");

            // τελείως hide μετά το animation
            setTimeout(() => {
                thanks.style.display = "none";
            }, 500);
        }, 2000);
        console.log("[saveResponse] Vote saved:", choice, "for period:", period, "Updated data:", data);
    } else {
        console.warn("[saveResponse] Invalid choice:", choice);
    }
}

// ===========================
// SEND DAILY DATA
// ===========================
async function sendDailyData() {
    const data = JSON.parse(localStorage.getItem("mealData"));
    console.log("[sendDailyData] Preparing to send data:", data);

    if (!data || data.sent) {
        console.log("[sendDailyData] Data already sent or empty, skipping.");
        return;
    }

    try {
        const res = await fetch("/api/save-day", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            data.sent = true;
            localStorage.setItem("mealData", JSON.stringify(data));
            console.log("[sendDailyData] Daily data sent successfully!");
        } else {
            console.warn("[sendDailyData] Failed to send, server returned status:", res.status);
        }
    } catch (err) {
        console.error("[sendDailyData] Send failed, will retry later:", err);
    }
}

// ===========================
// AUTO SEND
// ===========================
function setupAutoSend() {
    setInterval(() => {
        const data = JSON.parse(localStorage.getItem("mealData"));
        const now = new Date();
        console.log("[setupAutoSend] Checking if should send data. Hour:", now.getHours(), "Sent:", data.sent);

        if (!data.sent && now.getHours() >= 22) {
            console.log("[setupAutoSend] Sending daily data...");
            sendDailyData();
        }
    }, 60000);
}

// ===========================
// INITIALIZE
// ===========================
window.onload = () => {
    console.log("[window.onload] Initializing storage and auto-send...");
    initializeStorage();
    setupAutoSend();
};

// function clearAllData() {
//     const confirmReset = confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις όλα τα δεδομένα;");
//     if (!confirmReset) return;

//     const newData = {
//         date: getLocalDateString(),
//         sent: false,
//         lastPeriod: getMealPeriod(),
//         breakfast: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
//         lunch: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 },
//         dinner: { "Άριστο": 0, "Καλό": 0, "Μέτριο": 0, "Κακό": 0, "Πολύ κακό": 0 }
//     };

//     localStorage.setItem("mealData", JSON.stringify(newData));

//     console.log("[clearAllData] All data reset:", newData);

//     alert("Τα δεδομένα μηδενίστηκαν!");

//     // Optional: reload page to refresh UI
//     location.reload();
// }