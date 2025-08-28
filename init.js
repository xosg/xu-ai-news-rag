const chroma = 'http://localhost:8000'

async function run() {
    let identity = await fetch(`${chroma}/api/v2/auth/identity`)
    identity = await identity.json();
    const { user_id, tenant, databases } = identity;

    // let health = await fetch(`${chroma}/api/v2/healthcheck`)
    // health = await health.json()


    // let heart = await fetch(`${chroma}/api/v2/heartbeat`)
    // heart = await heart.json()


    // let preflight = await fetch(`${chroma}/api/v2/pre-flight-checks`)
    // preflight = await preflight.json()

    // let version = await fetch(`${chroma}/api/v2/version`)
    // version = await version.json()


    // const info = { ...identity, ...health, ...heart, ...preflight, version }
    // console.log(info)




    // delete all collections
    // no slash "/" at the end

    // let collections = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${databases[0]}/collections`)
    // collections = await collections.json()
    // for (let coll of collections) {
    //     // shit here should use name instead of id
    //     let delet = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${coll.database}/collections/${coll.name}`, {
    //         method: 'DELETE'
    //     })
    //     if (delet.ok) console.log(coll.name, 'deleted')
    //     // delet = await delet.json()
    // }




    // Expected a name containing 3-512 characters from [a-zA-Z0-9._-], starting and ending with a character in [a-zA-Z0-9].
    let initCollection = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${databases[0]}/collections`, {
        method: 'POST',
        body: JSON.stringify({
            "configuration": null,
            // upsert
            "get_or_create": true,
            "metadata": null,
            "name": "x.lab"
        }),
        headers: {
            'content-type': 'application/json'
        }
    })

    initCollection = await initCollection.json()

    const { id, name, database } = initCollection

    console.log(initCollection)


    let count = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${database}/collections/${id}/count`,)
    count = await count.json()
    console.log('number of records:', count)

    // return;

    if (count < 200) {
        const fs = require('fs').promises
        let csv = await fs.readFile('./news.csv', 'utf8')
        csv = csv.split('\n').map(line => line.split(','))
        // csv = csv.slice(0, 1)


        // return

        for (let line of csv) {

            const [category, hot, prompt] = line

            let vector = await fetch(`http://localhost:11434/api/embeddings`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'bge-m3',
                    prompt
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })

            vector = await vector.json()
            vector = vector.embedding

            // upsert on id
            let add = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${database}/collections/${id}/add`, {
                method: 'POST',
                body: JSON.stringify({
                    embeddings: [vector],
                    documents: [prompt],
                    ids: [hot],
                    metadatas: [{ category }]
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })

            // add = await add.json()  // {}

            console.log(category, +hot, prompt,)

        }
    }
}




run()
