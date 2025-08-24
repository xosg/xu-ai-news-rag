// sample, not uploaded
const key = 'sk-134d0dcf191549dfb3fcf401cf778d26'
async function callDeepSeekAPI() {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    console.log(data.choices[0].message.content);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
callDeepSeekAPI();