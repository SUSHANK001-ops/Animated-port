import connectDB from "@/lib/db";
import AdminModel from "@/model/adminModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Protected by middleware - only authenticated admins can register new admins
export async function POST(req: NextRequest) {
  try {
    // Double-check auth via middleware headers
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized - Only authenticated admins can register new admins" },
        { status: 401 }
      );
    }

    await connectDB();
    const { username, password, email } = await req.json();

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: "Username, password and email are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await AdminModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Admin registered successfully",
        admin: { id: admin._id, username: admin.username, email: admin.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
