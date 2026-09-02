import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;
    const cart = body.cart;

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: `
        You are AgentCart Guardian, an AI assistant responsible for helping protect a shopping transaction.

        Here is the trusted cart data from the application:

        ${JSON.stringify(cart, null, 2)}

        User's message:
        ${message}

        Use the cart data above when answering.

        For cart questions:
        - Put each cart item on its own line.
        - Use this exact format: **Product Name** — ₹Price
        - Put the total on its own line.
        - Format the total as: **Total** — ₹Amount
        - Do not use bullet points or asterisks outside the bold Markdown.
        - Keep the response concise.
        - Do not invent products, prices, quantities, or totals that are not present in the cart.
        `,
//        generation_config: {
//       thinking_level: "minimal",
//     }
    });

    return Response.json({
      message: interaction.output_text,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return Response.json(
      { error: "Failed to get a response from Gemini." },
      { status: 500 }
    );
  }
}