const chroma = 'http://localhost:8000'
const ollama = 'http://localhost:11434'

const MiniML = 'bge-m3'

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
  ollama,
  rowsCount
}
console.log(info)






document.querySelector('#swagger').href = chroma + '/docs/';




let limit = 12;
let offset = 0;

const next = document.querySelector('#next')
next.addEventListener('click', async () => {
  offset += limit;
  if (offset > rowsCount - limit) offset = 0;

  let records = await fetch(`${chroma}/api/v2/tenants/default_tenant/databases/default_database/collections/${info.id}/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ limit, offset, include: ['documents', 'metadatas'] })
  })

  let { documents, ids, metadatas } = await records.json();
  const tbody = document.querySelector('#records')
  tbody.innerHTML = ''
  for (let i = 0; i < limit; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${metadatas[i].category}</td>
      <td>${ids[i]}</td>
      <td>${documents[i]}</td>
    `;
    tbody.appendChild(row);
  }
})

next.click();








document.querySelector('#import').addEventListener('click', async () => {

  let csv = await fetch('news.csv')
  csv = await csv.text()
  csv = csv.split('\n').map(line => line.split(','))

  csv = csv.slice(0, 5)


  let bulk = 2;
  for (let i = 0; i < csv.length; i += bulk) {

    // const [category, hot, prompt] = line
    let batch = csv.slice(i, i + bulk)
    let prompts = batch.map((line) => line[2])
    let ids = batch.map(line => line[1])
    let metadatas = batch.map(line => ({ category: line[0] }))

    
    // continue

    let vectors = await embed(prompts)

    // let vector = await fetch(`${ollama}/api/embeddings`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     model: MiniML,
    //     prompt
    //   }),
    //   headers: {
    //     'content-type': 'application/json'
    //   }
    // })
    // vector = await vector.json()
    // vector = vector.embedding

    // continue;

    // upsert on id
    let add = await fetch(`${chroma}/api/v2/tenants/default_tenant/databases/default_database/collections/${id}/add`, {
      method: 'POST',
      body: JSON.stringify({
        embeddings: vectors,
        documents: prompts,
        ids,
        metadatas
      }),
      headers: {
        'content-type': 'application/json'
      }
    })

    // add = await add.json()  // {}

    batch.forEach(line => {
      console.log(...line);
    });

  }

  console.log(csv.length + ' records upserted')
})


const input = document.querySelector('#search');
input.addEventListener('change', async () => {
  const prompt = input.value;

  let vector = await fetch(`${ollama}/api/embeddings`, {
    method: 'POST',
    body: JSON.stringify({
      model: MiniML,
      prompt
    }),
    headers: {
      'content-type': 'application/json'
    }
  })

  vector = await vector.json()
  vector = vector.embedding

  let results = await fetch(`${chroma}/api/v2/tenants/default_tenant/databases/default_database/collections/${id}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query_embeddings: [vector], n_results: 5, include: ['documents', 'metadatas', 'uris', 'distances'] })
  })

  const { documents, ids, metadatas } = await results.json();
  const tbody = document.querySelector('#records')
  tbody.innerHTML = ''
  for (let i = 0; i < documents.length; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${metadatas[i].category}</td>
      <td>${ids[i]}</td>
      <td>${documents[i]}</td>
    `;
    tbody.appendChild(row);
  }
})


async function embed(input) {
  let vector = await fetch(`${ollama}/api/embed`, {
    method: 'POST',
    body: JSON.stringify({
      model: MiniML,
      // input: text or list of text to generate embeddings for
      input
    }),
    headers: {
      'content-type': 'application/json'
    }
  })

  vector = await vector.json()
  return vector.embeddings;

}


// console.log(111, await embed("你好吗？"))