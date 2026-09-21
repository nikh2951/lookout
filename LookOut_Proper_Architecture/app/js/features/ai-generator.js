/* =====================================================
   LOOKOUT AI GENERATOR
   ===================================================== */

/* ================= AI GENERATOR PAGE ================= */
function openGenerator() {

    moveIndicator(workspaceIcon);

    // Keep sidebar visible
    document
        .querySelector(".sidebar")
        .classList.remove("hidden");

    // Keep normal main layout
    document
        .querySelector(".main")
        .classList.remove("fullscreen");

    mainContent.innerHTML = `

    <div class="generator-page mobile-generator-page">

        <button class="workspace-menu-btn">

    <i class="fa-solid fa-bars"></i>

</button>

        <!-- IMAGE PREVIEW AREA -->

        <div class="generator-preview mobile-preview">

        </div>

        <!-- BOTTOM PROMPT BAR -->

        <div class="generator-bottom-bar mobile-generator-bar">

            <textarea
            id="generatorPrompt"
            placeholder="Describe the image you want to generate..."
            ></textarea>

            <button
            class="generate-btn"
            id="generateBtn"
            >

                <i class="fa-solid fa-wand-magic-sparkles"></i>

            </button>

        </div>

        <!-- GLOBAL EDIT BUTTON -->

        <div class="global-edit-area">

    <button
    class="main-edit-btn"
    onclick="enableSelectionMode()"
    >

        <i class="fa-solid fa-pen-to-square"></i>

    </button>

</div>

    </div>

    `;
setupGenerator();

loadStoredGeneratedImages();
}
function setupGenerator(){

    const generateBtn =
    document.getElementById("generateBtn");

    const promptInput =
    document.getElementById("generatorPrompt");

    const preview =
    document.querySelector(
    ".generator-preview"
    );

    generateBtn.addEventListener(
        "click",
        async () => {

            const prompt =
            promptInput.value;

            if(!prompt) return;

            /* ================= LOADING ================= */

            let loading =
            document.getElementById("generatorLoading");

            if(!loading){

                loading =
                document.createElement("div");

                loading.id =
                "generatorLoading";

                loading.className =
                "loading-text generator-loading";

                preview.appendChild(loading);
            }

            loading.innerHTML = `


                Generating Image...

            `;

            /* ================= FORM DATA ================= */

            const formData =
            new FormData();

            formData.append(
                "prompt",
                prompt
            );

            formData.append(
                "email",
                localStorage.getItem(
                "userEmail"
                )
            );

            try{

                /* ================= API ================= */

                const response =
                await fetch(
                    `${AI_API_BASE}/generate`,
                    {
                        method:"POST",
                        body:formData
                    }
                );

                const data =
                await response.json();

                if(!data.success){

    console.log(data.error);

    alert(data.error);

    return;
}
        
                console.log(data);

                const generatedUrl =
                resolveGeneratedImageUrl(data) +
                "?t=" +
                Date.now();

                renderGeneratedImageCard(
                    generatedUrl,
                    true
                );

                saveGeneratedImage(generatedUrl);
            }

            catch(error){

    console.error(error);

    const loading =
    document.getElementById("generatorLoading");

    if(loading){

        loading.innerHTML =
        "Failed to generate image";
    }
            }
        }
    );
}

function renderGeneratedImageCard(imageUrl, scrollIntoView){

    const preview =
    document.querySelector(
    ".generator-preview"
    );

    if(!preview || !imageUrl) return;

    const loading =
    document.getElementById("generatorLoading");

    if(loading){

        loading.remove();
    }

    const card =
    document.createElement("div");

    card.className =
    "generated-card";

    const img =
    document.createElement("img");

    img.className =
    "generated-image";

    img.onload = () => {

        console.log("IMAGE LOADED");

        card.appendChild(img);

        card.appendChild(
            createDownloadButton(
                imageUrl,
                "lookout-generated.png"
            )
        );

        preview.appendChild(card);

        if(scrollIntoView){

            card.scrollIntoView({
                behavior:"smooth",
                block:"end"
            });
        }
    };

    img.onerror = () => {

        console.log("FAILED:", img.src);

        card.innerHTML = `
            <div class="loading-text">
                Failed to load image
            </div>
        `;

        preview.appendChild(card);
    };

    img.src =
    imageUrl;
}

function loadStoredGeneratedImages(){

    getStoredGeneratedImages()
    .forEach(url => {

        renderGeneratedImageCard(
            url,
            false
        );
    });
}

/* ================= SELECTION MODE ================= */

let selectedImages = [];

function enableSelectionMode(){

    const cards =
    document.querySelectorAll(
    ".generated-card"
    );

    cards.forEach(card => {

        /* AVOID DUPLICATES */

        if(
            card.querySelector(".select-btn")
        ) return;

        const img =
        card.querySelector("img");

        const button =
        document.createElement("button");

        button.innerText = "Select";

        button.classList.add(
        "select-btn"
        );

        button.onclick = () => {

            const imageUrl = img.src;

            if(
                selectedImages.includes(imageUrl)
            ){

                selectedImages =
                selectedImages.filter(
                    i => i !== imageUrl
                );

                button.classList.remove(
                "selected-image"
                );
            }

            else{

                if(
                    selectedImages.length >= 2
                ){

                    alert(
                    "Only 2 images allowed"
                    );

                    return;
                }

                selectedImages.push(
                imageUrl
                );

                button.classList.add(
                "selected-image"
                );
            }
        };

        card.appendChild(button);
    });

    /* SHOW EDIT OPTIONS */

    showEditOptions();
}

function showEditOptions(){

    if(
        document.querySelector(
            ".edit-choice-area"
        )
    ) return;

    const area =
    document.createElement("div");

    area.classList.add(
    "edit-choice-area"
    );

    area.innerHTML = `

    <button onclick="goToAIEdit()">

        AI Edit

    </button>

    <button onclick="goToManualEdit()">

        Manual Edit

    </button>

    `;

    document
    .querySelector(".generator-page")
    .appendChild(area);
}

function goToAIEdit(){

    if(selectedImages.length === 0){

        alert(
        "Select at least 1 image"
        );

        return;
    }

    localStorage.setItem(

        "editImages",

        JSON.stringify(selectedImages)

    );

    openAIEdit();

    loadSelectedImages();
}

function goToManualEdit(){

    if(selectedImages.length === 0){

        alert(
        "Select at least 1 image"
        );

        return;
    }

    localStorage.setItem(

        "editImages",

        JSON.stringify(selectedImages)

    );

    openManualEdit();
}

function loadSelectedImages(){

    const images = JSON.parse(

        localStorage.getItem(
        "editImages"
        )

    );

    if(!images) return;

    const uploadedImages =
    document.getElementById(
    "uploadedImages"
    );

    const centerUpload =
    document.getElementById(
    "centerUpload"
    );

    const editBottomBar =
    document.getElementById(
    "editBottomBar"
    );

    centerUpload.style.display =
    "none";

    editBottomBar.classList.remove(
    "hidden"
    );

    uploadedImages.innerHTML = "";

    images.forEach(image => {

        const wrapper =
        document.createElement("div");

        wrapper.className =
        "image-wrapper";

        const img =
        document.createElement("img");

        img.src =
        image;

        img.className =
        "preview-image";

        img.style.transform =
        "none";

        wrapper.appendChild(img);

        wrapper.appendChild(
            createDownloadButton(
                image,
                "lookout-selected.png"
            )
        );

        uploadedImages.appendChild(wrapper);
    });
}
