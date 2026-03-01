import connectDB from "@/lib/db";
import BlogModel from "@/model/blogModel";
import { authenticateAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET all blogs (admin - includes all data)
export async function GET(req: NextRequest) {
  try {
    const admin = authenticateAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// CREATE a new blog post
export async function POST(req: NextRequest) {
  try {
    const admin = authenticateAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const {
      slug,
      title,
      timeToRead,
      Titledescription,
      image,
      tags,
      category,
      author,
      content,
    } = body;

    if (
      !slug ||
      !title ||
      !timeToRead ||
      !Titledescription ||
      !image ||
      !tags ||
      !category ||
      !author ||
      !content
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingPost = await BlogModel.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : tags.split(",").map((t: string) => t.trim()).filter(Boolean);

    const blog = await BlogModel.create({
      slug,
      title,
      timeToRead,
      Titledescription,
      image,
      tags: parsedTags,
      category,
      author,
      content,
    });

    return NextResponse.json(
      { message: "Blog post created successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
