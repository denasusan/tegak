import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { STATUS_KASUS_LABEL } from "@/lib/utils";

function csvEscape(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "KEPALA_PUSKESMAS") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const kasus = await prisma.kasusBalita.findMany({
    orderBy: { createdAt: "desc" },
    include: { dibuatOleh: true, skrining: true, rujukan: true },
  });

  const header = [
    "Nama Balita",
    "Nama Orang Tua",
    "Status Kasus",
    "Dibuat Oleh",
    "Hasil Skrining",
    "Jumlah Rujukan",
    "Tanggal Dibuat",
  ];

  const baris = kasus.map((k) =>
    [
      k.namaBalita,
      k.namaOrangTua,
      STATUS_KASUS_LABEL[k.statusKasus] || k.statusKasus,
      k.dibuatOleh.nama,
      k.skrining?.hasilSkrining || "-",
      k.rujukan.length,
      new Date(k.createdAt).toISOString().slice(0, 10),
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [header.join(","), ...baris].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="laporan-kasus-stunting-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
