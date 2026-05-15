import { connectToDB } from "@/lib/db";
import { Note } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // ✅ FIXED path

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  const { title, content } = await req.json();
  await connectToDB();
  const updated = await Note.findOneAndUpdate(
    { _id: params.id, user: session.user.id },
    { title, content },
    { new: true }
  );
  return Response.json(updated);
}

export async function DELETE(_, { params }) {
  const session = await getServerSession(authOptions);
  await connectToDB();
  await Note.findOneAndDelete({ _id: params.id, user: session.user.id });
  return new Response("Deleted", { status: 200 });
}
