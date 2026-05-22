let startTime;
let timerInterval;
let target;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const currentTimeDisplay = document.getElementById("currentTime");
const targetTimeDisplay = document.getElementById("targetTime");
const resultDisplay = document.getElementById("result");
const winSound = document.getElementById("winSound");

function generateTarget() {
    target = (Math.random() * 3 + 1).toFixed(2);
    targetTimeDisplay.innerText = "Target: " + target + "s";
}

generateTarget();

startBtn.onclick = () => {
    startTime = Date.now();

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resultDisplay.innerText = "";

    timerInterval = setInterval(() => {
        let current = (Date.now() - startTime) / 1000;
        currentTimeDisplay.innerText = current.toFixed(2);
    }, 10);
};

stopBtn.onclick = () => {
    clearInterval(timerInterval);

    let finalTime = parseFloat(currentTimeDisplay.innerText);
    let targetTime = parseFloat(target);

    startBtn.disabled = false;
    stopBtn.disabled = true;

    let difference = Math.abs(finalTime - targetTime);

    if (difference <= 0.00) {
        resultDisplay.innerText = "WOWW EXACT MATCH!";

        winSound.currentTime = 0;
        winSound.play().catch(err => {
            console.log("Audio error:", err);
        });

    } else if (difference <= 0.09) {
        resultDisplay.innerText = "So Close! broo";

    } else {
        resultDisplay.innerText = "❌ Failed! Off by " + difference.toFixed(2) + "s";
    }

    setTimeout(() => {
        generateTarget();
        currentTimeDisplay.innerText = "0.00";
    }, 1500);
};

document.addEventListener("contextmenu", function(e){
  e.preventDefault();
});