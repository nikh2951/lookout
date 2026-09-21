/* =====================================================
   LOOKOUT APPLICATION STARTUP
   ===================================================== */

function initializeLookOut() {

    initializeTheme();
    initializeNavigation();
    initializeAccount();

    // Start on the Home screen.
    goHome();
}

document.addEventListener(
    "DOMContentLoaded",
    initializeLookOut
);
