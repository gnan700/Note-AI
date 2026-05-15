// app/api/tasks/[id]/route.js

import { connectToDB } from "@/lib/db";
import { Task } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const { title, done } = await req.json();
    await connectToDB();

    const updated = await Task.findOneAndUpdate(
      { _id: params.id, user: session.user.id },
      { title, done },
      { new: true }
    );

    if (!updated) {
      return new Response("Task not found or unauthorized", { status: 404 });
    }

    return Response.json(updated);
  } catch (err) {
    console.error("PUT /api/tasks/[id] error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    await connectToDB();

    const deleted = await Task.findOneAndDelete({ _id: params.id, user: session.user.id });

    if (!deleted) {
      return new Response("Task not found or unauthorized", { status: 404 });
    }

    return new Response("Task deleted", { status: 200 });
  } catch (err) {
    console.error("DELETE /api/tasks/[id] error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
