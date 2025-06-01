# backend/test_rag_service.py
from app.services.rag_service import RAGService
import chromadb.errors

if __name__ == "__main__":
    try:
        # Initialize the RAG service with correct relative path
        rag_service = RAGService(documents_path="data/faq_documents.txt", collection_name="faq_collection")

        # Test a sample question
        question = "When was TechCorp Solutions founded?"
        context = rag_service.retrieve_context(question)

        # Print the result
        print(f"Retrieved Context: {context}")
        
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except chromadb.errors.ChromaError as e:
        print(f"ChromaDB error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")