// Minimal ChromaDB client for Node.js (HTTP API)
// See: https://docs.trychroma.com/reference/rest

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';

export async function addEmbedding(collection, id, embedding, metadata = {}) {
  const res = await fetch(`${CHROMA_URL}/api/v1/collections/${collection}/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: [id],
      embeddings: [embedding],
      metadatas: [metadata],
    })
  });
  return res.json();
}

export async function queryEmbedding(collection, embedding, topK = 5) {
  const res = await fetch(`${CHROMA_URL}/api/v1/collections/${collection}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queries: [embedding],
      n_results: topK
    })
  });
  return res.json();
}

export async function createCollection(name) {
  const res = await fetch(`${CHROMA_URL}/api/v1/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
}
