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
    const score = searchParams.get("score");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where = {
      businessId: business.id,
      ...(score ? { score: score as "hot" | "warm" | "cold" } : {}),
      ...(status ? { status: status as "new" | "messaged" | "replied" | "qualified" | "cold" | "lost" } : {}),
      ...(search ? { phoneNumber: { contains: search } } : {}),
    };

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: {
          sourceLine: { select: { label: true, phoneNumber: true } },
          assignedAgent: { select: { fullName: true, email: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { body: true, direction: true, sentAt: true, channel: true },
          },
          call: { select: { receivedAt: true, callStatus: true } },
        },
      }),
    ]);

    return NextResponse.json({
      items: leads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Leads list error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
