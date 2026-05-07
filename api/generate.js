export default async function handler(req, res) {
  const { keywords, style } = req.body;

  const response = await fetch(`${process.env.API_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `你是一个极简高级感的社交媒体配文助手。请根据关键词提供一段符合${style}风格的文案，要求简短、有力、富有格调，并配上合适的 Emoji。` },
        { role: "user", content: keywords }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ text: data.choices[0].message.content });
}
