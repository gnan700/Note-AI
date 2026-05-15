export async function POST(req) {
  const { content } = await req.json();
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Summarize the text below into bullet points:" },
        { role: "user", content },
      ],
    }),
  });

  const data = await res.json();
  return Response.json({ summary: data.choices?.[0]?.message?.content || "No summary available." });
}
