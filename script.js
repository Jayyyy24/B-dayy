/**
 * Aishwarya's Birthday Website - Script Configuration & Interactive Logic
 */

// --- CONFIGURATION CORNER ---
const CONFIG = {
    passcode: "1432", // Passcode from the video (1432)
    girlName: "Aishwarya",
    floatingHeartsInterval: 400, // Spawn rate for hearts in ms
    maxHearts: 45 // Prevent browser lag on mobile
};

// --- STATE MANAGER ---
let appState = {
    currentScreen: "screen-welcome",
    enteredPasscode: "",
    passcodeCorrect: false,
    candlesBlown: false,
    letterOpened: false,
    visitedGallery: false,
    visitedLetter: false
};

// --- DOM ELEMENTS ---
const screens = document.querySelectorAll(".screen, .detail-screen");
const heartsContainer = document.getElementById("hearts-bg");

// Welcome Buttons
const btnWelcomeYes = document.getElementById("btn-welcome-yes");
const btnWelcomeNo = document.getElementById("btn-welcome-no");

// Go Away Buttons
const btnGoAwayBack = document.getElementById("btn-goaway-back");

// Passcode Keypad Elements
const keypadButtons = document.querySelectorAll(".key-btn");
const dots = document.querySelectorAll(".dots-display .dot");
const btnPasscodeNext = document.getElementById("btn-passcode-next");
const passcodeContainer = document.querySelector("#screen-passcode .container");

// Crown Elements
const btnCrownTake = document.getElementById("btn-crown-take");

// Camera Elements
const btnCameraSee = document.getElementById("btn-camera-see");
const cameraFlash = document.getElementById("camera-flash");

// Reveal Elements
const btnRevealNext = document.getElementById("btn-reveal-next");

// Wish Elements
const wishTitle = document.getElementById("wish-title");
const btnWishBlow = document.getElementById("btn-wish-blow");
const btnWishNext = document.getElementById("btn-wish-next");
const candles = document.querySelectorAll(".candle");

// Gift Hub Elements
const giftLetter = document.getElementById("gift-letter");
const giftGallery = document.getElementById("gift-gallery");

// Detail Back Buttons
const btnLetterBack = document.getElementById("btn-letter-back");
const btnGalleryBack = document.getElementById("btn-gallery-back");

// Envelope Elements
const envelopeArea = document.getElementById("envelope-click-area");
const fullLetterPaper = document.getElementById("full-scrapbook-letter");

// --- TYPEWRITER EFFECT FOR WELCOME SCREEN ---
let typewriterTimeout1 = null;
let typewriterTimeout2 = null;

function runTypewriter() {
    // Clear previous timeouts to prevent overlay typing
    clearTimeout(typewriterTimeout1);
    clearTimeout(typewriterTimeout2);

    const titleEl = document.getElementById("welcome-title");
    const questionEl = document.getElementById("welcome-question");
    
    const titleText = "This site is special to Aishwarya🎀,";
    const questionText = "are you Aishwarya? 🤨👀";
    
    titleEl.innerHTML = "";
    questionEl.innerHTML = "";
    
    titleEl.classList.add("typewriter-cursor");
    
    let i = 0;
    function typeTitle() {
        if (i < titleText.length) {
            titleEl.innerHTML += titleText.charAt(i);
            i++;
            typewriterTimeout1 = setTimeout(typeTitle, 60);
        } else {
            titleEl.classList.remove("typewriter-cursor");
            questionEl.classList.add("typewriter-cursor");
            
            let j = 0;
            function typeQuestion() {
                if (j < questionText.length) {
                    questionEl.innerHTML += questionText.charAt(j);
                    j++;
                    typewriterTimeout2 = setTimeout(typeQuestion, 60);
                } else {
                    questionEl.classList.remove("typewriter-cursor");
                }
            }
            typewriterTimeout2 = setTimeout(typeQuestion, 200);
        }
    }
    typewriterTimeout1 = setTimeout(typeTitle, 300);
}

// --- RESPONSIVE COLLAGE SCALING ---
function adjustCollageScale() {
    const containers = document.querySelectorAll(".scrapbook-letter-collage, .gallery-collage-container");
    const viewportWidth = window.innerWidth;
    const padding = 30; // left/right margin padding
    const designWidth = 700; // base design width
    const designHeight = 1050; // base design height
    
    containers.forEach(container => {
        if (viewportWidth < designWidth + padding) {
            const scale = (viewportWidth - padding) / designWidth;
            container.style.transform = `scale(${scale})`;
            container.style.height = `${designHeight * scale}px`;
        } else {
            container.style.transform = "none";
            container.style.height = `${designHeight}px`;
        }
    });
}

// Listeners for scaling
window.addEventListener("resize", adjustCollageScale);
window.addEventListener("load", adjustCollageScale);

// --- NAVIGATION MANAGER ---
function navigateTo(screenId) {
    console.log(`Navigating to ${screenId}`);
    
    // Deactivate current screen
    const current = document.getElementById(appState.currentScreen);
    if (current) {
        current.classList.remove("active");
    }

    // Activate target screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add("active");
        appState.currentScreen = screenId;
        
        // Dynamic layouts adjustment on activation
        if (screenId === "screen-welcome") {
            runTypewriter();
        }
        
        if (screenId === "screen-passcode") {
            resetPasscode();
        }
        
        if (screenId === "screen-gifts") {
            checkRevealRestart();
        }

        if (screenId.startsWith("detail-")) {
            setTimeout(adjustCollageScale, 50);
        }
    }
}

// --- FLOATING HEARTS & SPARKLE GENERATOR ---
function createFloatingHeart() {
    if (heartsContainer.childElementCount >= CONFIG.maxHearts) return;

    const heart = document.createElement("div");
    heart.classList.add("heart-float");
    
    const hearts = ["🎂", "🎉", "🥳", "🌸", "✨", "🎈"];
    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    
    heart.style.left = Math.random() * 100 + "vw";
    const duration = Math.random() * 5 + 5; // 5s to 10s
    heart.style.animationDuration = duration + "s";
    const size = Math.random() * 1.2 + 0.6;
    heart.style.fontSize = size + "rem";
    
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

function createSparkleBurst() {
    if (heartsContainer.childElementCount >= CONFIG.maxHearts) return;
    
    // Choose a random position inside the viewport
    const startX = Math.random() * 100; // vw
    const startY = Math.random() * 80 + 10; // vh
    
    // Sparkle colors: lavender, pink, white, soft light purple
    const colors = ["#e8dbfc", "#fbc3bc", "#ffffff", "#b388ff", "#ea80fc"];
    const particleCount = 8 + Math.floor(Math.random() * 6); // 8 to 13 particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.classList.add("sparkle-particle");
        
        // Random angle and distance
        const angle = (i / particleCount) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const velocity = 40 + Math.random() * 50; // speed distance
        const xTranslate = Math.cos(angle) * velocity;
        const yTranslate = Math.sin(angle) * velocity;
        
        // Set CSS custom variables for keyframe animations
        particle.style.setProperty("--tx", `${xTranslate}px`);
        particle.style.setProperty("--ty", `${yTranslate}px`);
        
        // Soft style properties
        particle.style.left = `${startX}vw`;
        particle.style.top = `${startY}vh`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Vary sizes slightly (3px to 6px)
        const size = 3 + Math.random() * 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Gentle rotation/opacity details
        const animDuration = 0.8 + Math.random() * 0.7; // 0.8s to 1.5s
        particle.style.animation = `sparkleOut ${animDuration}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
        
        heartsContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, animDuration * 1000);
    }
}

// --- EVENT HANDLERS ---

// Welcome Choice
btnWelcomeYes.addEventListener("click", () => {
    navigateTo("screen-passcode");
});

btnWelcomeNo.addEventListener("click", () => {
    navigateTo("screen-goaway");
});

// Back from Go Away
btnGoAwayBack.addEventListener("click", () => {
    navigateTo("screen-welcome");
});

// --- PASSCODE LOGIC ---
function resetPasscode() {
    appState.enteredPasscode = "";
    appState.passcodeCorrect = false;
    btnPasscodeNext.classList.add("hidden");
    dots.forEach(dot => {
        dot.classList.remove("active");
        dot.classList.remove("error");
    });
}

function handleKeypadPress(key) {
    if (appState.passcodeCorrect) return; // Prevent input if already correct

    if (appState.enteredPasscode.length < 4) {
        appState.enteredPasscode += key;
        
        const currentIndex = appState.enteredPasscode.length - 1;
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }

        if (appState.enteredPasscode.length === 4) {
            setTimeout(verifyPasscode, 250);
        }
    }
}

function verifyPasscode() {
    if (appState.enteredPasscode === CONFIG.passcode) {
        appState.passcodeCorrect = true;
        btnPasscodeNext.classList.remove("hidden");
    } else {
        // Shake verification container and reset
        passcodeContainer.classList.add("shake-animation");
        dots.forEach(dot => dot.classList.add("error"));

        setTimeout(() => {
            passcodeContainer.classList.remove("shake-animation");
            resetPasscode();
        }, 600);
    }
}

// Keypad events setup
keypadButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const key = e.target.getAttribute("data-key");
        handleKeypadPress(key);
    });
});

btnPasscodeNext.addEventListener("click", () => {
    navigateTo("screen-crown");
});

// --- CROWN LOGIC ---
btnCrownTake.addEventListener("click", () => {
    navigateTo("screen-camera");
});

// --- CAMERA PHOTO LOGIC ---
btnCameraSee.addEventListener("click", () => {
    cameraFlash.classList.add("flash-active");
    
    setTimeout(() => {
        cameraFlash.classList.remove("flash-active");
        navigateTo("screen-reveal");
    }, 500);
});

// Polaroid next
btnRevealNext.addEventListener("click", () => {
    navigateTo("screen-wish");
});

// --- CAKE WISH LOGIC ---
btnWishBlow.addEventListener("click", () => {
    if (appState.candlesBlown) return;

    btnWishBlow.classList.add("hidden");

    // Extinguish 6 candles sequentially
    candles.forEach((candle, index) => {
        setTimeout(() => {
            candle.classList.remove("active");
            candle.classList.add("blown");
        }, index * 200);
    });

    // Update screen title and reveal NEXT button
    setTimeout(() => {
        appState.candlesBlown = true;
        wishTitle.innerHTML = `Happy Birthday Aishwarya! 🎉`;
        btnWishNext.classList.remove("hidden");
    }, candles.length * 200 + 400);
});

btnWishNext.addEventListener("click", () => {
    navigateTo("screen-gifts");
});

// --- SPECIAL GIFTS OVERLAY LOGIC ---
giftLetter.addEventListener("click", () => {
    appState.visitedLetter = true;
    navigateTo("detail-letter");
});

giftGallery.addEventListener("click", () => {
    appState.visitedGallery = true;
    navigateTo("detail-gallery");
});

// Back to Gift Hub triggers
btnLetterBack.addEventListener("click", () => {
    navigateTo("screen-gifts");
    resetEnvelope();
    checkRevealRestart();
});

btnGalleryBack.addEventListener("click", () => {
    navigateTo("screen-gifts");
    checkRevealRestart();
});

function checkRevealRestart() {
    const restartContainer = document.getElementById("restart-container");
    const specialMsgPopup = document.getElementById("special-msg-popup");
    if (appState.visitedGallery) {
        if (specialMsgPopup && specialMsgPopup.classList.contains("hidden")) {
            specialMsgPopup.classList.remove("hidden");
            specialMsgPopup.classList.add("fade-in");
        }
        if (restartContainer && restartContainer.classList.contains("hidden")) {
            restartContainer.classList.remove("hidden");
            restartContainer.classList.add("fade-in");
        }
    } else {
        if (specialMsgPopup) {
            specialMsgPopup.classList.add("hidden");
            specialMsgPopup.classList.remove("fade-in");
        }
        if (restartContainer) {
            restartContainer.classList.add("hidden");
            restartContainer.classList.remove("fade-in");
        }
    }
}

// --- ENVELOPE LOVE LETTER INTERACTION ---
function resetEnvelope() {
    appState.letterOpened = false;
    const envelope = document.querySelector("#envelope-click-area .heart-envelope");
    if (envelope) {
        envelope.classList.remove("open");
    }
    envelopeArea.classList.remove("hidden");
    fullLetterPaper.classList.add("hidden");
}

envelopeArea.addEventListener("click", () => {
    if (appState.letterOpened) return;
    appState.letterOpened = true;

    const envelope = document.querySelector("#envelope-click-area .heart-envelope");
    envelope.classList.add("open");

    // Envelope open transition timeline
    setTimeout(() => {
        envelopeArea.classList.add("hidden");
        fullLetterPaper.classList.remove("hidden");
        fullLetterPaper.classList.add("fade-in");
        setTimeout(adjustCollageScale, 50); // triggers scale check once content becomes visible
    }, 1300);
});

// --- RESTART BUTTON LOGIC ---
const btnRestart = document.getElementById("btn-restart-app");
if (btnRestart) {
    btnRestart.addEventListener("click", () => {
        // Full page reload — cleanest reset, no glitches
        window.location.reload();
    });
}

// --- BACKGROUND MUSIC CONTROLLER ---
const bgMusic = document.getElementById("bg-music");
const btnMusicToggle = document.getElementById("btn-music-toggle");
const volumeSlider = document.getElementById("volume-slider");

if (bgMusic && btnMusicToggle && volumeSlider) {
    // Default volume
    bgMusic.volume = 0.5;

    // Auto-play on first click anywhere
    function startMusic() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                btnMusicToggle.innerText = "❚❚"; // Pause icon
                document.removeEventListener("click", startMusic);
            }).catch(err => {
                console.log("Autoplay prevented:", err);
            });
        }
    }
    document.addEventListener("click", startMusic);

    // Toggle play/pause
    btnMusicToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent triggering the document click listener
        if (bgMusic.paused) {
            bgMusic.play();
            btnMusicToggle.innerText = "❚❚"; // Pause icon
        } else {
            bgMusic.pause();
            btnMusicToggle.innerText = "▶"; // Play icon
        }
    });

    // Adjust volume
    volumeSlider.addEventListener("input", (e) => {
        bgMusic.volume = e.target.value;
    });
}

// --- INITIALIZATION ---
window.addEventListener("DOMContentLoaded", () => {
    // Start background heart spawn loop
    setInterval(createFloatingHeart, CONFIG.floatingHeartsInterval);
    // Start background sparkle/mini firework bursts interval
    setInterval(createSparkleBurst, 1500);
    // Initial typewriter run
    runTypewriter();
});
