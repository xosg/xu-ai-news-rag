# News-AI-RAG Backend

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your config.
3. Start MongoDB locally.
4. Run the backend:
   ```
   npm start
   ```

## API
- `POST /api/login` — User login (returns JWT)
- `GET /api/ping` — Health check

## Next Steps
- Add endpoints for news crawling, knowledge base, semantic search, email, etc.
