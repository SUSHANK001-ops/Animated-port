import connectDB from "@/lib/db";
import AdminModel from "@/model/adminModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
//admin create route
export async function POST(req:NextRequest){
    try {
        await connectDB();
        const {username,password,email ,role} = await req.json();
        if(!username || !password || !email || !role){
            return NextResponse.json({error: "Username, password, email and role are required"}, {status: 400})
        }
        const existingAdmin = await AdminModel.findOne({email});
        if(existingAdmin){
            return NextResponse.json({error: "Admin with this email already exists"}, {status: 400})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const playload = {
            username,
            password: hashedPassword,
            email,
            role,
            expiresIn: '7d'
        }
        const token = await jsonwebtoken.sign(playload, process.env.JWT_SECRET as string);
        const admin = await AdminModel.create({username, password: hashedPassword, email, role, tokens: token});
        return NextResponse.json({message: "Admin created successfully", admin}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: `Error creating admin: ${error}`}, {status: 400})
    }
}

