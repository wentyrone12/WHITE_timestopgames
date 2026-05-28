let startTime;
let historyData = JSON.parse(localStorage.getItem("matchHistory")) || [];
let timerInterval;
let target;
let finalTime = 0;
let running = false;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const currentTimeDisplay = document.getElementById("currentTime");
const targetTimeDisplay = document.getElementById("targetTime");
const resultDisplay = document.getElementById("result");
const winSound = document.getElementById("winSound");

function generateTarget() {
    target = (Math.random() * 8 + 1).toFixed(2);
    targetTimeDisplay.innerText = "Target: " + target + "s";
}

generateTarget();

startBtn.onclick = () => {

    // 🔥 RESET LANG PAG MAG START ULIT
    clearInterval(timerInterval);

    currentTimeDisplay.innerText = "0.00";
    resultDisplay.innerText = "";

    startTime = Date.now();

    running = true;

    startBtn.disabled = true;
    stopBtn.disabled = false;

    timerInterval = setInterval(() => {

        let current = (Date.now() - startTime) / 1000;

        currentTimeDisplay.innerText = current.toFixed(2);

    }, 10);

};

stopBtn.onclick = () => {

    if (!running) return;

    clearInterval(timerInterval);

    running = false;

    let finalTime = parseFloat(currentTimeDisplay.innerText);
    let targetTime = parseFloat(target);

    startBtn.disabled = false;
    stopBtn.disabled = true;

    let difference = Math.abs(finalTime - targetTime);

    // 🔥 EXACT
    if (finalTime.toFixed(2) === targetTime.toFixed(2)) {

        finalTime = parseFloat(currentTimeDisplay.innerText);

        resultDisplay.innerHTML = `
            <span style="color:#00ff88;">
            🔥 PERFECT EXACT MATCH!
            </span>
        `;

        winSound.currentTime = 0;
        winSound.play();

        exactCelebration();


        addHistory(
            "EXACT",
            targetTime,
            finalTime,
            difference
        );

    }

    // 🔥 CLOSE
    else if (difference <= 0.09) {

        resultDisplay.innerHTML = `
            <span style="color:gold;">
            😮 SO CLOSE!
            </span>
        `;

        // 🔥 AUTO NEW TARGET AFTER 3 SECONDS
        setTimeout(() => {

            generateTarget();

            currentTimeDisplay.innerText = "0.00";

            resultDisplay.innerText = "";

        }, 1000);

        addHistory(
            "CLOSE",
            targetTime,
            finalTime,
            difference
        );

    }

    // FAIL
    else {

        resultDisplay.innerHTML = `
            <span style="color:#ff5555;">
            ❌ Failed! Off by ${difference.toFixed(2)}s
            </span>
        `;

        // 🔥 AUTO NEW TARGET AFTER 3 SECONDS
        setTimeout(() => {

            generateTarget();

            currentTimeDisplay.innerText = "0.00";

            resultDisplay.innerText = "";

        }, 1000);


        addHistory(
            "FAILED",
            targetTime,
            finalTime,
            difference
        );

    }

};

// 🔥 EXACT CELEBRATION
function exactCelebration() {

    // vibration mobile
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }

    // fake screenshot popup
    const shot = document.createElement("div");

    shot.innerHTML = `
        📸 Screenshot Saved!
    `;

    shot.style.position = "fixed";
    shot.style.top = "30px";
    shot.style.left = "50%";
    shot.style.transform = "translateX(-50%)";
    shot.style.background = "#00ff88";
    shot.style.color = "black";
    shot.style.padding = "15px 25px";
    shot.style.borderRadius = "15px";
    shot.style.fontWeight = "bold";
    shot.style.zIndex = "9999";
    shot.style.boxShadow = "0 0 20px rgba(0,255,136,.5)";
    shot.style.animation = "pop .5s ease";

    document.body.appendChild(shot);

    setTimeout(() => {
        shot.remove();
    }, 2500);

    // 🔥 VIRAL VIDEO POPUP
    const popup = document.createElement("div");

    popup.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.8);
            display:flex;
            justify-content:center;
            align-items:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:350px;
                background:#111;
                border:1px solid rgba(0,255,136,.2);
                border-radius:25px;
                padding:20px;
                text-align:center;
                color:white;
                animation:popup .4s ease;
            ">

                <h2 style="
                    color:#00ff88;
                    margin-bottom:10px;
                ">
                🔥 WOW GENIUS!
                </h2>

                <p style="
                    margin-bottom:20px;
                    line-height:1.5;
                    color:#ccc;
                ">
                You hit the EXACT time!
                </p>

                <video controls autoplay playsinline style="
    width:100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius:15px;
    margin-bottom:15px;
    background:black;
">F\
                    <source src="vids.mp4">
                </video>

                <button id="closePopup" style="
                    width:100%;
                    padding:12px;
                    border:none;
                    border-radius:12px;
                    background:#00ff88;
                    color:black;
                    font-weight:bold;
                    cursor:pointer;
                ">
                    CLOSE
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(popup);

    document.getElementById("closePopup")
        .onclick = () => {

            popup.remove();

            // 🔥 STAY LANG PAG EXACT
            currentTimeDisplay.innerText = finalTime.toFixed(2);

            resultDisplay.innerHTML = `
        <span style="color:#00ff88;">
        🔥 PERFECT EXACT MATCH!
        </span>
    `;

        };

}

// disable right click
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

// 🔥 ANIMATION STYLE
const style = document.createElement("style");

style.innerHTML = `

@keyframes popup{

    from{
        transform:scale(.7);
        opacity:0;
    }

    to{
        transform:scale(1);
        opacity:1;
    }

}

@keyframes pop{

    from{
        transform:translateX(-50%) scale(.5);
        opacity:0;
    }

    to{
        transform:translateX(-50%) scale(1);
        opacity:1;
    }

}

`;

document.head.appendChild(style);

// 🔥 SAVE HISTORY
function addHistory(status, targetTime, finalTime, difference) {

    const history = {
        status,
        target: targetTime.toFixed(2),
        result: finalTime.toFixed(2),
        diff: difference.toFixed(2),
        date: new Date().toLocaleTimeString()
    };

    historyData.unshift(history);

    // limit 50
    if (historyData.length > 50) {
        historyData.pop();
    }

    localStorage.setItem(
        "matchHistory",
        JSON.stringify(historyData)
    );

    renderHistory();

}

// 🔥 RENDER HISTORY
function renderHistory() {

    const historyList =
        document.getElementById("historyList");

    if (!historyList) return;

    historyList.innerHTML = "";

    if (historyData.length === 0) {

        historyList.innerHTML = `
            <div style="
                text-align:center;
                color:gray;
                padding:20px;
                font-size:12px;
            ">
                No match history yet
            </div>
        `;

        return;
    }

    historyData.forEach(item => {

        let colorClass = "";

        if (item.status === "EXACT") {
            colorClass = "history-green";
        }

        else if (item.status === "CLOSE") {
            colorClass = "history-yellow";
        }

        else {
            colorClass = "history-red";
        }

        const div = document.createElement("div");

        div.className =
            `history-item ${colorClass}`;

        div.innerHTML = `

            <div class="history-title">
                ${item.status}
            </div>

            🎯 Target: ${item.target}s <br>
            ⏱ Result: ${item.result}s <br>
            📉 Difference: ${item.diff}s <br>
            🕒 ${item.date}

        `;

        historyList.appendChild(div);

    });

}

// 🔥 CLEAR HISTORY
window.clearHistory = function () {

    if (!confirm("Clear all history?")) return;

    historyData = [];

    localStorage.removeItem("matchHistory");

    renderHistory();

};

renderHistory();