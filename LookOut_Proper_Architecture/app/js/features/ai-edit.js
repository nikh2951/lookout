/* =====================================================
   LOOKOUT AI EDIT - UPDATED
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

function openAIEdit(){

    moveIndicator(workspaceIcon);

   const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");

if (window.innerWidth <= 768) {
    // Mobile
    sidebar?.classList.add("hidden");
    main?.classList.remove("fullscreen");
} else {
    // Desktop
    sidebar?.classList.remove("hidden");
    main?.classList.remove("fullscreen");
}

    mainContent.innerHTML = `
        <div class="ai-edit-page mobile-ai-edit-page">

            <button class="workspace-menu-btn" id="aiEditMenuBtn">
                <i class="fa-solid fa-bars"></i>
            </button>

            <div class="ai-edit-header">
                <div>
                    <span class="ai-edit-eyebrow">LOOKOUT AI</span>
                    <h2>AI Edit</h2>
                    <p>Transform your image with a prompt or choose an editing operation.</p>
                </div>

                <div class="ai-edit-mode">
                    <button class="mode-btn active" data-mode="simple">Simple</button>
                    <button class="mode-btn" data-mode="advanced">Advanced</button>
                </div>
            </div>

            <div class="edit-preview-area" id="editPreviewArea">

                <div class="center-upload" id="centerUpload">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <h2>Upload Images</h2>
                    <p>Upload 1 image, or 2 images for Merge</p>
                    <input type="file" id="imageUpload" multiple accept="image/*">
                </div>

                <div class="uploaded-images" id="uploadedImages"></div>

                <div class="comparison-panel hidden" id="comparisonPanel">
                    <div class="comparison-card">
                        <span>Original</span>
                        <img id="comparisonOriginal" alt="Original image">
                    </div>
                    <div class="comparison-card">
                        <span>Edited</span>
                        <img id="comparisonEdited" alt="Edited image">
                    </div>
                </div>

                <div class="edit-status hidden" id="editStatus"></div>
            </div>

            <div class="edit-bottom-bar mobile-edit-bar hidden" id="editBottomBar">

                <div class="edit-control-row">

                    <label class="upload-again-btn" title="Add image">
                        <i class="fa-solid fa-plus"></i>
                        <input type="file" multiple accept="image/*" id="replaceUpload">
                    </label>

                    <div class="operation-select-wrap">
                        <i id="operationIcon" class="fa-solid fa-wand-magic-sparkles"></i>
                        <select id="editOperation" aria-label="Edit operation">
                            ${Object.entries(AI_EDIT_OPERATIONS).map(([key, value]) =>
                                `<option value="${key}">${value.label}</option>`
                            ).join("")}
                        </select>
                    </div>

                    <textarea
                        id="editPrompt"
                        placeholder="Describe the edits..."
                        maxlength="2000"
                    ></textarea>

                    <button class="generate-btn" id="editGenerateBtn" title="Generate">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                </div>

                <div class="advanced-controls hidden" id="advancedControls">
                    <span><i class="fa-solid fa-circle-info"></i> Advanced mode preserves unrelated details and prioritizes precise local edits.</span>
                    <span id="imageCountLabel">0 / 2 images</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById("aiEditMenuBtn")?.addEventListener("click", () => {
        document.querySelector(".sidebar")?.classList.toggle("hidden");
    });

    setupAIEditUpload();
    setupAIEditControls();
    setupEditGenerate();
    loadSelectedImages();
}

function setupAIEditUpload(){

    const uploadInput = document.getElementById("imageUpload");
    const replaceUpload = document.getElementById("replaceUpload");

    uploadInput?.addEventListener("change", event => {
        addAIEditFiles(Array.from(event.target.files || []));
        event.target.value = "";
    });

    replaceUpload?.addEventListener("change", event => {
        addAIEditFiles(Array.from(event.target.files || []));
        event.target.value = "";
    });
}

function addAIEditFiles(files){

    const valid = files.filter(file => file.type.startsWith("image/"));

    for(const file of valid){
        if(aiEditFiles.length >= AI_EDIT_MAX_IMAGES) break;
        aiEditFiles.push(file);
    }

    renderAIEditFiles();
}

function removeAIEditFile(index){
    aiEditFiles.splice(index, 1);
    renderAIEditFiles();
}

function renderAIEditFiles(){

    const uploadedImages = document.getElementById("uploadedImages");
    const centerUpload = document.getElementById("centerUpload");
    const editBottomBar = document.getElementById("editBottomBar");
    const countLabel = document.getElementById("imageCountLabel");

    if(!uploadedImages) return;

    uploadedImages.innerHTML = "";

    centerUpload.style.display = aiEditFiles.length ? "none" : "flex";

    if(aiEditFiles.length){
        editBottomBar.classList.remove("hidden");
    } else {
        editBottomBar.classList.add("hidden");
    }

    if(countLabel){
        countLabel.textContent = `${aiEditFiles.length} / ${AI_EDIT_MAX_IMAGES} images`;
    }

    aiEditFiles.forEach((file, index) => {

        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";

        const img = document.createElement("img");
        img.className = "preview-image";
        img.alt = `Uploaded image ${index + 1}`;

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-image-btn";
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        removeBtn.title = "Remove image";
        removeBtn.onclick = () => removeAIEditFile(index);

        const reader = new FileReader();

        reader.onload = event => {
            img.src = event.target.result;

            wrapper.appendChild(img);

            if(typeof createDownloadButton === "function"){
                wrapper.appendChild(
                    createDownloadButton(event.target.result, `lookout-upload-${index + 1}.png`)
                );
            }

            wrapper.appendChild(removeBtn);
            uploadedImages.appendChild(wrapper);
        };

        reader.readAsDataURL(file);
    });

    const operation = document.getElementById("editOperation")?.value;
    updateMergeAvailability(operation);
}

function setupAIEditControls(){

    const operationSelect = document.getElementById("editOperation");
    const promptInput = document.getElementById("editPrompt");

    document.querySelectorAll(".mode-btn").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".mode-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const mode = button.dataset.mode;
            document.getElementById("advancedControls")?.classList.toggle(
                "hidden",
                mode !== "advanced"
            );
        });
    });

    operationSelect?.addEventListener("change", () => {
        const operation = operationSelect.value;
        const info = AI_EDIT_OPERATIONS[operation];

        document.getElementById("operationIcon").className =
            `fa-solid ${info.icon}`;

        promptInput.placeholder = info.placeholder;

        updateMergeAvailability(operation);
    });
}

function updateMergeAvailability(operation){

    const operationSelect = document.getElementById("editOperation");

    if(!operationSelect) return;

    const mergeOption = operationSelect.querySelector('option[value="merge"]');

    if(mergeOption){
        mergeOption.disabled = aiEditFiles.length !== 2;

        if(operation === "merge" && aiEditFiles.length !== 2){
            operationSelect.value = "custom";
            document.getElementById("operationIcon").className =
                "fa-solid fa-wand-magic-sparkles";
        }
    }
}

async function getSavedEditImage(){

    try{
        const savedImages = JSON.parse(localStorage.getItem("editImages") || "null");

        if(!savedImages?.length) return null;

        const response = await fetch(savedImages[0]);

        if(!response.ok) return null;

        const blob = await response.blob();

        return new File(
            [blob],
            "selected.png",
            { type: blob.type || "image/png" }
        );

    }catch(error){
        console.warn("Could not load saved edit image:", error);
        return null;
    }
}

function getSelectedMode(){
    return document.querySelector(".mode-btn.active")?.dataset.mode || "simple";
}

function setEditStatus(message, loading = false){

    const status = document.getElementById("editStatus");

    if(!status) return;

    status.classList.remove("hidden", "success", "error");

    if(loading){
        status.innerHTML = `
            <span class="status-spinner"></span>
            ${message}
        `;
    }else{
        status.textContent = message;
    }
}

function clearEditStatus(){
    document.getElementById("editStatus")?.classList.add("hidden");
}

function showComparison(originalUrl, editedUrl){

    const panel = document.getElementById("comparisonPanel");

    if(!panel) return;

    document.getElementById("comparisonOriginal").src = originalUrl;
    document.getElementById("comparisonEdited").src = editedUrl;

    panel.classList.remove("hidden");
}

function displayEditedResult(url){

    const uploadedImages = document.getElementById("uploadedImages");

    if(!uploadedImages) return;

    uploadedImages.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper result-wrapper";

    const img = document.createElement("img");
    img.className = "preview-image edited-result";
    img.alt = "AI edited result";
    img.src = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;

    wrapper.appendChild(img);

    if(typeof createDownloadButton === "function"){
        wrapper.appendChild(
            createDownloadButton(img.src, "lookout-edited.png")
        );
    }

    const resetBtn = document.createElement("button");
    resetBtn.className = "result-reset-btn";
    resetBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>';
    resetBtn.title = "Back to uploaded images";
    resetBtn.onclick = () => {
        document.getElementById("comparisonPanel")?.classList.add("hidden");
        renderAIEditFiles();
        clearEditStatus();
    };

    wrapper.appendChild(resetBtn);
    uploadedImages.appendChild(wrapper);
}

function setupEditGenerate(){

    const generateBtn = document.getElementById("editGenerateBtn");
    const promptInput = document.getElementById("editPrompt");
    const operationSelect = document.getElementById("editOperation");

    generateBtn?.addEventListener("click", async () => {

        let files = [...aiEditFiles];

        if(!files.length){
            const saved = await getSavedEditImage();

            if(saved){
                files = [saved];
                aiEditFiles = [saved];
                renderAIEditFiles();
            }
        }

        if(!files.length){
            alert("Upload an image first.");
            return;
        }

        const operation = operationSelect?.value || "custom";
        const mode = getSelectedMode();
        const prompt = promptInput?.value.trim() || "";

        if(operation === "merge" && files.length !== 2){
            alert("Merge requires exactly 2 images.");
            return;
        }

        if(operation === "custom" && !prompt){
            alert("Describe the edit you want.");
            return;
        }

        if(files.length > 1 && operation !== "merge"){
            alert("For two images, choose Merge Images.");
            return;
        }

        const formData = new FormData();

        formData.append("prompt", prompt);
        formData.append("operation", operation);
        formData.append("mode", mode);

        const email = localStorage.getItem("userEmail");
        if(email) formData.append("email", email);

        files.forEach(file => {
            formData.append("images", file);
        });

        generateBtn.disabled = true;
        setEditStatus("Editing image...", true);

        try{

            const response = await fetch(
                `${AI_API_BASE}/edit`,
                {
                    method: "POST",
                    body: formData
                }
            );

            let data;

            try{
                data = await response.json();
            }catch{
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            if(!response.ok || !data.success){
                throw new Error(data.error || "Failed to edit image.");
            }

            const resultUrl = resolveGeneratedImageUrl(data);

            if(!resultUrl){
                throw new Error("The server did not return an image URL.");
            }

            aiEditOriginalData = files[0];
            aiEditResultUrl = resultUrl;

            const originalUrl = URL.createObjectURL(files[0]);

            displayEditedResult(resultUrl);
            showComparison(originalUrl, resultUrl);
            setEditStatus(
                `Completed: ${AI_EDIT_OPERATIONS[operation]?.label || "AI Edit"}`
            );

        }catch(error){

            console.error("AI Edit failed:", error);

            setEditStatus(error.message || "AI Edit failed.", false);
            document.getElementById("editStatus")?.classList.add("error");

        }finally{
            generateBtn.disabled = false;
        }
    });
}
