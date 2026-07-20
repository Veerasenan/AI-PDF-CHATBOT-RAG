from langchain_core.prompts import PromptTemplate

RAG_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are a helpful AI assistant. Answer the question using ONLY the provided context.
If the answer is not in the context, clearly say: "I don't have enough information in the uploaded document to answer this."

Context:
{context}

Question: {question}

Answer:"""
)