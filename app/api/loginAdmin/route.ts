import connectDB from "@/lib/db";
import AdminModel from "@/model/adminModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // Use jose for compatibility

const jwtSecret = process.env.JWT_SECRET;
const SECRET = jwtSecret ? Buffer.from(jwtSecret, "utf-8") : null;

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // 1. Find Admin
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Ensure JWT secret is available and create payload (add the 'role')
    if (!SECRET) {
      console.error("JWT_SECRET is not set in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const token = await new SignJWT({
      id: admin._id,
      email: admin.email,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET as any);

    // 4. Prepare Response
    const response = NextResponse.json(
      { message: "Login successful", admin: { email: admin.email, username: admin.username } },
      { status: 200 }
    );

    // 5. Set Cookie
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 6. Optional: Update DB token list (handle legacy string tokens)
    const existingTokens = Array.isArray(admin.tokens) ? admin.tokens : (admin.tokens ? [admin.tokens as any] : []);
    admin.tokens = [token, ...existingTokens].slice(0, 5);
    await admin.save();

    return response;
  } catch (error) {
    console.error("/api/loginAdmin error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
}