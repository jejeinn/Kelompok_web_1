let gameOverSound = new Audio("game_over.mp3");

const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");

let bubbles = [];
let mouse = { x: 0, y: 0 };
let score = 0;
let lives = 4;
let timeLeft = 60;

let gameStarted = false;
let countdown = 3;

// 🔹 Soal
const questionMap = {
  1: { q: "Apa fungsi utama kernel dalam sistem operasi?", a: "Mengatur komunikasi antara hardware dan software" },
  2: { q: "Apa perbedaan utama antara RAM dan ROM?", a: "RAM sementara, ROM permanen" },
  3: { q: "Apa itu deadlock dalam sistem operasi?", a: "Kondisi proses saling menunggu tanpa akhir." },
  4: { q: "Apa fungsi dari compiler?", a: "Mengubah kode sumber menjadi kode mesin." },
  5: { q: "Apa yang dimaksud dengan IP Address?", a: "Alamat unik perangkat di jaringan." },
  6: { q: "Apa perbedaan HTTP dan HTTPS?", a: "HTTPS lebih aman (terenkripsi)." },
  7: { q: "Apa itu cache memory?", a: "Memori cepat untuk akses data sementara." },
  8: { q: "Apa fungsi firewall?", a: "Mengamankan jaringan dari akses tidak sah." },
  9: { q: "Apa itu bit dan byte?", a: "1 byte = 8 bit." },
  10:{ q: "Alat mengetik?", a: "Keyboard" }
};

// 🔥 FUNCTION GAME OVER (biar tidak ulang-ulang)
function showGameOver() {
  document.getElementById("finalScore").innerText = score;
  document.getElementById("gameOverPopup").style.display = "block";
  gameStarted = false;

  gameOverSound.currentTime = 0;
  gameOverSound.play();
}

// 🔥 Bubble (dengan jebakan)
function newBubble(num) {
  let isTrap = Math.random() < 0.2;

  return {
    x: Math.random() * c.width,
    y: c.height,
    r: 22,
    value: isTrap ? "💣" : num,
    speed: 1.8 + Math.random() * 0.6,
    type: isTrap ? "trap" : "normal",
    question: isTrap ? null : questionMap[num].q,
    answer: isTrap ? null : questionMap[num].a
  };
}

// 🔹 Spawn bubble
setInterval(() => {
  if (!gameStarted) return;

  let jumlah = Math.random() < 0.3 ? 2 : 1;

  for (let i = 0; i < jumlah; i++) {
    let num = Math.floor(Math.random() * 10) + 1;
    bubbles.push(newBubble(num));
  }
}, 1200);

// 🔹 Mouse
c.addEventListener("mousemove", e => {
  const rect = c.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// 🔹 Klik
c.addEventListener("click", () => {
  if (!gameStarted) return;

  bubbles = bubbles.filter(b => {
    const dx = mouse.x - b.x;
    const dy = mouse.y - b.y;

    if (Math.sqrt(dx * dx + dy * dy) < b.r) {

      // 💣 Jebakan
      if (b.type === "trap") {
        alert("💣 Jebakan! Nyawa berkurang!");
        lives--;
        document.getElementById("lives").textContent = lives;

        if (lives <= 0) showGameOver();
        return false;
      }

      // ✅ Soal
      let userAns = prompt("Jawab: " + b.question);

      if (!userAns) return true;

      if (userAns.trim().toLowerCase() === b.answer.toLowerCase()) {
        score++;
        document.getElementById("score").textContent = score;
      } else {
        lives--;
        document.getElementById("lives").textContent = lives;

        if (lives <= 0) showGameOver();
      }

      return false;
    }
    return true;
  });
});

// 🔹 Timer
setInterval(() => {
  if (!gameStarted) return;

  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;

  if (timeLeft <= 0) {
    showGameOver();
  }
}, 1000);

// 🔹 Countdown
function startCountdown() {
  const interval = setInterval(() => {
    countdown--;

    if (countdown < 0) {
      gameStarted = true;
      clearInterval(interval);
    }
  }, 1000);
}

// 🔹 Draw
function draw() {
  ctx.clearRect(0, 0, c.width, c.height);

  if (!gameStarted) {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(countdown > 0 ? countdown : "START!", c.width / 2, c.height / 2);
    requestAnimationFrame(draw);
    return;
  }

  bubbles.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);

    ctx.fillStyle = b.type === "trap" ? "red" : "skyblue";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(b.value, b.x, b.y);

    b.y -= b.speed;

    if (b.y < 0) {
      if (Math.random() < 0.7) {
        lives--;
        document.getElementById("lives").textContent = lives;
      }

      b.y = c.height;

      if (lives <= 0) showGameOver();
    }
  });

  requestAnimationFrame(draw);
}

// 🔹 Restart
function restartGame() {
  location.reload();
}

// 🔹 Start
startCountdown();
draw();