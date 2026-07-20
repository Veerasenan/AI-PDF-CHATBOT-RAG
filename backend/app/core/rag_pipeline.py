from app.core.vector_store import get_vector_store
from app.core.llm import get_llm
from app.config.prompt import RAG_PROMPT
from app.utils.logger import setup_logger

logger = setup_logger()


def rag_pipeline(question: str, document_ids=None):
    try:
        vector_store = get_vector_store()

        retriever = vector_store.as_retriever(
            search_kwargs={"k": 5}
        )

        llm = get_llm()

        # Retrieve relevant documents
        docs = retriever.invoke(question)

        context = "\n\n".join(
            doc.page_content for doc in docs
        )

        prompt = RAG_PROMPT.format(
            context=context,
            question=question
        )

        # Generate answer
        response = llm.invoke(prompt)

        # DEBUG
        print("=" * 80)
        print("Response Type:", type(response))
        print("Content Type:", type(response.content))
        print("Response Content:", response.content)
        print("=" * 80)

        # -----------------------------
        # Convert Gemini response to string
        # -----------------------------
        answer = ""

        # Case 1: Gemini exposes .text
        if hasattr(response, "text") and response.text:
            answer = response.text

        # Case 2: OpenAI / older models
        elif isinstance(response.content, str):
            answer = response.content

        # Case 3: Gemini returns list
        elif isinstance(response.content, list):
            texts = []

            for item in response.content:

                if isinstance(item, dict):
                    texts.append(item.get("text", ""))

                elif hasattr(item, "text"):
                    texts.append(item.text)

                else:
                    texts.append(str(item))

            answer = "\n".join(texts)

        else:
            answer = str(response.content)

        sources = list({
            doc.metadata.get("source", "Unknown")
            for doc in docs
        })

        logger.info(f"Answered question: {question}")

        return {
            "answer": answer,
            "sources": sources
        }

    except Exception as e:
        logger.exception("RAG Pipeline Error")

        return {
            "answer": f"Error: {str(e)}",
            "sources": []
        }