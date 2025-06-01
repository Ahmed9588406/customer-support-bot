from fastapi import APIRouter,HTTPException
from app.services.llm_service import LLMService
from app.services.rag_service import RAGService

# Initialize services
llm_service = LLMService(model_name="gemma3:4b", ollama_url="http://localhost:11434")
rag_service = RAGService(documents_path="data/faq_documents.txt", collection_name="faq_collection")

router = APIRouter()

@router.post("/ask/")
async def ask_question(question_data: dict):
    """
    Endpoint to handle user questions.
    :param question_data: A dictionary containing 'question' and optionally 'use_rag'.
    :return: The LLM's response.
    """
    # Extract inputs
    question = question_data.get("question")
    use_rag = question_data.get("use_rag", False)  # Default to False if not provided

    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    try:
        # Retrieve context using RAG if enabled
        context = ""
        if use_rag:
            context = rag_service.retrieve_context(question)
            if not context:
                return {"answer": "I couldn't find any relevant information to answer your question."}

        # Combine context with the question
        full_prompt = f"Context: {context}\nQuestion: {question}" if context else question

        # Generate a response u))sing the LLM
        response = llm_service.generate_response(full_prompt)

        if not response:
            return {"answer": "Sorry, I couldn't generate a response."}

        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
