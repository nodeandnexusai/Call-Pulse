import { NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/auth";
import { processFollowUpSequences } from "@/lib/automation";

export async function POST(req: Request) {
  if (!requireCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const processed = await processFollowUpSequences();
    return NextResponse.json({
      success: true,
      message: `Processed ${processed} follow-up sequence message(s)`,
    });
  } catch (err) {
    console.error("Follow-up sequences cron error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
