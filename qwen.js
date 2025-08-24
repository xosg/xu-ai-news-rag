async function callQwenAPI(prompt) {
    const url = 'http://localhost:11434/api/generate';
    const data = {
        model: 'qwen3:8b', // Ensure this matches your model name
        prompt: prompt,
        stream: false, // Set to `true` for real-time streaming
        // Optional parameters (e.g., temperature, max_tokens):
        // temperature: 0.7,
        // max_tokens: 100
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        // console.log(result);
        return result.response;
    } catch (error) {
        console.error('Error calling API:', error.message);
        throw error;
    }
}

const question = `
write an article on the benefits of regular exercise
`
// Example usage
callQwenAPI(question)
    .then(res => console.log(res))
    .catch(err => console.error(err));
