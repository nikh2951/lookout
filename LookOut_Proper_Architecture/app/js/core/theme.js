/* =====================================================
   LOOKOUT THEME
   ===================================================== */

function loadSavedTheme() {

    const savedTheme =
        LookOutStorage.get(
            "selectedTheme"
        );

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const currentTheme =
        document.body.classList.contains(
            "dark-mode"
        )
            ? "dark"
            : "light";

    LookOutStorage.set(
        "selectedTheme",
        currentTheme
    );
}

function initializeTheme() {

    loadSavedTheme();

    const themeBtn =
        document.getElementById(
            "themeToggle"
        );

    if (!themeBtn) return;

    themeBtn.addEventListener(
        "click",
        toggleTheme
    );
}
