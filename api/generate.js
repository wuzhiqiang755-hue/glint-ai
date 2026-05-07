
export default async function handler(req, res) {
  const { keywords, style } = req.body;

  // 这里统一使用 BASE_URL，请确保 Vercel 变量名也是这个
  const apiUrl = process.env.BASE_URL || process.env.API_BASE_URL;

  try {
    const response = await fetch(`${apiUrl}/v1/chat/completions`, {
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
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ text: data.choices[0].message.content });
    } else {
      console.error('API Error:', data);
      res.status(500).json({ text: "生成失败，请检查余额或配置" });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ text: "能量传输失败，请稍后再试" });
  }
}
