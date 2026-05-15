import { connectToDB } from "@/lib/db";
import { Note } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // ✅ FIXED path

export async function GET() {
  const session = await getServerSession(authOptions);
  await connectToDB();
  const notes = await Note.find({ user: session.user.id });
  return Response.json(notes);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { title, content } = await req.json();
  await connectToDB();
  const note = await Note.create({ user: session.user.id, title, content });
  return Response.json(note);
}
