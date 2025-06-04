from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session
from app.services.llm_service import LLMService
from app.services.rag_service import RAGService
from app.models.chat_history import ChatHistory
from app.models.user import User
from app.auth import get_current_user
from database import get_db
from pydantic import BaseModel

# Initialize services
llm_service = LLMService(model_name="gemma3:4b", ollama_url="http://localhost:11434")
rag_service = RAGService(documents_path="data/faq_documents.txt", collection_name="faq_collection")

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str
    use_rag: bool = False

@router.post("/ask/")
async def ask_question(
    question_data: QuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint to handle user questions.
    """
    try:
        # Save the user's question to the database
        user_message = ChatHistory(
            user_id=current_user.id,
            message=question_data.question,
            sender="user"
        )
        db.add(user_message)
        db.commit()

        # Retrieve context using RAG if enabled
        context = ""
        if question_data.use_rag:
            context = rag_service.retrieve_context(question_data.question)
            if not context:
                bot_response = "I couldn't find any relevant information to answer your question."
                bot_message = ChatHistory(
                    user_id=current_user.id,
                    message=bot_response,
                    sender="bot"
                )
                db.add(bot_message)
                db.commit()
                return {"answer": bot_response}

        # Combine context with the question
        full_prompt = f"Context: {context}\nQuestion: {question_data.question}" if context else question_data.question

        # Generate a response using the LLM
        response = llm_service.generate_response(full_prompt)

        bot_response = response if response else "Sorry, I couldn't generate a response."

        # Save the bot's response to the database
        bot_message = ChatHistory(
            user_id=current_user.id,
            message=bot_response,
            sender="bot"
        )
        db.add(bot_message)
        db.commit()

        return {"answer": bot_response}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/history/")
async def get_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).order_by(ChatHistory.timestamp.asc()).all()
    return [{"sender": msg.sender, "message": msg.message} for msg in history]