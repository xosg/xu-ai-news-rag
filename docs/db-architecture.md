# Database Architecture

## Overview
- MongoDB: Stores metadata (user, file info, tags, etc.)
- Chroma: Stores vector embeddings for semantic search

## MongoDB Collections
- users: { _id, username, password_hash, email, created_at }
- files: { _id, user_id, filename, type, tags, source, created_at, metadata }
- logs: { _id, action, user_id, timestamp, details }

## Chroma
- Stores vector representations of documents/content for fast similarity search.

## Diagram
```
[users]---< [files ] >---[Chroma vectors]
         |
      [logs]
```
