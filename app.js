// Initialize counts if not present
function initializeStorage() {
    if (!localStorage.getItem("mealRatings")) {
        const initialData = {
            "Άριστο": 0,
            "Καλό": 0,
            "Μέτριο": 0,
            "Κακό": 0,
            "Πολύ κακό": 0
        };
        localStorage.setItem("mealRatings", JSON.stringify(initialData));
    }
}

// Save user response
function saveResponse(choice) {
    let data = JSON.parse(localStorage.getItem("mealRatings"));

    // Increment selected choice
    if (data[choice] !== undefined) {
        data[choice]++;
    }

    // Save back to localStorage
    localStorage.setItem("mealRatings", JSON.stringify(data));

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
}

// Optional: Get results (for debugging or future UI)
function getResults() {
    return JSON.parse(localStorage.getItem("mealRatings"));
}

// Initialize on page load
initializeStorage();