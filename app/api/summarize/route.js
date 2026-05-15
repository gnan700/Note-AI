// app/api/summarize/route.js
export async function POST(req) {
  const { content } = await req.json();

  const useMock = !process.env.OPENAI_API_KEY;

  if (useMock) {
    await new Promise((r) => setTimeout(r, 1000));
    return Response.json({
      summary: `📝 Mock Summary: This note has ${
        content.split(" ").length
      } words. Looks good!`,
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Summarize the following note in clear, concise bullet points.",
          },
          { role: "user", content },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const isQuotaError =
        data?.error?.code === "insufficient_quota" ||
        data?.error?.message?.toLowerCase().includes("quota");

      if (isQuotaError) {
        return Response.json({
          summary:
            "⚠️ AI summary temporarily unavailable (quota exceeded). Try again later.",
        });
      }

      console.error("OpenAI API error:", data);
      return new Response("❌ Failed to summarize", { status: 500 });
    }

    return Response.json({
      summary:
        data.choices?.[0]?.message?.content || "AI did not return a summary.",
    });
  } catch (error) {
    console.error("Summarization failed:", error);

    return Response.json({
      summary: `📝 Mock Summary (fallback): ${content.slice(0, 60)}...`,
    });
  }
}
