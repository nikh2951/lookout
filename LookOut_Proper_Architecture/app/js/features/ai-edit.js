/* =====================================================
   LOOKOUT AI EDIT
   ===================================================== */

const AI_EDIT_MAX_IMAGES = 2;

const AI_EDIT_OPERATIONS = {
    custom: {
        label: "Custom",
        icon: "fa-wand-magic-sparkles",
        placeholder: "Describe exactly what you want to change..."
    },

    enhance: {
        label: "Enhance",
        icon: "fa-sparkles",
        placeholder: "Example: improve sharpness, skin detail and lighting..."
    },

    remove_object: {
        label: "Remove Object",
        icon: "fa-eraser",
        placeholder: "Example: remove the person standing on the left..."
    },

    add_object: {
        label: "Add Object",
        icon: "fa-plus",
        placeholder: "Example: add a red sports car beside the subject..."
    },

    background_remove: {
        label: "Remove Background",
        icon: "fa-scissors",
        placeholder: "Optional: describe how the isolated subject should look..."
    },

    background_replace: {
        label: "Replace Background",
        icon: "fa-image",
        placeholder: "Example: replace the background with a modern studio..."
    },

    sky_replace: {
        label: "Replace Sky",
        icon: "fa-cloud-sun",
        placeholder: "Example: replace the sky with a dramatic sunset..."
    },

    age: {
        label: "Age Transform",
        icon: "fa-hourglass-half",
        placeholder: "Example: make the person look about 60 years old..."
    },

    gender: {
        label: "Gender Transform",
        icon: "fa-venus-mars",
        placeholder: "Example: create a feminine presentation while preserving identity..."
    },

    cartoon: {
        label: "Cartoon / Animated",
        icon: "fa-palette",
        placeholder: "Example: transform into a polished 3D animated movie style..."
    },

    merge: {
        label: "Merge Images",
        icon: "fa-object-group",
        placeholder: "Example: combine both people into one realistic group photo..."
    }
};


let aiEditFiles = [];
let aiEditOriginalData = null;
let aiEditResultUrl = null;


/* =====================================================
   OPEN AI EDIT PAGE
   ===================================================== */

function openAIEdit() {

    if (typeof moveIndicator === "function" && typeof workspaceIcon !== "undefined") {
        moveIndicator(workspaceIcon);
    }

    // Keep sidebar visible
document
    .querySelector(".sidebar")
    ?.classList.remove("hidden");

document
    .querySelector(".main")
    ?.classList.remove("fullscreen");


    mainContent.innerHTML = `

        <div class="ai-edit-page mobile-ai-edit-page">

            <button class="workspace-menu-btn" id="aiEditMenuBtn">
                <i class="fa-solid fa-bars"></i>
            </button>


            <!-- HEADER -->

            <div class="ai-edit-header">

                <div>

                    <span class="ai-edit-eyebrow">
                        LOOKOUT AI
                    </span>

                    <h2>
                        AI Edit
                    </h2>

                    <p>
                        Transform your image with a prompt or choose an editing operation.
                    </p>

                </div>


                <!-- SIMPLE / ADVANCED -->

                <div class="ai-edit-mode">

                    <button
                        class="mode-btn active"
                        data-mode="simple"
                    >
                        Simple
                    </button>

                    <button
                        class="mode-btn"
                        data-mode="advanced"
                    >
                        Advanced
                    </button>

                </div>

            </div>


            <!-- PREVIEW AREA -->

            <div
                class="edit-preview-area"
                id="editPreviewArea"
            >

                <!-- UPLOAD -->

                <div
                    class="center-upload"
                    id="centerUpload"
                >

                    <i class="fa-solid fa-cloud-arrow-up"></i>

                    <h2>
                        Upload Images
                    </h2>

                    <p>
                        Upload 1 image, or 2 images for Merge
                    </p>

                    <input
                        type="file"
                        id="imageUpload"
                        multiple
                        accept="image/*"
                    >

                </div>


                <!-- UPLOADED IMAGES -->

                <div
                    class="uploaded-images"
                    id="uploadedImages"
                ></div>


                <!-- COMPARISON -->

                <div
                    class="comparison-panel hidden"
                    id="comparisonPanel"
                >

                    <div class="comparison-card">

                        <span>
                            Original
                        </span>

                        <img
                            id="comparisonOriginal"
                            alt="Original image"
                        >

                    </div>


                    <div class="comparison-card">

                        <span>
                            Edited
                        </span>

                        <img
                            id="comparisonEdited"
                            alt="Edited image"
                        >

                    </div>

                </div>


                <!-- STATUS -->

                <div
                    class="edit-status hidden"
                    id="editStatus"
                ></div>

            </div>


            <!-- BOTTOM CONTROL BAR -->

            <div
                class="edit-bottom-bar mobile-edit-bar hidden"
                id="editBottomBar"
            >

                <div class="edit-control-row">


                    <!-- ADD IMAGE -->

                    <label
                        class="upload-again-btn"
                        title="Add image"
                    >

                        <i class="fa-solid fa-plus"></i>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            id="replaceUpload"
                        >

                    </label>


                    <!-- OPERATION -->

                    <div class="operation-select-wrap">

                        <i
                            id="operationIcon"
                            class="fa-solid fa-wand-magic-sparkles"
                        ></i>

                        <select
                            id="editOperation"
                            aria-label="Edit operation"
                        >

                            ${Object.entries(AI_EDIT_OPERATIONS)
                                .map(([key, value]) => `
                                    <option value="${key}">
                                        ${value.label}
                                    </option>
                                `)
                                .join("")}

                        </select>

                    </div>


                    <!-- PROMPT -->

                    <textarea
                        id="editPrompt"
                        placeholder="Describe the edits..."
                        maxlength="2000"
                    ></textarea>


                    <!-- GENERATE -->

                    <button
                        class="generate-btn"
                        id="editGenerateBtn"
                        title="Generate"
                    >

                        <i class="fa-solid fa-wand-magic-sparkles"></i>

                    </button>

                </div>


                <!-- ADVANCED CONTROLS -->

                <div
                    class="advanced-controls hidden"
                    id="advancedControls"
                >

                    <span>

                        <i class="fa-solid fa-circle-info"></i>

                        Advanced mode preserves unrelated details and prioritizes precise local edits.

                    </span>

                    <span id="imageCountLabel">
                        0 / 2 images
                    </span>

                </div>

            </div>

        </div>
    `;


    /* MENU */

    document
        .getElementById("aiEditMenuBtn")
        ?.addEventListener("click", () => {

            document
                .querySelector(".sidebar")
                ?.classList.toggle("hidden");

        });


    setupAIEditUpload();

    setupAIEditControls();

    setupEditGenerate();

    renderAIEditFiles();
}


/* =====================================================
   UPLOAD SETUP
   ===================================================== */

function setupAIEditUpload() {

    const uploadInput =
        document.getElementById("imageUpload");

    const replaceUpload =
        document.getElementById("replaceUpload");


    uploadInput?.addEventListener(
        "change",
        event => {

            addAIEditFiles(
                Array.from(event.target.files || [])
            );

            event.target.value = "";

        }
    );


    replaceUpload?.addEventListener(
        "change",
        event => {

            addAIEditFiles(
                Array.from(event.target.files || [])
            );

            event.target.value = "";

        }
    );
}


/* =====================================================
   ADD FILES
   ===================================================== */

function addAIEditFiles(files) {

    const validFiles =
        files.filter(file =>
            file.type.startsWith("image/")
        );


    for (const file of validFiles) {

        if (
            aiEditFiles.length >=
            AI_EDIT_MAX_IMAGES
        ) {
            break;
        }

        aiEditFiles.push(file);
    }


    renderAIEditFiles();
}


/* =====================================================
   REMOVE FILE
   ===================================================== */

function removeAIEditFile(index) {

    aiEditFiles.splice(index, 1);

    renderAIEditFiles();
}


/* =====================================================
   RENDER UPLOADED IMAGES
   ===================================================== */

function renderAIEditFiles() {

    const uploadedImages =
        document.getElementById("uploadedImages");

    const centerUpload =
        document.getElementById("centerUpload");

    const editBottomBar =
        document.getElementById("editBottomBar");

    const countLabel =
        document.getElementById("imageCountLabel");


    if (!uploadedImages) {
        return;
    }


    uploadedImages.innerHTML = "";


    /* UPLOAD AREA */

    if (centerUpload) {

        centerUpload.style.display =
            aiEditFiles.length
                ? "none"
                : "flex";
    }


    /* BOTTOM BAR */

    if (editBottomBar) {

        if (aiEditFiles.length) {

            editBottomBar.classList.remove(
                "hidden"
            );

        } else {

            editBottomBar.classList.add(
                "hidden"
            );
        }
    }


    /* IMAGE COUNT */

    if (countLabel) {

        countLabel.textContent =
            `${aiEditFiles.length} / ${AI_EDIT_MAX_IMAGES} images`;
    }


    /* IMAGES */

    aiEditFiles.forEach(
        (file, index) => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "image-wrapper";


            const img =
                document.createElement("img");

            img.className =
                "preview-image";

            img.alt =
                `Uploaded image ${index + 1}`;


            const removeBtn =
                document.createElement("button");

            removeBtn.className =
                "remove-image-btn";

            removeBtn.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

            removeBtn.title =
                "Remove image";


            removeBtn.onclick = () => {

                removeAIEditFile(index);

            };


            const reader =
                new FileReader();


            reader.onload = event => {

                img.src =
                    event.target.result;


                wrapper.appendChild(img);


                /* DOWNLOAD BUTTON */

                if (
                    typeof createDownloadButton ===
                    "function"
                ) {

                    wrapper.appendChild(
                        createDownloadButton(
                            event.target.result,
                            `lookout-upload-${index + 1}.png`
                        )
                    );
                }


                wrapper.appendChild(removeBtn);


                uploadedImages.appendChild(
                    wrapper
                );
            };


            reader.readAsDataURL(file);

        }
    );


    const operation =
        document.getElementById(
            "editOperation"
        )?.value;


    updateMergeAvailability(
        operation
    );
}


/* =====================================================
   CONTROLS
   ===================================================== */

function setupAIEditControls() {

    const operationSelect =
        document.getElementById(
            "editOperation"
        );

    const promptInput =
        document.getElementById(
            "editPrompt"
        );


    /* SIMPLE / ADVANCED */

    document
        .querySelectorAll(".mode-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".mode-btn")
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    const mode =
                        button.dataset.mode;


                    document
                        .getElementById(
                            "advancedControls"
                        )
                        ?.classList.toggle(
                            "hidden",
                            mode !== "advanced"
                        );

                }
            );

        });


    /* OPERATION */

    operationSelect?.addEventListener(
        "change",
        () => {

            const operation =
                operationSelect.value;

            const info =
                AI_EDIT_OPERATIONS[
                    operation
                ];


            if (!info) {
                return;
            }


            const icon =
                document.getElementById(
                    "operationIcon"
                );


            if (icon) {

                icon.className =
                    `fa-solid ${info.icon}`;
            }


            if (promptInput) {

                promptInput.placeholder =
                    info.placeholder;
            }


            updateMergeAvailability(
                operation
            );
        }
    );
}


/* =====================================================
   MERGE AVAILABILITY
   ===================================================== */

function updateMergeAvailability(
    operation
) {

    const operationSelect =
        document.getElementById(
            "editOperation"
        );


    if (!operationSelect) {
        return;
    }


    const mergeOption =
        operationSelect.querySelector(
            'option[value="merge"]'
        );


    if (!mergeOption) {
        return;
    }


    mergeOption.disabled =
        aiEditFiles.length !== 2;


    if (
        operation === "merge" &&
        aiEditFiles.length !== 2
    ) {

        operationSelect.value =
            "custom";


        const icon =
            document.getElementById(
                "operationIcon"
            );


        if (icon) {

            icon.className =
                "fa-solid fa-wand-magic-sparkles";
        }
    }
}


/* =====================================================
   LOAD SAVED IMAGE
   ===================================================== */

async function getSavedEditImage() {

    try {

        const savedImages =
            JSON.parse(
                localStorage.getItem(
                    "editImages"
                ) || "null"
            );


        if (
            !savedImages ||
            !savedImages.length
        ) {
            return null;
        }


        const response =
            await fetch(
                savedImages[0]
            );


        if (!response.ok) {
            return null;
        }


        const blob =
            await response.blob();


        return new File(
            [blob],
            "selected.png",
            {
                type:
                    blob.type ||
                    "image/png"
            }
        );


    } catch (error) {

        console.warn(
            "Could not load saved edit image:",
            error
        );

        return null;
    }
}


/* =====================================================
   SELECTED MODE
   ===================================================== */

function getSelectedMode() {

    return (
        document
            .querySelector(
                ".mode-btn.active"
            )
            ?.dataset.mode ||
        "simple"
    );
}


/* =====================================================
   STATUS
   ===================================================== */

function setEditStatus(
    message,
    loading = false
) {

    const status =
        document.getElementById(
            "editStatus"
        );


    if (!status) {
        return;
    }


    status.classList.remove(
        "hidden",
        "success",
        "error"
    );


    if (loading) {

        status.innerHTML = `
            <span class="status-spinner"></span>
            ${message}
        `;

    } else {

        status.textContent =
            message;
    }
}


/* =====================================================
   CLEAR STATUS
   ===================================================== */

function clearEditStatus() {

    document
        .getElementById(
            "editStatus"
        )
        ?.classList.add(
            "hidden"
        );
}


/* =====================================================
   COMPARISON
   ===================================================== */

function showComparison(
    originalUrl,
    editedUrl
) {

    const panel =
        document.getElementById(
            "comparisonPanel"
        );


    if (!panel) {
        return;
    }


    const original =
        document.getElementById(
            "comparisonOriginal"
        );

    const edited =
        document.getElementById(
            "comparisonEdited"
        );


    if (original) {
        original.src =
            originalUrl;
    }


    if (edited) {
        edited.src =
            editedUrl;
    }


    panel.classList.remove(
        "hidden"
    );
}


/* =====================================================
   DISPLAY RESULT
   ===================================================== */

function displayEditedResult(
    url
) {

    const uploadedImages =
        document.getElementById(
            "uploadedImages"
        );


    if (!uploadedImages) {
        return;
    }


    uploadedImages.innerHTML =
        "";


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "image-wrapper result-wrapper";


    const img =
        document.createElement("img");

    img.className =
        "preview-image edited-result";

    img.alt =
        "AI edited result";


    img.src =
        `${url}${
            url.includes("?")
                ? "&"
                : "?"
        }t=${Date.now()}`;


    wrapper.appendChild(img);


    /* DOWNLOAD */

    if (
        typeof createDownloadButton ===
        "function"
    ) {

        wrapper.appendChild(
            createDownloadButton(
                img.src,
                "lookout-edited.png"
            )
        );
    }


    /* RESET */

    const resetBtn =
        document.createElement("button");

    resetBtn.className =
        "result-reset-btn";

    resetBtn.innerHTML =
        '<i class="fa-solid fa-arrow-rotate-left"></i>';

    resetBtn.title =
        "Back to uploaded images";


    resetBtn.onclick = () => {

        document
            .getElementById(
                "comparisonPanel"
            )
            ?.classList.add(
                "hidden"
            );


        renderAIEditFiles();

        clearEditStatus();
    };


    wrapper.appendChild(
        resetBtn
    );


    uploadedImages.appendChild(
        wrapper
    );
}


/* =====================================================
   GENERATE / EDIT
   ===================================================== */

function setupEditGenerate() {

    const generateBtn =
        document.getElementById(
            "editGenerateBtn"
        );

    const promptInput =
        document.getElementById(
            "editPrompt"
        );

    const operationSelect =
        document.getElementById(
            "editOperation"
        );


    generateBtn?.addEventListener(
        "click",
        async () => {

            let files =
                [...aiEditFiles];


            /* TRY SAVED IMAGE */

            if (!files.length) {

                const saved =
                    await getSavedEditImage();


                if (saved) {

                    files = [saved];

                    aiEditFiles = [saved];

                    renderAIEditFiles();
                }
            }


            /* NO IMAGE */

            if (!files.length) {

                alert(
                    "Upload an image first."
                );

                return;
            }


            const operation =
                operationSelect?.value ||
                "custom";


            const mode =
                getSelectedMode();


            const prompt =
                promptInput?.value.trim() ||
                "";


            /* MERGE */

            if (
                operation === "merge" &&
                files.length !== 2
            ) {

                alert(
                    "Merge requires exactly 2 images."
                );

                return;
            }


            /* CUSTOM PROMPT */

            if (
                operation === "custom" &&
                !prompt
            ) {

                alert(
                    "Describe the edit you want."
                );

                return;
            }


            /* MULTIPLE IMAGES */

            if (
                files.length > 1 &&
                operation !== "merge"
            ) {

                alert(
                    "For two images, choose Merge Images."
                );

                return;
            }


            /* FORM DATA */

            const formData =
                new FormData();


            formData.append(
                "prompt",
                prompt
            );


            formData.append(
                "operation",
                operation
            );


            formData.append(
                "mode",
                mode
            );


            const email =
                localStorage.getItem(
                    "userEmail"
                );


            if (email) {

                formData.append(
                    "email",
                    email
                );
            }


            /* IMPORTANT:
               Backend expects `images`
               */

            files.forEach(file => {

                formData.append(
                    "images",
                    file
                );

            });


            /* DISABLE BUTTON */

            generateBtn.disabled =
                true;


            setEditStatus(
                "Editing image...",
                true
            );


            try {

                const response =
                    await fetch(
                        `${AI_API_BASE}/edit`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                let data;


                try {

                    data =
                        await response.json();

                } catch {

                    throw new Error(
                        `Server returned HTTP ${response.status}`
                    );
                }


                /* SERVER ERROR */

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.error ||
                        "Failed to edit image."
                    );
                }


                /* RESULT URL */

                const resultUrl =
                    resolveGeneratedImageUrl(
                        data
                    );


                if (!resultUrl) {

                    throw new Error(
                        "The server did not return an image URL."
                    );
                }


                aiEditOriginalData =
                    files[0];


                aiEditResultUrl =
                    resultUrl;


                /* ORIGINAL IMAGE */

                const originalUrl =
                    URL.createObjectURL(
                        files[0]
                    );


                /* SHOW RESULT */

                displayEditedResult(
                    resultUrl
                );


                /* COMPARISON */

                showComparison(
                    originalUrl,
                    resultUrl
                );


                /* SUCCESS */

                setEditStatus(
                    `Completed: ${
                        AI_EDIT_OPERATIONS[
                            operation
                        ]?.label ||
                        "AI Edit"
                    }`
                );


            } catch (error) {

                console.error(
                    "AI Edit failed:",
                    error
                );


                setEditStatus(
                    error.message ||
                    "AI Edit failed.",
                    false
                );


                document
                    .getElementById(
                        "editStatus"
                    )
                    ?.classList.add(
                        "error"
                    );


            } finally {

                generateBtn.disabled =
                    false;
            }

        }
    );
}


/* =====================================================
   OPTIONAL: RESET AI EDIT STATE
   ===================================================== */

function resetAIEdit() {

    aiEditFiles = [];

    aiEditOriginalData = null;

    aiEditResultUrl = null;


    const comparison =
        document.getElementById(
            "comparisonPanel"
        );


    comparison?.classList.add(
        "hidden"
    );


    renderAIEditFiles();

    clearEditStatus();
}


/* =====================================================
   OPTIONAL: CLEAR INPUT PROMPT
   ===================================================== */

function clearAIEditPrompt() {

    const prompt =
        document.getElementById(
            "editPrompt"
        );


    if (prompt) {
        prompt.value = "";
    }
}