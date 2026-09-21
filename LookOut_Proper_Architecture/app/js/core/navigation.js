/* =====================================================
   LOOKOUT NAVIGATION
   ===================================================== */

const workspaceIcon =
    document.getElementById("workspaceIcon");

const homeIcon =
    document.getElementById("homeIcon");

const mainContent =
    document.getElementById("mainContent");

function goHome() {

    moveIndicator(homeIcon);

    document
        .querySelector(".sidebar")
        .classList.remove("hidden");

    document
        .querySelector(".main")
        .classList.remove("fullscreen");

    mainContent.innerHTML = `

        <button class="mobile-menu-btn">
            <i class="fa-solid fa-bars"></i>
        </button>

        <h1>LOOKOUT</h1>

        <p class="subtitle">
            What would you like to create today?
        </p>

        <div class="cards">

            <div class="card">
                <h2>AI Generator</h2>

                <p>
                    Create stunning visuals and generate images using AI.
                </p>

                <button onclick="openGenerator()">
                    Get Started
                </button>
            </div>

            <div class="card">
                <h2>Manual Edit</h2>

                <p>
                    Edit images manually using advanced editing tools.
                </p>

                <button onclick="openManualEdit()">
                    Start Editing
                </button>
            </div>

            <div class="card">
                <h2>AI Edit</h2>

                <p>
                    Enhance and transform images intelligently using AI.
                </p>

                <button onclick="openAIEdit()">
                    Try AI Edit
                </button>
            </div>

        </div>
    `;
}

function initializeNavigation() {
    // Navigation uses the global functions provided
    // by the feature modules.
}
