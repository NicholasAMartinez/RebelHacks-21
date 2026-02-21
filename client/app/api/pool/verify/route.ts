import { NextResponse } from "next/server";
import { verifySpinProof } from "@/lib/spin-proof";

type VerifyBody = {
  requesterItemId?: number | string;
  recipientItemId?: number | string;
  spinProof?: string;
};

function toItemId(value: unknown) {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as VerifyBody | null;
  const requesterItemId = toItemId(body?.requesterItemId);
  const recipientItemId = toItemId(body?.recipientItemId);
  const spinProof = typeof body?.spinProof === "string" ? body.spinProof.trim() : "";

  if (!requesterItemId || !recipientItemId || !spinProof) {
    return NextResponse.json(
      { ok: false, error: "requesterItemId, recipientItemId, and spinProof are required." },
      { status: 400 },
    );
  }

  const result = verifySpinProof({
    spinProof,
    requesterItemId,
    recipientItemId,
  });

  if (!result.ok) {
    if (result.error.includes("SPIN_PROOF_SECRET is not configured")) {
      return NextResponse.json(
        { ok: false, error: "SPIN_PROOF_SECRET is not configured on the app server." },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, error: result.error }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    verification: {
      requesterItemId: result.payload.requesterItemId,
      winnerItemId: result.payload.winnerItemId,
      candidateCount: result.payload.candidateItemIds.length,
      issuedAt: result.payload.issuedAt,
      expiresAt: result.payload.expiresAt,
    },
  });
}
