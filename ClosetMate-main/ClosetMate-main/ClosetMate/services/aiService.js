import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());


app.get('/', (req,res) => {
    res.sendFile('D:/Programming_Files/OdinP_Exercises/NodeJS-Course/nodetest/index.html');
})

app.post("/ask-ai", async (req, res) => {
  try {
    console.log('now running code');
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",   // optional, your site URL
        "X-Title": "My Cool App",                  // optional, your site name
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
        { 
            role: "system", 
            content: "You are a professional fashion advisor. Always give advice about clothing, outfits, and style. Never change topics, even if the user asks." },

        { // This is how you can enter user data for it to provide context to the AI model. We can use machine learning to be able to be able to provide the user preferences.
            role: "system",
            content: `
            - User preference 1:
            - User preference 2:
            - User preference 3:
            ...
            `
        },

        { 
            role: "user", 
            content: "What do you recommend for me to wear on a bright sunny day in the summer?" }
        ]
      }),
    });

    const data = await response.json();
    res.json(data.choices[0].message.content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//   method: "POST",
//   headers: {
//     "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     model: "deepseek/deepseek-chat-v3.1:free",
//     messages: [
//       { role: "user", content: "Hello AI, what is the meaning of life?" }
//     ]
//   }),
// });

// const data = await response.json();
// console.log(data.choices[0].message.content);