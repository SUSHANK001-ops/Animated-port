import connectDB from "@/lib/db";

import BlogModel from "@/model/blogModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB();
        const {slug,title,timeToRead,Titledescription,image,tags,category,dateposted,author,content} = await req.json();
        if(!slug || !title || !timeToRead || !Titledescription || !image || !tags || !category || !dateposted || !author || !content){
            return  NextResponse.json({error: "All fields are required"}, {status: 400})
        }
        const newBlogpost = await BlogModel.create({
            slug,
            title,
            timeToRead,
            Titledescription,
            image,
            tags,
            category,
            dateposted,
            author,
            content
            
        }); 
        return NextResponse.json({message: "Blog post created successfully", blog: newBlogpost}, {status: 201})

    } catch (error) {
        return NextResponse.json({message: `Error creating blog post: ${error}`}, {status: 400})
    }
}

