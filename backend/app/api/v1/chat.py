import uuid
from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session
from sqlalchemy import desc, func, and_
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

@router.options("/{path:path}")
async def options_handler():
    return {"detail": "OK"}

class QuestionRequest(BaseModel):
    question: str
    use_rag: bool = False
    conversation_id: str = None

@router.post("/ask/")
async def ask_question(
    question_data: QuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        if not question_data.question or not question_data.question.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Question cannot be empty"
            )

        # Use existing conversation ID or create new one
        conversation_id = question_data.conversation_id or str(uuid.uuid4())

        # Save the user's question to the database
        user_message = ChatHistory(
            user_id=current_user.id,
            message=question_data.question,
            sender="user",
            conversation_id=conversation_id
        )
        db.add(user_message)
        db.commit()

        # Retrieve context using RAG if enabled
        context = ""
        if question_data.use_rag:  # Access directly from Pydantic model
            context = rag_service.retrieve_context(question_data.question)
            if not context:
                bot_response = "I couldn't find any relevant information to answer your question."
                bot_message = ChatHistory(
                    user_id=current_user.id,
                    message=bot_response,
                    sender="bot",
                    conversation_id=conversation_id
                )
                db.add(bot_message)
                db.commit()
                return {"answer": bot_response, "conversation_id": conversation_id}

        # Combine context with the question
        full_prompt = f"Context: {context}\nQuestion: {question_data.question}" if context else question_data.question

        # Generate a response using the LLM
        response = llm_service.generate_response(full_prompt)
        bot_response = response if response else "Sorry, I couldn't generate a response."

        # Save the bot's response to the database
        bot_message = ChatHistory(
            user_id=current_user.id,
            message=bot_response,
            sender="bot",
            conversation_id=conversation_id
        )
        db.add(bot_message)
        db.commit()

        return {"answer": bot_response, "conversation_id": conversation_id}
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/conversations/")
async def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the latest message for each conversation using a subquery
    latest_messages = (
        db.query(
            ChatHistory.conversation_id,
            func.max(ChatHistory.timestamp).label('max_timestamp')
        )
        .filter(ChatHistory.user_id == current_user.id)
        .group_by(ChatHistory.conversation_id)
        .subquery()
    )

    # Join with original table to get the message content
    conversations = (
        db.query(ChatHistory)
        .join(
            latest_messages,
            and_(
                ChatHistory.conversation_id == latest_messages.c.conversation_id,
                ChatHistory.timestamp == latest_messages.c.max_timestamp
            )
        )
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(desc(ChatHistory.timestamp))
        .all()
    )
    
    return [{
        "conversation_id": conv.conversation_id,
        "preview": conv.message[:50] + "..." if len(conv.message) > 50 else conv.message,
        "timestamp": conv.timestamp.isoformat(),
        "sender": conv.sender
    } for conv in conversations]

@router.get("/history/")
async def get_chat_history(
    conversation_id: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id)
    
    if conversation_id:
        query = query.filter(ChatHistory.conversation_id == conversation_id)
        history = query.order_by(ChatHistory.timestamp.asc()).all()
    else:
        # If no conversation_id, return empty history for new chat
        history = []
    
    return [{
        "sender": msg.sender, 
        "message": msg.message,
        "conversation_id": msg.conversation_id,
        "timestamp": msg.timestamp
    } for msg in history]