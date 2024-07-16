document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const closePopUp = document.querySelector(".close-btn");
  const removeBtn = document.querySelector(".remove-btn");
  const wheelCanvas = document.getElementById("wheelCanvas");
  const popup = document.querySelector(".popup");
  const winner = document.querySelector(".winner");
  const ctx = wheelCanvas.getContext("2d");
  let selectedName;
  let timeFinish = false;
  const countdown = 60 * 2;

  let names = [
    "Rahul",
    "Prachi",
    "Sourabh",
    "Sumit",
    "Diwakar",
    "Deepak",
    "Kundan",
    "Rohit",
    "Anuj",
    "Simant"
  ];

  shuffleArray(names);

  let startAngle = 0;
  let spinTimeout = null;
  let spinAngleStart = 10;
  let spinTime = 0;
  let spinTimeTotal = 0;

  drawWheel();

  startButton.addEventListener("click", spin);
  closePopUp.addEventListener("click", closePopUpHandler);
  removeBtn.addEventListener("click", removeMeHandler);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function drawWheel() {
    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 125;
    const arc = Math.PI / (names.length / 2);

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = "bold 12px Helvetica, Arial";

    for (let i = 0; i < names.length; i++) {
      const angle = startAngle + i * arc;
      ctx.fillStyle = getColor(i, names.length);

      ctx.beginPath();
      ctx.arc(
        wheelCanvas.width / 2,
        wheelCanvas.height / 2,
        outsideRadius,
        angle,
        angle + arc,
        false
      );
      ctx.arc(
        wheelCanvas.width / 2,
        wheelCanvas.height / 2,
        insideRadius,
        angle + arc,
        angle,
        true
      );
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.fillStyle = "white";
      ctx.translate(
        wheelCanvas.width / 2 + Math.cos(angle + arc / 2) * textRadius,
        wheelCanvas.height / 2 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      const text = names[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    // Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(
      wheelCanvas.width / 2 - 4,
      wheelCanvas.height / 2 - (outsideRadius + 5)
    );
    ctx.lineTo(
      wheelCanvas.width / 2 + 4,
      wheelCanvas.height / 2 - (outsideRadius + 5)
    );
    ctx.lineTo(
      wheelCanvas.width / 2 + 4,
      wheelCanvas.height / 2 - (outsideRadius - 5)
    );
    ctx.lineTo(
      wheelCanvas.width / 2 + 9,
      wheelCanvas.height / 2 - (outsideRadius - 5)
    );
    ctx.lineTo(
      wheelCanvas.width / 2 + 0,
      wheelCanvas.height / 2 - (outsideRadius - 13)
    );
    ctx.lineTo(
      wheelCanvas.width / 2 - 9,
      wheelCanvas.height / 2 - (outsideRadius - 5)
    );
    ctx.lineTo(
      wheelCanvas.width / 2 - 4,
      wheelCanvas.height / 2 - (outsideRadius - 5)
    );
    ctx.lineTo(
      wheelCanvas.width / 2 - 4,
      wheelCanvas.height / 2 - (outsideRadius + 5)
    );
    ctx.fill();
  }

  function getColor(item, maxItem) {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = (Math.PI * 2) / maxItem;

    const red = Math.sin(frequency * item + 2 + phase) * width + center;
    const green = Math.sin(frequency * item + 0 + phase) * width + center;
    const blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return `rgb(${Math.round(red)},${Math.round(green)},${Math.round(blue)})`;
  }

  function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
  }

  function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      stopRotateWheel();
      return;
    }
    const spinAngle =
      spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
  }

  function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = Math.PI / (names.length / 2);
    const index = Math.floor((degrees % 360) / ((arcd * 180) / Math.PI));
    selectedNameIndex = index;
    selectedName = names[names.length - index - 1];
    popup.classList.remove("display-none");
    winner.innerHTML = selectedName;
    startTimer(countdown, document.querySelector(".timer"));
    drawWheel();
  }

  function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }

  let timer;

  function startTimer(duration, display) {
    timeFinish = false;
    let timeRemaining = duration;
    display.textContent = formatTime(timeRemaining);

    clearInterval(timer);
    timer = setInterval(() => {
      timeRemaining--;
      display.textContent = formatTime(timeRemaining);

      if (timeRemaining <= 0) {
        timeFinish = true;
        winner.innerHTML = "Time's up";
        clearInterval(timer);
      }
    }, 1000);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  function closePopUpHandler() {
    popup.classList.add("display-none");
    if (timeFinish) {
      names = names.filter((e) => e !== selectedName);
      drawWheel();
    }
  }

  function removeMeHandler() {
    timeFinish = true;
    closePopUpHandler();
  }
});
