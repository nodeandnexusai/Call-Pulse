import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { business } = await requireBusiness();
    const { searchParams } = new URL(req.url);
    const lineId = searchParams.get("lineId");

    const rules = await prisma.automationRule.findMany({
      where: {
        businessId: business.id,
        ...(lineId ? { lineId } : {}),
      },
      include: {
        template: true,
        afterHoursTemplate: true,
        line: { select: { label: true, phoneNumber: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ rules });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();
    const {
      id,
      lineId,
      isActive,
      templateId,
      respectBusinessHours,
      afterHoursTemplateId,
    } = body;

    if (!templateId) {
      return NextResponse.json({ error: "templateId is required" }, { status: 400 });
    }

    // Verify template belongs to this business
    const template = await prisma.messageTemplate.findFirst({
      where: { id: templateId, businessId: business.id },
    });
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    let rule;
    if (id) {
      const existing = await prisma.automationRule.findFirst({
        where: { id, businessId: business.id },
      });
      if (!existing) {
        return NextResponse.json({ error: "Rule not found" }, { status: 404 });
      }
      rule = await prisma.automationRule.update({
        where: { id: existing.id },
        data: {
          lineId: lineId ?? null,
          isActive: isActive ?? true,
          templateId,
          respectBusinessHours: respectBusinessHours ?? true,
          afterHoursTemplateId: afterHoursTemplateId ?? null,
        },
        include: { template: true, afterHoursTemplate: true },
      });
    } else {
      rule = await prisma.automationRule.create({
        data: {
          businessId: business.id,
          lineId: lineId ?? null,
          isActive: isActive ?? true,
          templateId,
          respectBusinessHours: respectBusinessHours ?? true,
          afterHoursTemplateId: afterHoursTemplateId ?? null,
        },
        include: { template: true, afterHoursTemplate: true },
      });
    }

    return NextResponse.json({ rule });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Automation rule error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
