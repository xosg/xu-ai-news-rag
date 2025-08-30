const chroma = 'http://localhost:8000'
const ollama = 'http://localhost:11434'

const MiniML = 'bge-m3'
const LLM = 'qwen3:8b'

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
  rowsCount,
  MiniML,
  LLM
}
console.log(info)

localStorage.setItem('info', JSON.stringify(info))



let limit = 13;
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
    const type = metadatas[i].category
    let title = documents[i]
    title = `<a href="./LLM.html#${title}">${title}</a>`
    row.innerHTML = `
      <td><a href="./semantic.html#${type}">${type}</a></td>
      <td>${~~(Math.random() * 999999) + 999}</td>
      <td>${title}</td>
    `;
    tbody.appendChild(row);
  }
})

next.click();






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



