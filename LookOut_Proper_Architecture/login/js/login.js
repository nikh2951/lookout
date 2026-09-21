/* ===================================================== */
/* ================= INTRO SCREEN ====================== */
/* ===================================================== */

window.addEventListener(
    "load",
    () => {

        const intro =

        document.getElementById(
        "introScreen"
        );

        const video =

        document.getElementById(
        "introVideo"
        );

        /* ================= PREVENT SCROLL ================= */

        document.body.style.overflow =
        "hidden";

        /* ================= VIDEO ENDED ================= */

        video.addEventListener(
            "ended",
            () => {

                intro.classList.add(
                "hideIntro"
                );

                document.body.style
                .overflow = "auto";
            }
        );

        /* ================= SAFETY ================= */

        setTimeout(() => {

            intro.classList.add(
            "hideIntro"
            );

            document.body.style
            .overflow = "auto";

        }, 7000);
    }
);

/* ================= SCRIPT LOADED ================= */
console.log("SCRIPT LOADED");

const OTP_API_BASE =
    window.LOOKOUT_OTP_API_BASE ||
    "http://localhost:3000/api";

/* ================= ROTATION SYSTEM ================= */
let order = ["profile", "login", "pref"];

/* ================= UPDATE POSITIONS ================= */
function update() {

  const [left, center, right] = order;

  const groups = {
    profile: document.getElementById("profile").closest(".group"),
    login: document.getElementById("login").closest(".group"),
    pref: document.getElementById("pref").closest(".group")
  };

  const cards = {
    profile: document.getElementById("profile"),
    login: document.getElementById("login"),
    pref: document.getElementById("pref")
  };

  const rings = {
    profile: document.getElementById("ring-profile"),
    login: document.getElementById("ring-login"),
    pref: document.getElementById("ring-pref")
  };

  /* REMOVE OLD */
  Object.keys(groups).forEach(id => {

    groups[id].classList.remove(
      "left",
      "center",
      "right"
    );

    cards[id].classList.remove(
      "big",
      "small"
    );

    rings[id].classList.remove(
      "big-ring",
      "small-ring",
      "active-ring"
    );

  });

  /* APPLY NEW */
  groups[left].classList.add("left");
  groups[center].classList.add("center");
  groups[right].classList.add("right");

  cards[center].classList.add("big");

  cards[left].classList.add("small");
  cards[right].classList.add("small");

  rings[center].classList.add(
    "big-ring",
    "active-ring"
  );

  rings[left].classList.add("small-ring");
  rings[right].classList.add("small-ring");
}

/* ================= ROTATE ================= */
function rotateLeft() {

  order = [order[2], order[0], order[1]];

  update();
}

/* ================= CHECK ALL ================= */
function allCompleted() {

  return (
    document.getElementById("profile")
      .classList.contains("done")

    &&

    document.getElementById("login")
      .classList.contains("done")

    &&

    document.getElementById("pref")
      .classList.contains("done")
  );
}

/* ================= SEND OTP ================= */
async function sendOTP() {

  console.log("SEND OTP CLICKED");

  const email =
    document.getElementById("email").value;

  const msg =
    document.getElementById("msg");

  if (!email) {

    msg.innerText = "Enter email ❌";

    return;
  }

  msg.innerText = "Sending OTP...";

  try {

    const res = await fetch(
      `${OTP_API_BASE}/send-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ email })
      }
    );

    const data = await res.json();

    console.log(data);

    if (data.success) {

      msg.innerText = "OTP sent ✅";

      if (data.token) {
        sessionStorage.setItem("otpToken", data.token);
      }

      document.getElementById("otp")
        .style.display = "block";

      document.getElementById("verifyBtn")
        .style.display = "block";

    } else {

      msg.innerText =
        data.message || "Failed ❌";
    }

  } catch (err) {

    console.log("FETCH ERROR:", err);

    msg.innerText = "Server error ❌";
  }
}

/* ================= VERIFY OTP ================= */
async function verifyOTP() {

  const email =
    document.getElementById("email").value;

  const otp =
    document.getElementById("otp").value.trim();

  const msg =
    document.getElementById("msg");

  if (!otp) {

    msg.innerText = "Enter OTP ❌";

    return;
  }

  try {

    const res = await fetch(
      `${OTP_API_BASE}/verify-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          otp,
          token: sessionStorage.getItem("otpToken")
        })
      }
    );

    const data = await res.json();

    console.log(data);

    if (data.success) {

      /* ================= SAVE EMAIL ================= */

      localStorage.setItem(
        "userEmail",
        email
      );

      saveCurrentProfileData();

      sessionStorage.removeItem("otpToken");

      msg.innerText =
        "Login Successful ✅";

      document.getElementById("login")
        .classList.add("done");

      document.getElementById("ring-login")
        .classList.add("ring-green");

      if (!allCompleted()) {

        setTimeout(() => {
          rotateLeft();
        }, 800);
      }

      checkAllDone();

    } else {

      msg.innerText = "Wrong OTP ❌";
    }

  } catch (err) {

    console.log("VERIFY ERROR:", err);

    msg.innerText = "Server error ❌";
  }
}

/* ================= PROFILE STORAGE ================= */
function getProfileInput(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function saveProfileData() {
  const profile = {
    firstName: getProfileInput("firstName"),
    lastName: getProfileInput("lastName"),
    phone: getProfileInput("phoneNumber"),
    country: getProfileInput("country"),
    state: getProfileInput("state"),
    city: getProfileInput("city"),
    dateOfBirth: getProfileInput("dateOfBirth")
  };

  localStorage.setItem("lookoutProfile", JSON.stringify(profile));

  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  if (fullName) {
    localStorage.setItem("userName", fullName);
  }
}

function savePreferenceData() {
  const sections = document.querySelectorAll("#pref .section");

  const preferences = {
    theme: "",
    purpose: "",
    editingStyle: ""
  };

  if (sections[0]) {
    const active = sections[0].querySelector(".option.active");
    preferences.theme = active ? active.innerText.trim() : "";
  }

  if (sections[1]) {
    const active = sections[1].querySelector(".option.active");
    preferences.purpose = active ? active.innerText.trim() : "";
  }

  if (sections[2]) {
    const active = sections[2].querySelector(".option.active");
    preferences.editingStyle = active ? active.innerText.trim() : "";
  }

  localStorage.setItem(
    "lookoutPreferences",
    JSON.stringify(preferences)
  );

  if (preferences.theme) {
    localStorage.setItem(
      "userTheme",
      preferences.theme.toLowerCase()
    );
  }
}

function saveCurrentProfileData() {
  saveProfileData();
  savePreferenceData();
}

/* ================= PROFILE DONE ================= */
function profileDone() {

  const profile = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    country: document.getElementById("country").value.trim(),
    state: document.getElementById("state").value.trim(),
    city: document.getElementById("city").value.trim(),
    dateOfBirth: document.getElementById("dob").value
  };

  /* SAVE PROFILE */
  localStorage.setItem(
    "lookoutProfile",
    JSON.stringify(profile)
  );

  document.getElementById("profile")
    .classList.add("done");

  document.getElementById("ring-profile")
    .classList.add("ring-green");

  if (!allCompleted()) {

    setTimeout(() => {
      rotateLeft();
    }, 800);
  }

  checkAllDone();
}

/* ================= PREF DONE ================= */
function prefDone() {

  savePreferenceData();

  document.getElementById("pref")
    .classList.add("done");

  document.getElementById("ring-pref")
    .classList.add("ring-green");

  if (!allCompleted()) {

    setTimeout(() => {
      rotateLeft();
    }, 800);
  }

  checkAllDone();
}

/* ================= FINAL ANIMATION ================= */
function checkAllDone() {

  if (allCompleted()) {

    const container =
      document.querySelector(".container");

    const finalCard =
      document.getElementById("finalCard");

    order = ["profile", "login", "pref"];

    update();

    /* ALIGN */
    container.classList.add("align");

    /* COLLIDE */
    setTimeout(() => {

      container.classList.add("colliding");

    }, 1200);

    /* COLLAPSE */
    setTimeout(() => {

      container.classList.add("collapse");

    }, 2000);

    /* SHOW FINAL */
    setTimeout(() => {

      finalCard.classList.add("showFinal");

    }, 2400);

    /* ZOOM */
    setTimeout(() => {

      finalCard.classList.add("zoomFull");

    }, 3000);

    /* REDIRECT */
    setTimeout(() => {

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      window.location.href = "../app/home.html";

    }, 3800);
  }
}

/* ================= WAIT FOR DOM ================= */
window.onload = () => {

  console.log("DOM LOADED");

  /* ===== AVATAR ===== */
  document.getElementById("photoUpload")
    .addEventListener("change", function () {

      const file = this.files[0];

      if (file) {

        const reader = new FileReader();

        reader.onload = function (e) {

          const img =
            document.getElementById("avatarPreview");

          const icon =
            document.querySelector(".avatar-icon");

          img.src = e.target.result;

          localStorage.setItem("userPhoto", e.target.result);

          img.style.display = "block";

          icon.style.display = "none";
        };

        reader.readAsDataURL(file);
      }
    });

  /* ===== OPTIONS ===== */
  document.querySelectorAll(".option")
    .forEach(option => {

      option.addEventListener("click", function () {

        const parent = this.parentElement;

        parent.querySelectorAll(".option")
          .forEach(o => {
            o.classList.remove("active");
          });

        this.classList.add("active");
      });

    });

  /* ===== LOAD SAVED PROFILE ===== */
  try {
    const savedProfile = JSON.parse(
      localStorage.getItem("lookoutProfile") || "{}"
    );

    Object.entries({
      firstName: "firstName",
      lastName: "lastName",
      phone: "phoneNumber",
      country: "country",
      state: "state",
      city: "city",
      dateOfBirth: "dateOfBirth"
    }).forEach(([key, id]) => {
      const field = document.getElementById(id);
      if (field && savedProfile[key]) field.value = savedProfile[key];
    });

    const savedPhoto = localStorage.getItem("userPhoto");
    if (savedPhoto) {
      const img = document.getElementById("avatarPreview");
      const icon = document.querySelector(".avatar-icon");
      if (img) {
        img.src = savedPhoto;
        img.style.display = "block";
      }
      if (icon) icon.style.display = "none";
    }
  } catch (error) {
    console.warn("Could not load saved profile:", error);
  }

  /* ===== INIT ===== */
  update();
};

/* ===================================================== */
/* ================= THEME OPTIONS ===================== */
/* ===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ================= THEME OPTIONS ================= */

        const themeOptions =

        document.querySelectorAll(
        "#pref .section:first-of-type .option"
        );

        /* ================= CLICK ================= */

        themeOptions.forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    /* REMOVE ACTIVE */

                    themeOptions.forEach(o => {

                        o.classList.remove(
                        "active"
                        );
                    });

                    /* ACTIVE */

                    option.classList.add(
                    "active"
                    );

                    /* GET THEME */

                    const selectedTheme =

                    option.innerText
                    .trim()
                    .toLowerCase();

                    /* SAVE */

                    localStorage.setItem(
                        "selectedTheme",
                        selectedTheme
                    );

                    /* APPLY */

                    if(selectedTheme === "dark"){

                        document.body.classList.add(
                        "dark-mode"
                        );
                    }

                    else{

                        document.body.classList.remove(
                        "dark-mode"
                        );
                    }
                }
            );
        });

        /* ================= LOAD SAVED ================= */

        const savedTheme =

        localStorage.getItem(
        "selectedTheme"
        );

        if(savedTheme === "dark"){

            document.body.classList.add(
            "dark-mode"
            );

            themeOptions.forEach(option => {

                option.classList.remove(
                "active"
                );

                if(

                    option.innerText
                    .trim()
                    .toLowerCase()

                    === "dark"
                ){

                    option.classList.add(
                    "active"
                    );
                }
            });
        }
    }
);
