import { connectToDB } from "@/lib/db";
import { Task } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // ✅ FIXED import path

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectToDB();
  const tasks = await Task.find({ user: session.user.id }).sort({ createdAt: -1 });
  return Response.json(tasks);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title } = await req.json();
  await connectToDB();
  const task = await Task.create({ user: session.user.id, title, done: false });
  return Response.json(task);
}
