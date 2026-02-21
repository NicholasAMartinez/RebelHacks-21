const express = require("express");
const { createHmac } = require("node:crypto");
const { randomInt } = require("node:crypto");

const app = express();
const PORT = process.env.PORT || 3001;
const spinProofSecret = process.env.SPIN_PROOF_SECRET || "";
const allowedOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.use(express.json());
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

function toItemId(value) {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function normalizeAngle(value) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createSpinProof(payload) {
  const serialized = JSON.stringify(payload);
  const payloadEncoded = toBase64Url(serialized);
  const signature = createHmac("sha256", spinProofSecret)
    .update(payloadEncoded)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `${payloadEncoded}.${signature}`;
}

app.get("/", (req, res) => {
  res.send("Express server is running.");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/pool/spin", (req, res) => {
  if (!spinProofSecret) {
    res.status(500).json({
      ok: false,
      error: "Spin proof secret is not configured on the spin service.",
    });
    return;
  }

  const requesterItemId = toItemId(req.body?.requesterItemId);
  const candidateRaw = Array.isArray(req.body?.candidateItemIds) ? req.body.candidateItemIds : [];
  const candidateItemIds = Array.from(
    new Set(
      candidateRaw
    .map((value) => toItemId(value))
        .filter((value) => !!value),
    ),
  );

  if (!requesterItemId) {
    res.status(400).json({ ok: false, error: "A valid requester item id is required." });
    return;
  }

  if (candidateItemIds.length < 1) {
    res.status(400).json({ ok: false, error: "At least one candidate item is required." });
    return;
  }

  const candidateCount = candidateItemIds.length;
  const winnerIndex = randomInt(candidateCount);
  const winnerItemId = candidateItemIds[winnerIndex];

  const segmentAngle = 360 / candidateCount;
  const edgeBuffer = Math.min(segmentAngle * 0.2, 3);
  const inSegmentMin = edgeBuffer;
  const inSegmentMax = Math.max(inSegmentMin, segmentAngle - edgeBuffer);
  const randomFloat = randomInt(0, 1_000_000) / 1_000_000;
  const randomOffsetInSegment = inSegmentMin + randomFloat * (inSegmentMax - inSegmentMin);
  const winnerAngle = winnerIndex * segmentAngle + randomOffsetInSegment;
  const targetAngle = normalizeAngle(360 - winnerAngle);

  const extraTurns = 360 * (6 + randomInt(5));
  const durationMs = 4200 + randomInt(1800);
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 60_000;
  const spinProof = createSpinProof({
    requesterItemId,
    winnerItemId,
    candidateItemIds,
    issuedAt,
    expiresAt,
  });

  res.status(200).json({
    ok: true,
    winnerItemId,
    winnerIndex,
    targetAngle,
    extraTurns,
    durationMs,
    spinProof,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
