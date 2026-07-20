#  AI PDF Chatbot (RAG)

An AI-powered PDF Question Answering application built using **FastAPI**, **React**, **LangChain**, **Google Gemini**, and **ChromaDB**.

Upload any PDF and ask questions in natural language. The application retrieves the most relevant content from the uploaded document using Retrieval-Augmented Generation (RAG) and generates accurate answers using Google's Gemini Large Language Model.

---

#  Features

- Upload PDF documents
- Automatic PDF parsing
- Intelligent document chunking
- Google Gemini Embeddings
- ChromaDB Vector Database
- Semantic Similarity Search
- Retrieval-Augmented Generation (RAG)
- Google Gemini LLM for answer generation
- Source citation support
- Clean React Chat Interface
- Copy response feature
- Drag & Drop PDF Upload
- Upload progress indicator
- Toast notifications
- Responsive UI
- Strict RAG implementation (No hallucination)

---

#  Demo

## Upload PDF

- Drag & Drop PDF
- Upload Progress
- Document Processing

## Ask Questions

Example Questions

- What is JWT?
- Explain Django Middleware.
- What is ORM?
- Explain Python Decorators.
- Summarize this document.

---

#  Tech Stack

## Frontend

- React (Vite)
- Axios
- React Toastify
- React Icons
- CSS3

## Backend

- FastAPI
- LangChain
- Google Gemini
- ChromaDB
- PyPDF
- Python

## AI Components

- Gemini Flash Model
- Gemini Embeddings
- Chroma Vector Store
- LangChain Retriever

---

#  Project Structure

```
AI-PDF-CHATBOT-RAG/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── config/
│   │   ├── core/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── data/
│   │   ├── uploaded_pdfs/
│   │   └── chroma_db/
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore

```

---

#  Architecture

```

React Frontend
│
▼
FastAPI Backend
│
▼
PDF Upload API
│
▼
PyPDF Loader
│
▼
Text Splitter
│
▼
Gemini Embeddings
│
▼
ChromaDB
│
▼
Retriever
│
▼
Gemini LLM
│
▼
Answer

#  Complete RAG Workflow

The application follows the Retrieval-Augmented Generation (RAG) architecture.

```
                Upload PDF
                    │
                    ▼
          Read PDF using PyPDF
                    │
                    ▼
      Split into Smaller Chunks
                    │
                    ▼
     Generate Gemini Embeddings
                    │
                    ▼
      Store in Chroma Vector DB
                    │
                    ▼
────────────────────────────────────
        User asks a Question
────────────────────────────────────
                    │
                    ▼
      Convert Question to Embedding
                    │
                    ▼
      Similarity Search in ChromaDB
                    │
                    ▼
Retrieve Top K Relevant Chunks
                    │
                    ▼
      Prompt Template Creation
                    │
                    ▼
         Google Gemini LLM
                    │
                    ▼
        Final Answer + Sources
```

---

#  How the Backend Works

The backend is developed using **FastAPI** and follows a modular architecture.

### Step 1 – Upload PDF

The frontend uploads a PDF using the `/api/upload/` endpoint.

The backend:

- Receives the PDF
- Saves it locally
- Reads the PDF pages
- Extracts text

---

### Step 2 – Chunking

The extracted text is split into smaller chunks using LangChain's Recursive Character Text Splitter.

Example

```
Chunk 1
Chunk 2
Chunk 3
Chunk 4
...
```

Chunking improves retrieval accuracy and reduces token usage.

---

### Step 3 – Embedding Generation

Each chunk is converted into a numerical vector using **Google Gemini Embeddings**.

```
Chunk

↓

Embedding

↓

[0.183,
0.652,
0.214,
...]
```

These vectors represent the semantic meaning of the text.

---

### Step 4 – Vector Storage

The generated embeddings are stored inside **ChromaDB**.

```
Chunk

↓

Embedding

↓

Metadata

↓

Stored in ChromaDB
```

Metadata includes:

- PDF filename
- Source
- Chunk index

---

### Step 5 – User Question

When the user asks a question:

```
What is JWT?
```

The question is also converted into an embedding.

---

### Step 6 – Similarity Search

The question embedding is compared with all document embeddings.

The most similar chunks are retrieved.

Example

```
Question

↓

Embedding

↓

Vector Search

↓

Top 5 Relevant Chunks
```

---

### Step 7 – Prompt Engineering

A custom prompt is created.

Example

```
Context:

<Retrieved Chunks>

Question:

What is JWT?

Instructions:

Answer ONLY from the provided context.
If the answer is unavailable, reply that
the information is not present in the document.
```

---

### Step 8 – Gemini Response

The prompt is sent to Google's Gemini model.

Gemini generates an answer using only the retrieved context.

This minimizes hallucinations and keeps responses grounded in the uploaded document.

---

#  Frontend Workflow

The frontend is built using **React + Vite**.

Workflow:

```
Upload PDF

↓

Progress Indicator

↓

Backend Processing

↓

Ask Question

↓

API Request

↓

Display Answer

↓

Display Source

↓

Copy Response
```

---

#  API Endpoints

## Upload PDF

```
POST /api/upload/
```

### Request

```
multipart/form-data

file: interview.pdf
```

### Response

```json
{
  "message": "PDF uploaded successfully",
  "chunks": 125
}
```

---

## Chat Endpoint

```
POST /api/chat/
```

### Request

```json
{
    "question": "Explain JWT"
}
```

### Response

```json
{
    "answer": "JWT is a token...",
    "sources": [
        "uploaded_pdfs/interview.pdf"
    ]
}
```

---

#  ChromaDB Storage

The vector database stores:

- Text Chunk
- Embedding Vector
- Source File
- Metadata

Example

```
Chunk

↓

Embedding

↓

Metadata

↓

Stored in ChromaDB
```

This allows extremely fast semantic search without reading the PDF every time.

---

#  Strict RAG Implementation

This project follows a **Strict Retrieval-Augmented Generation (Strict RAG)** approach.

The LLM answers **only from the uploaded document**.

If the answer is not present inside the PDF, it responds with:

> "I don't have enough information in the uploaded document to answer this."

This prevents hallucinations and ensures trustworthy responses.

#  Installation

## 1. Clone Repository

```bash
git clone https://github.com/Veerasenan/AI-PDF-CHATBOT-RAG.git

cd AI-PDF-CHATBOT-RAG
```

---

#  Backend Setup

Navigate to backend

```bash
cd backend
```

Create Virtual Environment

Windows

```bash
python -m venv env
```

Activate

Command Prompt

```bash
env\Scripts\activate
```

PowerShell

```powershell
.\env\Scripts\Activate.ps1
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

#  Frontend Setup

Open another terminal

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run React

```bash
npm run dev
```

Default URL

```
http://localhost:5173
```

---

#  Environment Variables

Create a `.env` file inside the `backend` folder.

Example

```env
GOOGLE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY

MODEL_NAME=gemini-flash-latest

EMBEDDING_MODEL=gemini-embedding-001
```

---

#  Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

Swagger UI

```
http://127.0.0.1:8000/docs
```

ReDoc

```
http://127.0.0.1:8000/redoc
```

---



#  Future Enhancements

The current implementation follows a **Strict RAG** architecture.

Possible future improvements include:

- Conversation Memory
- Multi-PDF Support
- Hybrid Search (Semantic + Keyword)
- Reranking Models
- LangSmith Tracing
- RAGAS Evaluation
- Streaming Responses
- Citation Highlighting
- OCR Support for Scanned PDFs
- User Authentication
- Chat History Persistence
- Docker Deployment
- Kubernetes Deployment
- CI/CD Pipeline
- AWS / Azure / GCP Deployment
- Role-Based Access Control
- Multi-user Workspace
- PDF Summarization
- Document Comparison
- Voice-based Question Answering

---

#  Key AI Concepts Demonstrated

This project demonstrates practical implementation of modern Generative AI concepts including:

- Large Language Models (LLMs)
- Retrieval-Augmented Generation (RAG)
- Vector Embeddings
- Semantic Search
- Vector Databases
- Document Chunking
- Prompt Engineering
- Context Retrieval
- Hallucination Prevention
- Source Grounding
- FastAPI Backend Development
- React Frontend Development
- ChromaDB Integration
- Google Gemini API Integration
- LangChain Framework

---

#  Learning Outcomes

This project helped in understanding:

- Building enterprise-level RAG applications
- Working with LangChain
- Integrating Google Gemini APIs
- Vector database implementation
- Prompt engineering best practices
- FastAPI REST API development
- React frontend integration
- End-to-end AI application architecture

---

#  Author

**Veerasenan**

Python Developer | Django | FastAPI | Generative AI | LangChain | RAG | React

GitHub

```
https://github.com/Veerasenan
```

LinkedIn

```
https://www.linkedin.com/in/YOUR-LINKEDIN
```

---

#  If you found this project useful

Please consider giving it a ⭐ on GitHub.

---

#  License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 Veerasenan

Permission is hereby granted, free of charge,
to any person obtaining a copy of this software...
```

(You can include the full MIT license text in a separate `LICENSE` file.)

---

#  Acknowledgements

This project was built using:

- FastAPI
- LangChain
- Google Gemini
- ChromaDB
- React
- Vite
- Python
- PyPDF
- Google Generative AI