/* =====================================================
   LOOKOUT ACCOUNT
   ===================================================== */

function logout() {
    LookOutStorage.remove("isLoggedIn");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "../login/login.html";
}

function getStoredJSON(key, fallback = {}) {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (error) {
        return fallback;
    }
}

function profileValue(value, fallback = "Not provided") {
    return value && String(value).trim() ? String(value).trim() : fallback;
}

function setProfileText(id, value, fallback) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = profileValue(value, fallback);
}

function initializeAccount() {
    const profile = getStoredJSON("lookoutProfile", {});
    const preferences = getStoredJSON("lookoutPreferences", {});
    const email = localStorage.getItem("userEmail") || "Not available";
    const savedTheme = localStorage.getItem("userTheme") || localStorage.getItem("selectedTheme") || "";
    const photo = localStorage.getItem("userPhoto");

    setProfileText("profileFirstName", profile.firstName);
    setProfileText("profileLastName", profile.lastName);
    setProfileText("profilePhone", profile.phone);
    setProfileText("profileCountry", profile.country);
    setProfileText("profileState", profile.state);
    setProfileText("profileCity", profile.city);
    setProfileText("profileDateOfBirth", profile.dateOfBirth);
    setProfileText("profileEmail", email, "Not available");
    setProfileText("profileTheme", preferences.theme || savedTheme, "Not selected");
    setProfileText("profilePurpose", preferences.purpose, "Not selected");
    setProfileText("profileEditingStyle", preferences.editingStyle, "Not selected");

    const fullName = [profile.firstName, profile.lastName]
        .filter(Boolean)
        .join(" ");

    const title = document.getElementById("profileModalTitle");
    if (title) title.textContent = fullName || "Your Profile";

    const profilePhoto = document.getElementById("profilePhoto");
    const fallback = document.getElementById("profilePhotoFallback");

    if (photo && profilePhoto) {
        profilePhoto.src = photo;
        profilePhoto.style.display = "block";
        if (fallback) fallback.style.display = "none";
    } else if (profilePhoto) {
        profilePhoto.style.display = "none";
        if (fallback) fallback.style.display = "grid";
    }

    const sidebarIcon = document.getElementById("sidebarProfileIcon");
    if (sidebarIcon) {
        if (photo) {
            sidebarIcon.style.backgroundImage = `url("${photo}")`;
            sidebarIcon.style.backgroundSize = "cover";
            sidebarIcon.style.backgroundPosition = "center";
            sidebarIcon.innerHTML = "";
        } else {
            sidebarIcon.style.backgroundImage = "";
            if (!sidebarIcon.innerHTML.trim()) {
                sidebarIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
            }
        }
    }
}

function openProfile() {
    initializeAccount();

    const modal = document.getElementById("profileModal");
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-modal-open");
}

function closeProfile() {
    const modal = document.getElementById("profileModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("profile-modal-open");
}

window.addEventListener("DOMContentLoaded", () => {
    initializeAccount();

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeProfile();
    });

    const profile = document.querySelector(".profile");
    if (profile) {
        profile.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProfile();
            }
        });
    }
});
