import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "temporary_development_key",
  });

  try {
    const { imageBase64 } = await req.json();

    console.log("--- AI Analysis Start ---");
    console.log("Image data received (base64 length):", imageBase64?.length);

    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is missing from environment");
      return NextResponse.json({
        issue_type: "Other",
        confidence: 0.5,
        description: "API Key missing. Please check .env",
      });
    }

    // Extract raw base64 data
    let base64Data = imageBase64;
    if (imageBase64.includes(";base64,")) {
      base64Data = imageBase64.split(";base64,")[1];
    }

    console.log("Extracted base64 length:", base64Data.length);

    // 🧠 Structured AI Prompt
    const prompt = `You are an AI system that analyzes civic infrastructure issues from images.

Analyze the given image and return ONLY valid JSON:

{
  "issue_type": "",
  "confidence": "",
  "description": ""
}

Rules:
- issue_type must be one of: [Road Damage / Pothole, Garbage Dump, Drainage Issue / Water Logging, Streetlight Issue, Water Leakage, Sewage Issue, Road Debris / Construction Waste, Other]
- confidence must be between 0 and 1
- description must be 1–2 lines, formal civic complaint tone
- do NOT include any extra text
- be accurate and practical for real-world civic reporting`;

    // 🚀 Call Groq LLaMA 4 Scout Vision
    console.log("Calling Groq model: meta-llama/llama-4-scout-17b-16e-instruct");

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`,
              },
            },
          ],
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    console.log("Groq Raw Response:", raw);

    // 📤 Parse the JSON response
    if (!raw) {
      console.warn("Groq returned empty response");
      throw new Error("Empty response from AI model");
    }

    // Extract JSON from potential markdown code blocks
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    console.log("Parsed Result:", JSON.stringify(parsed, null, 2));
    console.log("Final Mapped Type:", parsed.issue_type);
    console.log("--- AI Analysis End ---");

    return NextResponse.json({
      issue_type: parsed.issue_type || "Other",
      confidence: parseFloat(Number(parsed.confidence).toFixed(2)),
      description: parsed.description || "Issue detected. Please review manually.",
    });

  } catch (error: any) {
    console.error(`AI Analysis Error: ${error.message}`);
    return NextResponse.json({
      issue_type: "Other",
      confidence: 0.5,
      description: "Analysis failed. Please try a clearer photo.",
    });
  }
}