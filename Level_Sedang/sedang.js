let gameOverSound = new Audio("game_over.mp3");

const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");

let bubbles = [];
let mouse = { x: 0, y: 0 };
let score = 0;
let lives = 3;
let timeLeft = 60;

let gameStarted = false;
let countdown = 3;

// 🔹 Data soal
const questionMap = {
  1: { q: "Apa fungsi utama CPU dalam komputer?", a: "Memproses data dan menjalankan instruksi." },
  2: { q: "Apa yang dimaksud dengan sistem operasi?", a: "Software yang mengatur kerja komputer." },
  3: { q: "Sebutkan 2 contoh perangkat input!", a: "Keyboard, mouse." },
  4: { q: "Apa itu software aplikasi?", a: "Program untuk membantu tugas pengguna." },
  5: { q: "Apa yang dimaksud dengan jaringan komputer?", a: "Kumpulan komputer yang saling terhubung." },
  6: { q: "Apa fungsi browser?", a: "Mengakses dan menampilkan halaman web." },
  7: { q: "Apa itu file?", a: "Kumpulan data yang tersimpan." },
  8: { q: "Apa yang dimaksud dengan virus komputer?", a: "Program berbahaya yang merusak sistem." },
  9: { q: "Apa fungsi dari RAM?", a: "Menyimpan data sementara saat komputer berjalan." },
 10: { q: "Apa fungsi dari hard disk?", a: "Menyimpan data secara permanen." }
};

// 🔥 GAME OVER FUNCTION
function showGameOver() {
  document.getElementById("finalScore").innerText = score;
  document.getElementById("gameOverPopup").style.display = "block";
  gameStarted = false;

  gameOverSound.currentTime = 0;
  gameOverSound.play();
}

// 🔹 Buat bubble
function newBubble(num) {
  return {
    x: Math.random() * c.width,
    y: c.height,
    r: 25,
    value: num,
    question: questionMap[num].q,
    answer: questionMap[num].a
  };
}

// 🔹 Spawn bubble
setInterval(() => {
  if (!gameStarted) return;

  let num = Math.floor(Math.random() * 10) + 1;
  bubbles.push(newBubble(num));
}, 1200);

// 🔹 Mouse
c.addEventListener("mousemove", e => {
  const rect = c.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// 🔹 Klik bubble
c.addEventListener("click", () => {
  if (!gameStarted) return;

  bubbles = bubbles.filter(b => {
    const dx = mouse.x - b.x;
    const dy = mouse.y - b.y;

    if (Math.sqrt(dx * dx + dy * dy) < b.r) {
      let userAns = prompt("Jawab: " + b.question);

      if (!userAns) return true;

      if (userAns.trim().toLowerCase() === b.answer.toLowerCase()) {
        alert("✔ Benar!");
        score++;
        document.getElementById("score").textContent = score;
      } else {
        alert("❌ Salah! Jawaban: " + b.answer);
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

  if (timeLeft <= 0) showGameOver();
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

  // countdown
  if (!gameStarted) {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";

    ctx.fillText(countdown > 0 ? countdown : "START!", c.width / 2, c.height / 2);

    requestAnimationFrame(draw);
    return;
  }

  // bubble
  bubbles.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = "skyblue";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(b.value, b.x, b.y);

    b.y -= 1.4;

    if (b.y < 0) {
      lives--;
      document.getElementById("lives").textContent = lives;
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