function toggleDarkMode() {
    const body = document.body;
    const button = document.getElementById("darkModeToggle");

    // Toggle dark mode class
    body.classList.toggle("dark-mode");

    // Update button text
    if (body.classList.contains("dark-mode")) {
        button.textContent = "Light Mode";
        localStorage.setItem("darkMode", "enabled"); // Save preference
    } else {
        button.textContent = "Dark Mode";
        localStorage.setItem("darkMode", "disabled"); // Save preference
    }
}

// Check localStorage when the page loads
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const button = document.getElementById("darkModeToggle");

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        button.textContent = "Light Mode";
    } else {
        button.textContent = "Dark Mode";
    }
});
