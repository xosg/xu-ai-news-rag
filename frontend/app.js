const chroma = 'http://localhost:8000'
const ollama = 'http://localhost:11434'

// upsert a collection
// Expected a name containing 3-512 characters from [a-zA-Z0-9._-], starting and ending with a character in [a-zA-Z0-9].
let collection = await fetch(`${chroma}/api/v2/tenants/default_tenant/databases/default_database/collections`, {
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

collection = await collection.json()

const { id, name, database } = collection

// console.log(collection)




let identity = await fetch(`${chroma}/api/v2/auth/identity`)
identity = await identity.json();
const { user_id, tenant, databases } = identity;

let health = await fetch(`${chroma}/api/v2/healthcheck`)
health = await health.json()


let heart = await fetch(`${chroma}/api/v2/heartbeat`)
heart = await heart.json()


let preflight = await fetch(`${chroma}/api/v2/pre-flight-checks`)
preflight = await preflight.json()

let version = await fetch(`${chroma}/api/v2/version`)
version = await version.json()





let rowsCount = await fetch(`${chroma}/api/v2/tenants/default_tenant/databases/default_database/collections/${id}/count`,)
rowsCount = await rowsCount.json()


const info = {
  ...identity,
  ...health,
  ...heart,
  ...preflight,
  version,
  ...collection,
  chroma,
  rowsCount
}
console.log(info)






document.querySelector('#swagger').href = chroma + '/docs/';


// let records = await fetch(`${info.chroma}/api/v2/tenants/${info.tenant}/databases/${info.database}/collections/${info.id}/get`, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({ limit: 10, offset: 0, include: ['documents', 'metadatas'] })
// })

// records = await records.json();

// console.log(records);


document.querySelector('#import').addEventListener('click', async () => {

  let csv = await fetch('news.csv')
  csv = await csv.text()
  csv = csv.split('\n').map(line => line.split(','))

  // csv = csv.slice(0, 5)


  for (let line of csv) {

    const [category, hot, prompt] = line

    let vector = await fetch(`${ollama}/api/embeddings`, {
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

  console.log(csv.length + ' records upserted')
})
