import connectDB from "@/lib/db";
import AdminModel from "@/model/adminModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB();
        const {username,password,email} = await req.json();
        if(!username || !password || !email){
            return NextResponse.json({error: "Username, password and email are required"}, {status: 400})
        }
        const admin = await AdminModel.create({username,password,email});
        return NextResponse.json({message: "Admin created successfully", admin}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: `Error creating admin: ${error}`}, {status: 400})
    }
}

export async function GET(req:NextRequest){
    try {
        await connectDB();
        const admins = await AdminModel.findOne({email : req.nextUrl.searchParams.get("email")});
        return NextResponse.json({admins}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `Error fetching admins: ${error}`}, {status: 400})
    }}