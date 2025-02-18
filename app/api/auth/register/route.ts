import { connectToDatabase } from "@/lib/DB";
import User from "@/Models/User";

import { NextRequest, NextResponse } from "next/server";



export async function POST( req : NextRequest ) {
    try {
        const  {  email , password } = await req.json();
        if( !email || !password ){ 
            return NextResponse.json(
                { error : " email and password are required " },
                { status  : 400}
            )
        }
        await connectToDatabase();
        const user = await User.findOne({email});
        if( user ){
            return NextResponse.json(
                { error : " email already registered  " },
                { status  : 400}
            )
        }
        await User.create({email,password});
        return NextResponse.json(
            { message : "User Registered Succesfully!" },
            { status  : 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            { error : `This error is occuring in DB file
                ${error} ` },
            { status  : 500}
        )
    }
}