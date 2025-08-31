window.chroma = 'http://localhost:8000'
window.ollama = 'http://localhost:11434'

window.MiniML = 'bge-m3'
window.LLM = 'qwen3:8b'


// 文本转向量
window.embed = async function (input) {
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





// get_or_create a collection
// Expected a name containing 3-512 characters from [a-zA-Z0-9._-], starting and ending with a character in [a-zA-Z0-9].
let collection = await fetch(`${chroma}/api/v2/tenants/default_tenant/databases/default_database/collections`, {
    method: 'POST',
    body: JSON.stringify({
        "configuration": null,
        // 
        "get_or_create": true,
        "metadata": null,
        "name": "x.lab"
    }),
    headers: {
        'content-type': 'application/json'
    }
}).catch(err => {
    alert('Chroma请求失败 ' + err.message)
    console.error(err)
})

// if (!collection.ok) return;

window.coll = await collection.json()

// const { id, name, database } = collection

let rowsCount = await fetch(`${chroma}/api/v2/tenants/default_tenant/databases/default_database/collections/${coll.id}/count`,)
coll.rowsCount = await rowsCount.json()

if (coll.rowsCount === 0) {
    if (location.pathname.includes('admin.html')) {

    } else {
        alert('检测到数据表为空，正在引导您嵌入数据库。')
        open('admin.html','_self')
    }
}

