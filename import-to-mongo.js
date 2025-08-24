const { MongoClient } = require('mongodb');
const fs = require('fs').promises;

const uri = 'mongodb://localhost:27017'; // Update with your MongoDB URI if needed
const dbName = 'acronym'; // Replace with your database name
const collectionName = 'acronym'; // Replace with your collection name

async function run() {
    const client = new MongoClient(uri);

    try {

        let csv = await fs.readFile('./abbreviation/G.csv', 'utf-8')
        let lines = csv.split('\n')
            .map(a => ({ _id: a.slice(0, 3), name: a.slice(4).trim() }))
            .filter(line => line.name !== '');

        // lines = lines.slice(0, 20);
        // console.log(lines);
        // return;
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const bulkOps = lines.map(doc => ({
            updateOne: {
                filter: { _id: doc._id },
                update: { $set: { name: doc.name } },
                upsert: true
            }
        }));
        const Result = await collection.bulkWrite(bulkOps);
        console.log(Result);

        // empty
        // let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        // const docs =
        //     Array.from({ length: 26 ** 3 }).map((a, i) => {
        //         const firstLetter = letters[Math.floor(i / 26 ** 2)];
        //         const secondLetter = letters[Math.floor(i / 26) % 26];
        //         const thirdLetter = letters[i % 26];
        //         return {
        //             _id: firstLetter + secondLetter + thirdLetter,
        //             name: ''
        //         }
        //     })
        // const insertManyResult = await collection.insertMany(docs);
        // console.log(`Inserted ${insertManyResult.insertedCount} documents`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

run();