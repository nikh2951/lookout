/* =====================================================
   LOOKOUT SIDEBAR
   ===================================================== */

const activeIndicator =
    document.getElementById("activeIndicator");

function moveIndicator(element) {

    if (!element || !activeIndicator) return;

    const top =
        element.offsetTop;

    activeIndicator.style.transform =
        `translateY(${top}px)`;

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {
            item.classList.remove("selected");
        });

    element.classList.add("selected");
}

/* Workspace/mobile menu */

document.addEventListener(
    "click",
    function (e) {

        const menuBtn =
            e.target.closest(
                ".workspace-menu-btn, .mobile-menu-btn"
            );

        if (!menuBtn) return;

        const sidebar =
            document.querySelector(".sidebar");

        const main =
            document.querySelector(".main");

        if (!sidebar) return;

        if (window.innerWidth <= 768) {

            sidebar.classList.remove("hidden");
            sidebar.classList.toggle("active");

            return;
        }

        sidebar.classList.toggle("hidden");

        if (main) {
            main.classList.toggle("fullscreen");
        }
    }
);
