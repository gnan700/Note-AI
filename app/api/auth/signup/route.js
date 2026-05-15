// app/api/auth/signup/route.js
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Simple validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectToDB();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
