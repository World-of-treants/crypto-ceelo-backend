
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const serverSeed = "server_secret_123";

function generateRolls(clientSeed, nonce) {
  const combined = `${serverSeed}:${clientSeed}:${nonce}`;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");
  const rolls = [];

  for (let i = 0; i < 3; i++) {
    const slice = hash.substring(i * 5, i * 5 + 5);
    const roll = (parseInt(slice, 16) % 6) + 1;
    rolls.push(roll);
  }

  return rolls;
}

function rollOneDie() {
  return Math.floor(Math.random() * 6) + 1;
}

app.post("/roll", (req, res) => {
  const { clientSeed, nonce } = req.body;
  const rolls = generateRolls(clientSeed, nonce);
  res.json({ rolls });
});

app.get("/roll-first", (req, res) => {
  let playerA = rollOneDie();
  let playerB = rollOneDie();

  while (playerA === playerB) {
    playerA = rollOneDie();
    playerB = rollOneDie();
  }

  const winner = playerA > playerB ? "playerA" : "playerB";
  res.json({ playerA, playerB, winner });
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

