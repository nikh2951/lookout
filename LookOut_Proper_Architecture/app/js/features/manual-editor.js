/* =====================================================
   LOOKOUT MANUAL EDITOR
   ===================================================== */

/* Manual editor page */
/* ================= PROFESSIONAL MANUAL EDITOR ================= */

function openManualEdit() {

    moveIndicator(workspaceIcon);

    // Keep sidebar visible
    document
        .querySelector(".sidebar")
        ?.classList.remove("hidden");

    // Keep normal main layout
    document
        .querySelector(".main")
        ?.classList.remove("fullscreen");

    // Keep the rest of your existing Manual Edit code below

    mainContent.innerHTML = `

    <div class="pro-editor-page mobile-editor-page">
        <button class="workspace-menu-btn">

    <i class="fa-solid fa-bars"></i>

</button>

        <!-- ================= CANVAS AREA ================= -->

        <div class="pro-canvas-container glass-panel">

            <canvas id="editorCanvas"></canvas>

            <!-- FLOATING UPLOAD -->

            <button
            class="floating-upload-btn"
            id="uploadImageBtn"
            >
                <i class="fa-solid fa-image"></i>
            </button>

            <button
            class="floating-download-btn"
            id="downloadManualBtn"
            onclick="downloadManualEdit()"
            >
                <i class="fa-solid fa-download"></i>
            </button>

        </div>

        <!-- ================= SECONDARY TOOLBAR ================= -->

        <div
        class="secondary-toolbar glass-panel"
        id="secondaryToolbar"
        >

        </div>

        <!-- ================= MAIN TOOLBAR ================= -->

        <div class="main-toolbar mobile-toolbar">

            <div
            class="tool-icon active-tool"
            title="Adjust"
            onclick="openToolPanel('adjust',this)"
            >
                <i class="fa-solid fa-sliders"></i>
                <span>Adjust</span>
            </div>

            <div
            class="tool-icon"
            title="Crop"
            onclick="openToolPanel('crop',this)"
            >
                <i class="fa-solid fa-crop"></i>
                <span>Crop</span>
            </div>

            <div
            class="tool-icon"
            title="Text"
            onclick="openToolPanel('text',this)"
            >
                <i class="fa-solid fa-font"></i>
                <span>Text</span>
            </div>

            <div
            class="tool-icon"
            title="Add image and blend"
            onclick="openToolPanel('addimage',this)"
            >
                <i class="fa-solid fa-images"></i>
                <span>Image</span>
            </div>

        </div>

    </div>

    `;

setupProfessionalEditor();

    loadAdjustToolbar();
}

/* Fabric canvas instance */
let editorCanvas;

/* ================= SETUP ================= */

/* Final manual editor implementation */
/* ================= MANUAL EDITOR UPGRADE ================= */

const manualAdjustState = {
    brightness:0,
    exposure:0,
    tint:"#ffffff",
    tintAmount:0,
    saturation:0,
    sharpness:0,
    softness:0,
    shadow:"#000000",
    shadowAmount:0,
    midtone:"#808080",
    midtoneAmount:0,
    highlight:"#ffffff",
    highlightAmount:0,
    curveBlack:0,
    curveMid:0,
    curveWhite:0
};

let manualImageInput = null;

function getActiveCanvasObject(){
    if(!editorCanvas) return null;
    return editorCanvas.getActiveObject();
}

function getActiveImage(){
    const obj = getActiveCanvasObject();
    if(!obj || obj.type !== "image"){
        return null;
    }
    return obj;
}

function updateManualAdjust(key,value){
    manualAdjustState[key] = Number(value);
    applyManualImageAdjustments();
}

function updateManualColor(key,value){
    manualAdjustState[key] = value;
    applyManualImageAdjustments();
}

function addFilter(filters,FilterClass,settings){
    if(FilterClass){
        filters.push(new FilterClass(settings));
    }
}

function applyManualImageAdjustments(){
    const obj = getActiveImage();
    if(!obj) return;

    const filters = [];
    const f = fabric.Image.filters;
    const brightness = manualAdjustState.brightness / 100;
    const exposure = manualAdjustState.exposure / 100;
    const saturation = manualAdjustState.saturation / 100;
    const softness = manualAdjustState.softness / 100;
    const sharpness = manualAdjustState.sharpness / 100;
    const tintAmount = manualAdjustState.tintAmount / 100;
    const shadowAmount = manualAdjustState.shadowAmount / 100;
    const midtoneAmount = manualAdjustState.midtoneAmount / 100;
    const highlightAmount = manualAdjustState.highlightAmount / 100;
    const curveBlack = manualAdjustState.curveBlack / 100;
    const curveMid = manualAdjustState.curveMid / 100;
    const curveWhite = manualAdjustState.curveWhite / 100;

    if(brightness !== 0){
        addFilter(filters,f.Brightness,{ brightness });
    }

    if(exposure !== 0 || curveBlack !== 0 || curveWhite !== 0){
        addFilter(filters,f.Contrast,{
            contrast: Math.max(-1,Math.min(1,exposure + curveWhite - curveBlack))
        });
    }

    if(saturation !== 0 || curveMid !== 0){
        addFilter(filters,f.Saturation,{
            saturation: Math.max(-1,Math.min(1,saturation + curveMid * 0.5))
        });
    }

    if(softness > 0){
        addFilter(filters,f.Blur,{ blur: Math.min(0.9,softness) });
    }

    if(sharpness > 0 && f.Convolute){
        const s = sharpness;
        addFilter(filters,f.Convolute,{
            matrix:[0,-s,0,-s,1 + 4 * s,-s,0,-s,0]
        });
    }

    if(tintAmount > 0){
        addFilter(filters,f.BlendColor,{
            color:manualAdjustState.tint,
            mode:"tint",
            alpha:tintAmount
        });
    }

    if(shadowAmount > 0){
        addFilter(filters,f.BlendColor,{
            color:manualAdjustState.shadow,
            mode:"multiply",
            alpha:shadowAmount * 0.45
        });
    }

    if(midtoneAmount > 0){
        addFilter(filters,f.BlendColor,{
            color:manualAdjustState.midtone,
            mode:"overlay",
            alpha:midtoneAmount * 0.45
        });
    }

    if(highlightAmount > 0){
        addFilter(filters,f.BlendColor,{
            color:manualAdjustState.highlight,
            mode:"screen",
            alpha:highlightAmount * 0.45
        });
    }

    obj.filters = filters;
    obj.applyFilters();
    editorCanvas.renderAll();
}

function loadAdjustToolbar(){
    const toolbar = document.getElementById("secondaryToolbar");
    toolbar.innerHTML = `
    <div class="editor-panel wide-panel">
        <div class="panel-section-title">Adjust</div>
        <label class="control-pill"><i class="fa-solid fa-sun"></i><span>Brightness</span><input type="range" min="-100" max="100" value="${manualAdjustState.brightness}" oninput="updateManualAdjust('brightness',this.value)"></label>
        <label class="control-pill"><i class="fa-solid fa-circle-half-stroke"></i><span>Exposure</span><input type="range" min="-100" max="100" value="${manualAdjustState.exposure}" oninput="updateManualAdjust('exposure',this.value)"></label>
        <label class="control-pill"><i class="fa-solid fa-droplet"></i><span>Saturation</span><input type="range" min="-100" max="100" value="${manualAdjustState.saturation}" oninput="updateManualAdjust('saturation',this.value)"></label>
        <label class="control-pill"><i class="fa-solid fa-wand-magic-sparkles"></i><span>Sharpness</span><input type="range" min="0" max="100" value="${manualAdjustState.sharpness}" oninput="updateManualAdjust('sharpness',this.value)"></label>
        <label class="control-pill"><i class="fa-solid fa-feather"></i><span>Softness</span><input type="range" min="0" max="100" value="${manualAdjustState.softness}" oninput="updateManualAdjust('softness',this.value)"></label>
        <label class="control-pill color-control"><i class="fa-solid fa-eye-dropper"></i><span>Tint</span><input type="color" value="${manualAdjustState.tint}" onchange="updateManualColor('tint',this.value)"><input type="range" min="0" max="100" value="${manualAdjustState.tintAmount}" oninput="updateManualAdjust('tintAmount',this.value)"></label>
        <div class="panel-section-title">Color Wheels</div>
        <label class="control-pill color-control"><span>Shadows</span><input type="color" value="${manualAdjustState.shadow}" onchange="updateManualColor('shadow',this.value)"><input type="range" min="0" max="100" value="${manualAdjustState.shadowAmount}" oninput="updateManualAdjust('shadowAmount',this.value)"></label>
        <label class="control-pill color-control"><span>Midtones</span><input type="color" value="${manualAdjustState.midtone}" onchange="updateManualColor('midtone',this.value)"><input type="range" min="0" max="100" value="${manualAdjustState.midtoneAmount}" oninput="updateManualAdjust('midtoneAmount',this.value)"></label>
        <label class="control-pill color-control"><span>Highlights</span><input type="color" value="${manualAdjustState.highlight}" onchange="updateManualColor('highlight',this.value)"><input type="range" min="0" max="100" value="${manualAdjustState.highlightAmount}" oninput="updateManualAdjust('highlightAmount',this.value)"></label>
        <div class="panel-section-title">Curves</div>
        <label class="control-pill"><span>Black</span><input type="range" min="-100" max="100" value="${manualAdjustState.curveBlack}" oninput="updateManualAdjust('curveBlack',this.value)"></label>
        <label class="control-pill"><span>Mid</span><input type="range" min="-100" max="100" value="${manualAdjustState.curveMid}" oninput="updateManualAdjust('curveMid',this.value)"></label>
        <label class="control-pill"><span>White</span><input type="range" min="-100" max="100" value="${manualAdjustState.curveWhite}" oninput="updateManualAdjust('curveWhite',this.value)"></label>
        <button class="editor-action-btn" onclick="resetManualAdjustments()"><i class="fa-solid fa-rotate-left"></i> Reset</button>
    </div>
    `;
}

function resetManualAdjustments(){
    Object.assign(manualAdjustState,{brightness:0,exposure:0,tint:"#ffffff",tintAmount:0,saturation:0,sharpness:0,softness:0,shadow:"#000000",shadowAmount:0,midtone:"#808080",midtoneAmount:0,highlight:"#ffffff",highlightAmount:0,curveBlack:0,curveMid:0,curveWhite:0});
    const obj = getActiveImage();
    if(obj){
        obj.filters = [];
        obj.applyFilters();
        editorCanvas.renderAll();
    }
    loadAdjustToolbar();
}

function loadCropToolbar(){
    const toolbar = document.getElementById("secondaryToolbar");
    toolbar.innerHTML = `
    <div class="editor-panel compact-panel">
        <div class="panel-section-title">Crop</div>
        <button class="crop-btn" onclick="applyCropPreset('free')">Free</button>
        <button class="crop-btn" onclick="applyCropPreset('1:1')">1:1</button>
        <button class="crop-btn" onclick="applyCropPreset('4:5')">4:5</button>
        <button class="crop-btn" onclick="applyCropPreset('16:9')">16:9</button>
        <button class="crop-btn" onclick="applyCropPreset('circle')">Circle</button>
        <button class="crop-btn danger-soft" onclick="clearCrop()">Clear</button>
    </div>
    `;
}

function applyCropPreset(type){
    const obj = getActiveImage();
    if(!obj) return;
    if(type === "free"){
        obj.clipPath = null;
        editorCanvas.renderAll();
        return;
    }
    if(type === "circle"){
        const radius = Math.min(obj.width,obj.height) / 2;
        obj.clipPath = new fabric.Circle({ radius, originX:"center", originY:"center" });
        editorCanvas.renderAll();
        return;
    }
    const ratios = { "1:1":1, "4:5":4/5, "16:9":16/9 };
    const ratio = ratios[type] || 1;
    let cropWidth = obj.width;
    let cropHeight = cropWidth / ratio;
    if(cropHeight > obj.height){
        cropHeight = obj.height;
        cropWidth = cropHeight * ratio;
    }
    obj.clipPath = new fabric.Rect({ width:cropWidth, height:cropHeight, originX:"center", originY:"center", rx:type === "1:1" ? 12 : 0, ry:type === "1:1" ? 12 : 0 });
    editorCanvas.renderAll();
}

function clearCrop(){
    const obj = getActiveImage();
    if(!obj) return;
    obj.clipPath = null;
    editorCanvas.renderAll();
}

function loadTextToolbar(){
    const toolbar = document.getElementById("secondaryToolbar");
    toolbar.innerHTML = `
    <div class="editor-panel compact-panel">
        <div class="panel-section-title">Text</div>
        <button class="text-tool" onclick="addText()"><i class="fa-solid fa-plus"></i></button>
        <button class="text-tool" onclick="toggleTextStyle('fontWeight','bold','normal')"><i class="fa-solid fa-bold"></i></button>
        <button class="text-tool" onclick="toggleTextStyle('fontStyle','italic','normal')"><i class="fa-solid fa-italic"></i></button>
        <button class="text-tool" onclick="toggleTextUnderline()"><i class="fa-solid fa-underline"></i></button>
        <label class="control-pill small-control"><span>Size</span><input type="range" min="16" max="160" value="50" oninput="changeTextSize(this.value)"></label>
        <label class="text-tool color-square"><input type="color" value="#ffffff" onchange="changeTextColor(this.value)"></label>
        <button class="text-tool" onclick="setTextAlign('left')"><i class="fa-solid fa-align-left"></i></button>
        <button class="text-tool" onclick="setTextAlign('center')"><i class="fa-solid fa-align-center"></i></button>
        <button class="text-tool" onclick="setTextAlign('right')"><i class="fa-solid fa-align-right"></i></button>
    </div>
    `;
}

function loadAddImageToolbar(){
    const toolbar = document.getElementById("secondaryToolbar");
    toolbar.innerHTML = `
    <div class="editor-panel compact-panel">
        <div class="panel-section-title">Add Image</div>
        <button class="editor-action-btn" onclick="triggerManualImageUpload()"><i class="fa-solid fa-image"></i> Add</button>
        <button class="crop-btn" onclick="applyCropPreset('1:1')">Crop 1:1</button>
        <button class="crop-btn" onclick="applyCropPreset('4:5')">Crop 4:5</button>
        <label class="control-pill small-control"><span>Opacity</span><input type="range" min="0" max="100" value="100" oninput="changeObjectOpacity(this.value)"></label>
        <select class="editor-select" onchange="changeBlend(this.value)">
            <option value="source-over">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
        </select>
    </div>
    `;
}

function openToolPanel(type,element){
    document.querySelectorAll(".tool-icon").forEach(icon => icon.classList.remove("active-tool"));
    if(element) element.classList.add("active-tool");
    if(type === "adjust") loadAdjustToolbar();
    else if(type === "crop") loadCropToolbar();
    else if(type === "text") loadTextToolbar();
    else if(type === "addimage") loadAddImageToolbar();
}

function setupProfessionalEditor(){
    editorCanvas = new fabric.Canvas("editorCanvas",{ preserveObjectStacking:true });
    editorCanvas.backgroundColor = "#111";
    resizeManualEditorCanvas();
    window.removeEventListener("resize",resizeManualEditorCanvas);
    window.addEventListener("resize",resizeManualEditorCanvas);
    setupImageUpload();
    loadManualSelectedImages();
}

function resizeManualEditorCanvas(){
    if(!editorCanvas) return;

    const container = document.querySelector(".pro-canvas-container");
    if(!container) return;

    const width = Math.max(320,Math.floor(container.clientWidth));
    const height = Math.max(360,Math.floor(container.clientHeight));

    editorCanvas.setWidth(width);
    editorCanvas.setHeight(height);
    editorCanvas.calcOffset();
    editorCanvas.renderAll();
}

function setupImageUpload(){
    manualImageInput = document.createElement("input");
    manualImageInput.type = "file";
    manualImageInput.accept = "image/*";
    manualImageInput.multiple = true;
    const uploadButton = document.getElementById("uploadImageBtn");
    if(uploadButton) uploadButton.onclick = triggerManualImageUpload;
    manualImageInput.onchange = (e) => {
        Array.from(e.target.files || []).forEach(file => {
            const reader = new FileReader();
            reader.onload = event => addImageToEditor(event.target.result);
            reader.readAsDataURL(file);
        });
        manualImageInput.value = "";
    };
}

function triggerManualImageUpload(){
    if(manualImageInput) manualImageInput.click();
}

function addImageToEditor(src){
    fabric.Image.fromURL(src,function(img){
        img.scaleToWidth(Math.min(editorCanvas.getWidth() * 0.86, img.width));
        editorCanvas.add(img);
        editorCanvas.centerObject(img);
        editorCanvas.setActiveObject(img);
        editorCanvas.renderAll();
    },{ crossOrigin:"anonymous" });
}

function downloadManualEdit(){
    if(!editorCanvas) return;

    const dataUrl =
    editorCanvas.toDataURL({
        format:"png",
        multiplier:2
    });

    triggerDownload(
        dataUrl,
        "lookout-manual-edit.png"
    );
}

function loadManualSelectedImages(){
    const images = JSON.parse(localStorage.getItem("editImages") || "null");
    if(!images || !images.length) return;
    images.forEach(src => addImageToEditor(src));
}

function addText(){
    const text = new fabric.IText("LOOKOUT",{ left:200, top:200, fill:"#fff", fontSize:50, fontFamily:"Segoe UI", fontWeight:"normal", fontStyle:"normal", underline:false });
    editorCanvas.add(text);
    editorCanvas.setActiveObject(text);
    editorCanvas.renderAll();
}

function getActiveText(){
    const obj = getActiveCanvasObject();
    if(!obj || (obj.type !== "i-text" && obj.type !== "textbox" && obj.type !== "text")) return null;
    return obj;
}

function toggleTextStyle(property,onValue,offValue){
    const obj = getActiveText();
    if(!obj) return;
    obj.set(property,obj[property] === onValue ? offValue : onValue);
    editorCanvas.renderAll();
}

function toggleTextUnderline(){
    const obj = getActiveText();
    if(!obj) return;
    obj.set("underline",!obj.underline);
    editorCanvas.renderAll();
}

function changeTextSize(value){
    const obj = getActiveText();
    if(!obj) return;
    obj.set("fontSize",Number(value));
    editorCanvas.renderAll();
}

function changeTextColor(color){
    const obj = getActiveText();
    if(!obj) return;
    obj.set("fill",color);
    editorCanvas.renderAll();
}

function setTextAlign(align){
    const obj = getActiveText();
    if(!obj) return;
    obj.set("textAlign",align);
    editorCanvas.renderAll();
}

function changeBlend(mode){
    const obj = getActiveCanvasObject();
    if(!obj) return;
    obj.globalCompositeOperation = mode;
    editorCanvas.renderAll();
}

function changeObjectOpacity(value){
    const obj = getActiveCanvasObject();
    if(!obj) return;
    obj.set("opacity",Number(value) / 100);
    editorCanvas.renderAll();
}

function adjustBrightness(value){ updateManualAdjust("brightness",value); }
function adjustContrast(value){ updateManualAdjust("exposure",value); }
function adjustSaturation(value){ updateManualAdjust("saturation",value); }

function applyFilters(settings){
    if(settings.brightness !== undefined) manualAdjustState.brightness = settings.brightness * 100;
    if(settings.contrast !== undefined) manualAdjustState.exposure = settings.contrast * 100;
    if(settings.saturation !== undefined) manualAdjustState.saturation = settings.saturation * 100;
    applyManualImageAdjustments();
}

function applyTint(color){
    manualAdjustState.tint = color;
    manualAdjustState.tintAmount = Math.max(manualAdjustState.tintAmount,30);
    applyManualImageAdjustments();
}
