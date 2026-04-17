let gameOverSound = new Audio("game_over.mp3");

const c = document.getElementById("game");
const ctx = c.getContext("2d");

let bubbles = [];
let mouse = { x: 0, y: 0 };
let score = 0;
let lives = 3;
let timeLeft = 120;

// 🔹 START SYSTEM
let gameStarted = false;
let countdown = 5;

// 🔹 Pertanyaan berdasarkan angka
const questionMap = {
  1: { q: "Komponen yang dianggap sebagai otak komputer adalah ?", a: "CPU" },
  2: { q: "Apa nama komponen yang berfungsi untuk menyimpan data data secara permanen ?", a: "HDD"  },
  3: { q:"Apa nama komponen yang berfungsi menampilkan gambar atau video ?", a: "GPU" },
  4: { q:"Apa nama jantung komputer   ?", a: "Motherboard" },
  5: { q:"Apa nama komponen yang memberikan daya listrik pada komputer ?", a: "PSU" },
  6: { q:"Apa nama komponen yang memori jangka pendek dan yang digunakan komputer untuk menyimpan data aktif pada komputer ?", a: "RAM" },
  7: { q:"Apa nama komponen pendingin pada komputer?", a: "Fan" },
  8: { q:"Tempat untuk menaruh semua komponen pc adalah ?", a: "Casing" },
  9: { q:"Komponen yang memungkinakan komputer terhubung ke jaringan internet melalui kabel LAN disebut apa ?", a: "LAN Card" },
 10: { q:"Apa nama perangkat yang digunakan untuk memasukkan perintah dan teks pada komputer dan biasa digunakan untuk mengetik ?", a: "Keyboard" }
};

// 🔹 Membuat bubble angka
function newBubble(num) {
  return {
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: 30,
    value: num,
    question: questionMap[num].q,
    answer: questionMap[num].a,
    color: "skyblue"
  };
}

// 🔹 Generate bubble
for (let i = 1; i <= 10; i++) {
  bubbles.push(newBubble(i));
}

// 🔹 Mouse
c.addEventListener("mousemove", e => {
  const r = c.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});

// 🔹 Klik bubble
c.addEventListener("click", () => {
  if (!gameStarted) return;

  let removeIndex = -1;

  bubbles.forEach((b, i) => {
    const dx = mouse.x - b.x;
    const dy = mouse.y - b.y;

    if (Math.sqrt(dx * dx + dy * dy) < b.r) {
      let userAns = prompt("Jawab: " + b.question);

      if (!userAns) return;

      if (userAns.trim().toLowerCase() === b.answer.toLowerCase()) {
        alert("✔ Benar!");
        score++;
        document.getElementById("score").textContent = score;
      } else {
        alert("❌ Salah!\nJawaban benar: " + b.answer);
        lives--;
        document.getElementById("lives").textContent = lives;

        if (lives <= 0) {
          document.getElementById("finalScore").innerText = score;
          document.getElementById("gameOverPopup").style.display = "block";
          gameStarted = false;

          gameOverSound.currentTime = 0;
          gameOverSound.play();
        }
      }

      removeIndex = i;
    }
  });

  if (removeIndex !== -1) {
    bubbles.splice(removeIndex, 1);
  }
});

// 🔹 Timer
setInterval(() => {
  if (!gameStarted) return;

  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;

  if (timeLeft <= 0) {
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverPopup").style.display = "block";
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

  // 🔸 TAMPILKAN COUNTDOWN
  if (!gameStarted) {
    ctx.fillStyle = "black";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (countdown > 0) {
      ctx.fillText(countdown, c.width / 2, c.height / 2);
    } else {
      ctx.fillText("START!", c.width / 2, c.height / 2);
    }

    requestAnimationFrame(draw);
    return;
  }

  // 🔹 Gambar bubble
  bubbles.forEach(b => {
    const dx = mouse.x - b.x;
    const dy = mouse.y - b.y;
    const hover = Math.sqrt(dx * dx + dy * dy) < b.r;

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = hover ? "yellow" : b.color;
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.value, b.x, b.y);

    b.x += (Math.random() - 0.5) * 1.2;
    b.y += (Math.random() - 0.5) * 1.2;

    if (b.x < b.r) b.x = b.r;
    if (b.x > c.width - b.r) b.x = c.width - b.r;
    if (b.y < b.r) b.y = b.r;
    if (b.y > c.height - b.r) b.y = c.height - b.r;
  });

  requestAnimationFrame(draw);
}

function restartGame() {
  location.reload();
}

// 🔹 Start
startCountdown();
draw();