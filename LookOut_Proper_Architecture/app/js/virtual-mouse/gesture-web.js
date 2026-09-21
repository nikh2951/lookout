import {
  FilesetResolver,
  HandLandmarker
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let handLandmarker = null;
let gestureVideo = null;
let gestureStream = null;
let gestureFrame = null;
let gestureRunning = false;
let lastVideoTime = -1;
let smoothX = window.innerWidth / 2;
let smoothY = window.innerHeight / 2;
let wasPinching = false;
let lastClickAt = 0;
let lastScrollAt = 0;
let lastY = null;

const PINCH_DISTANCE = 0.055;
const CLICK_COOLDOWN = 450;
const SCROLL_COOLDOWN = 80;

async function getHandLandmarker(){
  if(handLandmarker) return handLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision,{
    baseOptions:{
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate:"GPU"
    },
    runningMode:"VIDEO",
    numHands:1
  });

  return handLandmarker;
}

function ensureVideo(){
  if(gestureVideo) return gestureVideo;

  gestureVideo = document.createElement("video");
  gestureVideo.setAttribute("playsinline","");
  gestureVideo.muted = true;
  gestureVideo.autoplay = true;
  gestureVideo.style.position = "fixed";
  gestureVideo.style.width = "1px";
  gestureVideo.style.height = "1px";
  gestureVideo.style.opacity = "0";
  gestureVideo.style.pointerEvents = "none";
  gestureVideo.style.left = "-10px";
  gestureVideo.style.top = "-10px";
  document.body.appendChild(gestureVideo);

  return gestureVideo;
}

function distance(a,b){
  return Math.hypot(a.x - b.x,a.y - b.y);
}

function isFingerUp(landmarks,tip,pip){
  return landmarks[tip].y < landmarks[pip].y;
}

function updateCursor(x,y,pinching){
  const cursor = document.getElementById("virtualCursor");
  if(!cursor) return;

  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  cursor.classList.toggle("active",pinching);
}

function clickAt(x,y){
  const target = document.elementFromPoint(x,y);
  if(!target || target.id === "virtualCursor") return;

  target.dispatchEvent(new PointerEvent("pointerdown",{
    bubbles:true,
    clientX:x,
    clientY:y,
    pointerId:99,
    pointerType:"touch"
  }));

  target.dispatchEvent(new PointerEvent("pointerup",{
    bubbles:true,
    clientX:x,
    clientY:y,
    pointerId:99,
    pointerType:"touch"
  }));

  target.dispatchEvent(new MouseEvent("click",{
    bubbles:true,
    clientX:x,
    clientY:y
  }));
}

function handleGestures(landmarks){
  const indexTip = landmarks[8];
  const thumbTip = landmarks[4];
  const middleUp = isFingerUp(landmarks,12,10);
  const indexUp = isFingerUp(landmarks,8,6);

  const targetX = (1 - indexTip.x) * window.innerWidth;
  const targetY = indexTip.y * window.innerHeight;

  smoothX += (targetX - smoothX) * 0.36;
  smoothY += (targetY - smoothY) * 0.36;

  const pinchDistance = distance(indexTip,thumbTip);
  const pinching = pinchDistance < PINCH_DISTANCE;

  updateCursor(smoothX,smoothY,pinching);

  const now = performance.now();

  if(pinching && !wasPinching && now - lastClickAt > CLICK_COOLDOWN){
    clickAt(smoothX,smoothY);
    lastClickAt = now;
  }

  if(indexUp && middleUp && !pinching && lastY !== null && now - lastScrollAt > SCROLL_COOLDOWN){
    const dy = indexTip.y - lastY;
    if(Math.abs(dy) > 0.018){
      window.scrollBy({ top:dy * 900, behavior:"auto" });
      lastScrollAt = now;
    }
  }

  wasPinching = pinching;
  lastY = indexTip.y;
}

async function predictionLoop(){
  if(!gestureRunning || !gestureVideo || !handLandmarker) return;

  if(gestureVideo.readyState >= 2 && gestureVideo.currentTime !== lastVideoTime){
    lastVideoTime = gestureVideo.currentTime;
    const result = handLandmarker.detectForVideo(gestureVideo,performance.now());

    if(result.landmarks && result.landmarks.length){
      handleGestures(result.landmarks[0]);
    }else{
      wasPinching = false;
      lastY = null;
    }
  }

  gestureFrame = requestAnimationFrame(predictionLoop);
}

async function startWebGestureControl(){
  if(gestureRunning) return;

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    throw new Error("Camera access is not supported in this browser.");
  }

  await getHandLandmarker();

  const video = ensureVideo();
  gestureStream = await navigator.mediaDevices.getUserMedia({
    video:{
      facingMode:"user",
      width:{ ideal:640 },
      height:{ ideal:480 }
    },
    audio:false
  });

  video.srcObject = gestureStream;
  await video.play();

  gestureRunning = true;
  document.body.classList.add("virtual-cursor-enabled");
  predictionLoop();
}

function stopWebGestureControl(){
  gestureRunning = false;
  wasPinching = false;
  lastY = null;

  if(gestureFrame){
    cancelAnimationFrame(gestureFrame);
    gestureFrame = null;
  }

  if(gestureStream){
    gestureStream.getTracks().forEach(track => track.stop());
    gestureStream = null;
  }

  if(gestureVideo){
    gestureVideo.srcObject = null;
  }

  document.body.classList.remove("virtual-cursor-enabled");
}

window.startWebGestureControl = startWebGestureControl;
window.stopWebGestureControl = stopWebGestureControl;
