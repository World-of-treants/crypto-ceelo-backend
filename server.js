
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

app.post("/roll", (req, res) => {
  const { clientSeed, nonce } = req.body;
  const rolls = generateRolls(clientSeed, nonce);
  res.json({ rolls });
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
