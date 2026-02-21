import { createHmac, timingSafeEqual } from "node:crypto";

type SpinProofPayload = {
  requesterItemId: number;
  winnerItemId: number;
  candidateItemIds: number[];
  issuedAt: number;
  expiresAt: number;
};

type VerifySpinProofParams = {
  spinProof: string;
  requesterItemId: number;
  recipientItemId: number;
};

type VerifySpinProofResult =
  | { ok: true; payload: SpinProofPayload }
  | { ok: false; error: string };

const MAX_CLOCK_SKEW_MS = 15_000;

function toBase64(value: string) {
  return value.replace(/-/g, "+").replace(/_/g, "/");
}

function decodeBase64UrlJson(value: string): SpinProofPayload | null {
  try {
    const padded = value + "=".repeat((4 - (value.length % 4 || 4)) % 4);
    const parsed = JSON.parse(Buffer.from(toBase64(padded), "base64").toString("utf8")) as SpinProofPayload;
    return parsed;
  } catch {
    return null;
  }
}

function signPayload(payloadEncoded: string, secret: string) {
  return createHmac("sha256", secret)
    .update(payloadEncoded)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function equalsConstantTime(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function verifySpinProof({
  spinProof,
  requesterItemId,
  recipientItemId,
}: VerifySpinProofParams): VerifySpinProofResult {
  const secret = process.env.SPIN_PROOF_SECRET || "";
  if (!secret) {
    return { ok: false, error: "SPIN_PROOF_SECRET is not configured." };
  }

  const [payloadEncoded, signature] = spinProof.split(".");
  if (!payloadEncoded || !signature) {
    return { ok: false, error: "Invalid spin proof format." };
  }

  const expectedSignature = signPayload(payloadEncoded, secret);
  if (!equalsConstantTime(signature, expectedSignature)) {
    return { ok: false, error: "Spin proof signature is invalid." };
  }

  const payload = decodeBase64UrlJson(payloadEncoded);
  if (!payload) {
    return { ok: false, error: "Spin proof payload is unreadable." };
  }

  if (
    !Number.isInteger(payload.requesterItemId) ||
    !Number.isInteger(payload.winnerItemId) ||
    !Array.isArray(payload.candidateItemIds) ||
    !Number.isFinite(payload.issuedAt) ||
    !Number.isFinite(payload.expiresAt)
  ) {
    return { ok: false, error: "Spin proof payload is malformed." };
  }

  const now = Date.now();
  if (payload.expiresAt < now) {
    return { ok: false, error: "Spin proof has expired." };
  }

  if (payload.issuedAt > now + MAX_CLOCK_SKEW_MS) {
    return { ok: false, error: "Spin proof issued time is invalid." };
  }

  if (payload.requesterItemId !== requesterItemId) {
    return { ok: false, error: "Spin proof requester item mismatch." };
  }

  if (payload.winnerItemId !== recipientItemId) {
    return { ok: false, error: "Spin proof winner item mismatch." };
  }

  if (!payload.candidateItemIds.includes(recipientItemId)) {
    return { ok: false, error: "Spin proof winner is outside candidate set." };
  }

  return { ok: true, payload };
}
