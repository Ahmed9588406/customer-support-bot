from app.services.llm_service import LLMService
import json
import sys

if __name__ == "__main__":
    try:
        # Initialize the LLM service
        llm_service = LLMService(model_name="gemma3:4b", ollama_url="http://localhost:11434")

        # Test a sample question
        question = "What is the capital of France?"
        print(f"Sending question: {question}")
        
        response = llm_service.generate_response(question)

        # Print the result
        if response:
            print(f"Response: {response}")
        else:
            print("Failed to get a response.")
            
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        print(f"Error location: line {e.lineno}, column {e.colno}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(f"Error type: {type(e).__name__}")