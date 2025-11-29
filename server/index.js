const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const BP_TOKEN = process.env.BP_TOKEN || '';
const BOT_ID = process.env.BOT_ID || '';

// Helper to extract text from different Botpress response shapes
function extractReply(parsed) {
  if (!parsed) return null;

  if (parsed.replies && Array.isArray(parsed.replies) && parsed.replies.length > 0) {
    return parsed.replies.map((r) => r.text || r.payload || '').join('\n');
  }

  if (parsed.output && parsed.output.generic && Array.isArray(parsed.output.generic)) {
    const texts = parsed.output.generic.map((g) => g.text).filter(Boolean);
    if (texts.length) return texts.join('\n');
  }

  if (parsed.messages && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
    return parsed.messages.map((m) => m.text || '').join('\n');
  }

  if (typeof parsed === 'string' && parsed.trim()) return parsed;

  return JSON.stringify(parsed);
}

app.post('/api/botpress/message', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'missing message' });

  // Primary endpoint (simple cloud chat)
  const endpoints = [
    { name: '/v1/chat', url: 'https://api.botpress.cloud/v1/chat', body: { message } },
    // Bot-specific converse endpoint
    { name: '/v1/bots/:botId/converse', url: `https://api.botpress.cloud/v1/bots/${BOT_ID}/converse`, body: { type: 'text', text: message } },
    // Webchat messages endpoint
    { name: '/v1/bots/:botId/mod/webchat/messages', url: `https://api.botpress.cloud/v1/bots/${BOT_ID}/mod/webchat/messages`, body: { type: 'text', text: message } },
  ];

  for (const ep of endpoints) {
    try {
      const r = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: BP_TOKEN ? `Bearer ${BP_TOKEN}` : undefined,
        },
        body: JSON.stringify(ep.body),
      });

      const raw = await r.text();
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        parsed = raw;
      }

      console.log('[Proxy] Attempt', ep.name, 'status', r.status);
      console.log('[Proxy] body', parsed);

      if (r.status === 405) {
        continue; // try next
      }

      if (!r.ok) {
        continue;
      }

      const reply = extractReply(parsed);
      return res.json({ success: true, reply, data: parsed });
    } catch (err) {
      console.warn('[Proxy] attempt error', err);
      continue;
    }
  }

  return res.status(502).json({ success: false, error: 'No endpoint returned a valid response' });
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
