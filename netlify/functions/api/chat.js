const axios = require("axios");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "শুধুমাত্র POST অনুরোধ অনুমোদিত।" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    // Call DeepSeek API
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a Bengali mental health counselor. Respond in Bangla.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: response.data.choices[0].message.content,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "সার্ভার ত্রুটি। পরে চেষ্টা করুন।" }),
    };
  }
};
