let squatCount = 0;
let isSquatting = false;
let bicepCurlCount = 0;
let isCurling = false;
let jumpingJackCount = 0; 
let isJumpingJack = false;

let level = 1;
let xp = 0;
let xpToNextLevel = 100;

function gainXP(amount) {
    xp += amount;
    document.getElementById("xpDisplay").innerText = `XP: ${xp} / ${xpToNextLevel}`;
    checkLevelUp();
}

function checkLevelUp() {
    if (xp >= xpToNextLevel) {
        level++;
        xp -= xpToNextLevel;
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5);

        document.getElementById("levelDisplay").innerText = `Poziom: ${level}`;
        document.getElementById("xpDisplay").innerText = `XP: ${xp} / ${xpToNextLevel}`;
        console.log(`Gratulacje! Osiągnięto poziom ${level}`);
    }
}

function updateSquatCounter(poseLandmarks) {
    const leftHip = poseLandmarks[23];
    const leftKnee = poseLandmarks[25];
    const leftAnkle = poseLandmarks[27];

    const rightHip = poseLandmarks[24];
    const rightKnee = poseLandmarks[26];
    const rightAnkle = poseLandmarks[28];

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
        document.getElementById("errorDisplay").innerText = "Część sylwetki jest niewidoczna. Ustaw się prawidłowo.";
        return;
    } else {
        document.getElementById("errorDisplay").innerText = "";  
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    const averageKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    if (averageKneeAngle < 70 && !isSquatting) {
        isSquatting = true; 
    } else if (averageKneeAngle > 160 && isSquatting) {
        squatCount++;
        isSquatting = false;
        document.getElementById("counter3").innerText = `Przysiady: ${squatCount}`;
        gainXP(10);
    }
}

function updateBicepCurlCounter(poseLandmarks) {
    const leftShoulder = poseLandmarks[11];
    const leftElbow = poseLandmarks[13];
    const leftWrist = poseLandmarks[15];

    const rightShoulder = poseLandmarks[12];
    const rightElbow = poseLandmarks[14];
    const rightWrist = poseLandmarks[16];

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
        document.getElementById("errorDisplay").innerText = "Część sylwetki jest niewidoczna. Ustaw się prawidłowo.";
        return;
    } else {
        document.getElementById("errorDisplay").innerText = "";  
    }

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    const averageElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    if (averageElbowAngle < 30 && !isCurling) {
        isCurling = true; 
    } else if (averageElbowAngle > 150 && isCurling) {
        bicepCurlCount++;
        isCurling = false;
        document.getElementById("bicepCounter").innerText = `Biceps Curls: ${bicepCurlCount}`;
        gainXP(5);
    }
}

let bendCount = 0;
let isBending = false;

function updateBendCounter(poseLandmarks) {
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
        document.getElementById("errorDisplay").innerText = "Część sylwetki jest niewidoczna. Ustaw się prawidłowo.";
        return;
    } else {
        document.getElementById("errorDisplay").innerText = ""; 
    }

    const shoulderHipAngle = calculateAngle(leftShoulder, leftHip, rightHip);

    if (shoulderHipAngle < 70 && !isBending) { 
        isBending = true; 
    } else if (shoulderHipAngle > 90 && isBending) { 
        bendCount++;
        isBending = false;
        document.getElementById("lungeCounter").innerText = `Skłony: ${bendCount}`;
        gainXP(5); 
    }
}


window.onload = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Twoja przeglądarka nie obsługuje dostępu do kamery. Prosimy o aktualizację.");
    } else {
        const video = await startCamera();
        if (video) {
            initMediaPipe(video);
        }
    }
}
