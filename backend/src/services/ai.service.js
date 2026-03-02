import OpenAI from "openai";
import dotenv from "dotenv";
import { buildPrompt } from "./promptBuilder.js";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateTraining(data) {
   const messages = buildPrompt(data)

   const response = await client.chat.completions.create({
       model: "gpt-4o-mini",
       messages,
       response_format: { type: "json_object" },
       temperature: 0.7
   });

   const content = response?.choices?.[0]?.message?.content;

   if (!content) {
        throw new Error("OpenAI returned an empty response");
   };

   try {
        return JSON.parse(content);
   } catch {
        throw new Error("OpenAI response is not valid JSON");
   }
};
