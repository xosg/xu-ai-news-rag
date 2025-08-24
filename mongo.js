



async function askDict(_id) {
    const response =
        await fetch(`https://www.abbreviations.com/${_id}`)
            .catch(err => err)
    if (!response.ok) {
        throw 'network error';
    }
    let data = await response.text()
    // data = data.slice(0, 1000)
    // console.log(data);
    let match = data.match(/&#039;(.*?)&#039;/);
    if (!match) {
        throw ('Not Found by RegExp');
    }
    match = match[1];

    return match

}


async function askAI(_id) {
    const prompt = `What does ${_id} stands for? Return a most matching answer for me (only returning a single full name of it without other words). If you really can't find at least one phrase for it, then guess a semantic one based on the acronym.`;

    const url = 'http://localhost:11434/api/generate';
    const data = {
        model: 'qwen3:8b', // Ensure this matches your model name
        prompt,
        stream: false, // Set to `true` for real-time streaming
        // Optional parameters (e.g., temperature, max_tokens):
        // temperature: 0.7,
        // max_tokens: 100
    };

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

    let result = (await response.json()).response;
    result = result.slice(result.lastIndexOf('\n') + 1).trim();
    if (result.length > 100) throw result;

    console.log(1111, `--------- By AI: ---------`, 1111);
    return result;

}



async function run() {
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb://localhost:27017';
    const dbName = 'acronym'; // Replace with your database name
    const collectionName = 'acronym';

    const client = new MongoClient(uri);


    await client.connect();
    console.log('Connected to ' + uri);

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const results = await collection.find({ name: '' })
        // .skip(900)
        .limit(10).toArray();

    console.log(results);

    for (let { _id } of results) {
        const phrase = await askDict(_id).catch(err => {
            return askAI(_id);
        });

        const { matchedCount, modifiedCount } =
            await collection.updateOne({ _id }, { $set: { name: phrase } });

        if (modifiedCount === 1)
            console.log(_id, '--', phrase);
        else
            console.log(0, `Failed to update ${_id}`, 0);
        // lengthen the interval between requests to avoid being blocked
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    }

    await client.close();

}

run().catch(err => console.error(99999999, err));

// askDict('IFM').then(console.log);