import { authenticateAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const admin = authenticateAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { admin: { id: admin.id, email: admin.email, username: admin.username } },
    { status: 200 }
  );
}
