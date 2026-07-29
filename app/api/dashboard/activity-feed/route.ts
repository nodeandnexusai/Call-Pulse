import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { business } = await requireBusiness();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const skip = (page - 1) * limit;
    const status = searchParams.get("status"); // missed | answered | voicemail
    const lineId = searchParams.get("lineId");

    const where = {
      businessId: business.id,
      ...(status ? { callStatus: status as "missed" | "answered" | "voicemail" } : {}),
      ...(lineId ? { lineId } : {}),
    };

    const [total, calls] = await Promise.all([
      prisma.call.count({ where }),
      prisma.call.findMany({
        where,
        orderBy: { receivedAt: "desc" },
        skip,
        take: limit,
        include: {
          line: { select: { label: true, phoneNumber: true } },
          lead: {
            select: {
              id: true,
              status: true,
              score: true,
              messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: { body: true, direction: true, sentAt: true },
              },
            },
          },
        },
      }),
    ]);

    const items = calls.map((call) => ({
      id: call.id,
      callerNumber: call.callerNumber,
      callStatus: call.callStatus,
      receivedAt: call.receivedAt,
      line: call.line,
      lead: call.lead
        ? {
            id: call.lead.id,
            status: call.lead.status,
            score: call.lead.score,
            lastMessage: call.lead.messages[0] ?? null,
          }
        : null,
    }));

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Activity feed error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
