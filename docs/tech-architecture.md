# Technical Architecture

## Stack
- Frontend: HTML, CSS, JS
- Backend: Node.js (native HTTP)
- DB: MongoDB (metadata), Chroma (vectors)
- LLM: Ollama/qwen3:8b via API
- Embedding: all-MiniLM-L6-v2
- Reranking: ms-marco-MiniLM-L-6-v2

## Integration
- LangChain for knowledge base/retrieval
- JWT for authentication
- Nodemailer for email

## Diagram
```
[User] ⇄ [Frontend] ⇄ [Backend API] ⇄ [MongoDB | FAISS | LLM API]
```
