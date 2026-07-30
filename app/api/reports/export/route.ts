import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";
import PDFDocument from "pdfkit";

type PdfDoc = InstanceType<typeof PDFDocument>;

export async function GET(req: Request) {
  try {
    const { business } = await requireBusiness();
    const { searchParams } = new URL(req.url);
    const format_type = searchParams.get("format") ?? "csv"; // csv | pdf
    const range = searchParams.get("range") ?? "30d";
    const days = range === "7d" ? 7 : 30;
    const since = startOfDay(subDays(new Date(), days - 1));

    const [metrics, leads, calls] = await Promise.all([
      prisma.dailyMetric.findMany({
        where: { businessId: business.id, date: { gte: since } },
        orderBy: { date: "asc" },
      }),
      prisma.lead.findMany({
        where: { businessId: business.id, createdAt: { gte: since } },
        select: { phoneNumber: true, status: true, score: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 500,
      }),
      prisma.call.count({
        where: { businessId: business.id, callStatus: "missed", receivedAt: { gte: since } },
      }),
    ]);

    if (format_type === "pdf") {
      const totalMissed = metrics.reduce((s, m) => s + m.missedCalls, 0);
      const totalReplies = metrics.reduce((s, m) => s + m.repliesReceived, 0);
      const totalQualified = metrics.reduce((s, m) => s + m.leadsQualified, 0);
      const recoveryRate = totalMissed > 0 ? Math.round((totalReplies / totalMissed) * 100) : 0;

      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const chunks: Buffer[] = [];

      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        doc.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        doc.fontSize(20).fillColor("#3525cd").text("Call-Pulse Report");
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#464555").text(
          `Business: ${business.name} | Period: Last ${days} days | Generated: ${new Date().toLocaleDateString()}`
        );
        doc.moveDown(1);

        doc.fontSize(14).fillColor("#1a1b22").text("Summary");
        doc.moveDown(0.5);
        writeStat(doc, "Missed Calls", String(totalMissed));
        writeStat(doc, "Replies Received", String(totalReplies));
        writeStat(doc, "Leads Qualified", String(totalQualified));
        writeStat(doc, "Recovery Rate", `${recoveryRate}%`);

        doc.moveDown(1.5);
        doc.fontSize(14).fillColor("#1a1b22").text("Daily Breakdown");
        doc.moveDown(0.5);
        writeTableHeader(doc, ["Date", "Missed", "Replies", "Qualified", "Recovery"]);
        for (const metric of metrics) {
          writeTableRow(doc, [
            format(new Date(metric.date), "yyyy-MM-dd"),
            String(metric.missedCalls),
            String(metric.repliesReceived),
            String(metric.leadsQualified),
            `${metric.missedCalls > 0 ? Math.round((metric.repliesReceived / metric.missedCalls) * 100) : 0}%`,
          ]);
        }

        doc.addPage();
        doc.fontSize(14).fillColor("#1a1b22").text(`Recent Leads (${leads.length})`);
        doc.moveDown(0.5);
        writeTableHeader(doc, ["Phone", "Status", "Score", "Date"]);
        for (const lead of leads.slice(0, 50)) {
          writeTableRow(doc, [
            lead.phoneNumber,
            String(lead.status),
            lead.score ?? "—",
            format(new Date(lead.createdAt), "yyyy-MM-dd"),
          ]);
        }

        doc.end();
      });

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="callpulse-report-${format(new Date(), "yyyy-MM-dd")}.pdf"`,
        },
      });
    }

    // Default: CSV export
    const rows: string[] = [
      "Type,Date,Phone Number,Status,Score,Missed Calls,Auto Replies,Replies Received,Leads Qualified,Recovery Rate%",
    ];

    for (const m of metrics) {
      const dateStr = format(new Date(m.date), "yyyy-MM-dd");
      const rr = m.missedCalls > 0 ? Math.round((m.repliesReceived / m.missedCalls) * 100) : 0;
      rows.push(`metrics,${dateStr},,,,${m.missedCalls},${m.autoRepliesSent},${m.repliesReceived},${m.leadsQualified},${rr}%`);
    }

    for (const l of leads) {
      rows.push(`lead,${format(new Date(l.createdAt), "yyyy-MM-dd")},${l.phoneNumber},${l.status},${l.score ?? ""},,,,,`);
    }

    const csv = rows.join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="callpulse-export-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Export error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function writeStat(doc: PdfDoc, label: string, value: string) {
  (doc as any).fontSize(11).fillColor("#464555").text(`${label}: `, { continued: true });
  doc.fillColor("#3525cd").text(value);
}

function writeTableHeader(doc: PdfDoc, cells: string[]) {
  const widths = [150, 80, 80, 80, 80];
  const startX = doc.x;
  const startY = doc.y;

  doc.save();
  (doc as any).rect(startX, startY, 490, 20).fill("#3525cd");
  doc.fillColor("#ffffff").fontSize(9);

  let cursor = startX + 6;
  cells.forEach((cell, index) => {
    doc.text(cell, cursor, startY + 6, { width: widths[index], ellipsis: true });
    cursor += widths[index];
  });

  doc.restore();
  doc.moveDown(1.1);
}

function writeTableRow(doc: PdfDoc, cells: string[]) {
  const widths = [150, 80, 80, 80, 80];
  const startX = doc.x;
  const startY = doc.y;

  doc.fontSize(9).fillColor("#1a1b22");

  let cursor = startX + 6;
  cells.forEach((cell, index) => {
    doc.text(cell, cursor, startY, { width: widths[index], ellipsis: true });
    cursor += widths[index];
  });

  doc.moveDown(0.9);
}
