# Outline Design Document

## System Architecture
- Frontend: Native JS, interacts with backend via REST API
- Backend: Node.js, integrates MongoDB, FAISS, LangChain, LLM API
- Database: MongoDB (metadata), FAISS (vectors)

## Main Modules
- News Crawler
- Knowledge Base API
- User Auth (JWT)
- Email Notification
- Semantic Search
- Admin/Content Management

## Data Flow
1. Crawl news → 2. Store in DB/FAISS → 3. User search/login → 4. LLM/semantic search → 5. Results/notifications
