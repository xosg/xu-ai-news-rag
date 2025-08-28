// test-chinese.js
const OLLAMA_HOST = 'http://localhost:11434';

async function getEmbedding(text) {
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // model: 'nomic-embed-text',
                model: 'bge-m3',
                prompt: text
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.embedding;
    } catch (error) {
        console.error('Error getting embedding:', error.message);
        throw error;
    }
}

function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magA * magB);
}

async function testMultilingualSimilarity() {
    try {


        // Test cases - same meaning in different languages
        const similarPairs = [
            {
                a: "The cat sat on the mat",
                b: "that kitty is sitting on a carpet",
            },
            {
                a: "The weather is very nice today",
                b: "oh, the sky today is quite good",
            }, {
                a: '你好，很高兴认识你',
                b: '您好！能够结识您我非常开心'
            }, {
                a: '今天天气不错',
                b: '现在的天气情况很好'
            }, {
                a: 'where are you coming from?',
                b: '你来自哪里？'
            }, {
                a: '我来自中国。',
                b: 'I come from China.'
            }

        ];

        // Test different meanings
        const differentMeaning = [{
            a: "The cat sat on the mat",
            b: "how are you today? i'm fine thanks",
        }, {
            a: '你在说什么，我听不懂',
            b: '今天天气很差'
        }, {
            a: '我来自新加坡。',
            b: 'what is your name?'
        }];

        console.log(`\nTesting similar meanings: \n`);

        for (const pair of similarPairs) {
            console.log(`   A: "${pair.a}"`);
            console.log(`   B: "${pair.b}"`);

            const embeddingA = await getEmbedding(pair.a);
            const embeddingB = await getEmbedding(pair.b);

            const similarity = cosineSimilarity(embeddingA, embeddingB);
            console.log(`   Similarity: ${similarity.toFixed(4)}\n\n`);
        }

        // Test different meanings
        console.log(`Testing different meanings: \n`);
        for (const pair of differentMeaning) {
            console.log(`   A: "${pair.a}"`);
            console.log(`   B: "${pair.b}"`);

            const embeddingA = await getEmbedding(pair.a);
            const embeddingB = await getEmbedding(pair.b);

            const similarity = cosineSimilarity(embeddingA, embeddingB);
            console.log(`   Similarity: ${similarity.toFixed(4)}\n\n`);
        }


    } catch (error) {
        console.error('Error in test:', error.message);
    }
}

// Run the test
testMultilingualSimilarity();

// getEmbedding("hello world").then(r => {
//     console.log(r)
// })