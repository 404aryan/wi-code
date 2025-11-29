import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Replace these with your Botpress details
const BOTPRESS_BOT_ID = "YOUR_BOT_ID_HERE";
const BOTPRESS_CLIENT_TOKEN = "YOUR_CLIENT_TOKEN_HERE";

let conversationId = null;

// ⭐ Generate a new conversation when server starts
async function createConversation() {
  const res = await fetch(`https://api.botpress.cloud/v1/chat/conversations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${BOTPRESS_CLIENT_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  conversationId = data.id;
  console.log("Conversation Created:", conversationId);
}
createConversation();

// ⭐ Proxy Endpoint (Frontend calls this)
app.post("/api/botpress/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const bpRes = await fetch(`https://api.botpress.cloud/v1/chat/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BOTPRESS_CLIENT_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        conversationId,
        message: {
          type: "text",
          text: userMessage
        }
      })
    });

    const data = await bpRes.json();
    const reply = data.responses?.[0]?.text || "I could not understand";

    return res.json({ reply });

  } catch (err) {
    console.error("Botpress Error:", err);
    return res.status(500).json({ reply: "I could not understand" });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
