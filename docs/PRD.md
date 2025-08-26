# Product Requirement Document (PRD)

## Project: News-AI-RAG

### Overview
A personalized news intelligent knowledge base system with news crawling, semantic search, LLM integration, and user/content management.

### Functional Requirements
- Timed news crawling (RSS, web, proxy)
- Local knowledge base (FAISS, MongoDB)
- LLM integration (Ollama/qwen3:8b)
- User login (JWT)
- Email notifications
- Knowledge base management (CRUD, upload, metadata)
- Semantic search & online fallback
- Data cluster analysis report

### Non-Functional Requirements
- Minimal 3rd party libraries
- Security (JWT, safe crawling)
- Scalability
- Usability (simple UI)
