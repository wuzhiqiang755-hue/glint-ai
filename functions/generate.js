export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "仅支持 POST 请求" });
  }

  const { keywords, style } = req.body;

  // --- 这里的地址直接写死，彻底解决环境变量拼接出错的问题 ---
  const apiUrl = "https://api.ohmygpt.com/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 这里依然读取环境变量里的 Key，确保安全性
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `你是一个极具高级感的社交媒体配文助手。请根据关键词提供一段符合${style}风格的文案，要求简短、有力、富有格调，并配上合适的 Emoji。` 
          },
          { 
            role: "user", 
            content: keywords 
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.status(200).json({ text: data.choices[0].message.content });
    } else {
      console.error('API 返回异常:', data);
      res.status(500).json({ text: "能量传输失败，请检查 Key 是否有效" });
    }
  } catch (error) {
    console.error('后端错误:', error);
    res.status(500).json({ text: "信号丢失，请稍后再试" });
  }
}
