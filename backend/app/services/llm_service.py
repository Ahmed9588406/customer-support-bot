import requests
from typing import Optional
class LLMService:
    def __init__(self,model_name:str="gemma3:4b",ollama_url: str = "http://localhost:11434"):
        """
        Initialize the LLM service.
        :param model_name: Name of the model to use (e.g., 'mistral').
        """
        self.model_name = model_name
        # TODO: Add any required initialization (e.g., Ollama URL)
        self.ollama_url = f"{ollama_url}/api/generate"



    def generate_response(self,prompt:str) ->str:
        """
        Generate a response using the LLM.
        :param prompt: The input question or context.
        :return: The generated response.
        """
        try:
            # Prepare the request payload
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "stream": False  # Disable streaming to get a single response
            }

            response = requests.post(self.ollama_url, json=payload, timeout=60)
            # Check if the request was successful
            if response.status_code == 200:
                # Extract the response text
                data = response.json()
                return data.get("response", "").strip()
            else:
                # Handle errors
                print(f"Error: {response.status_code}")
                return None
        except requests.RequestException as e:
            print(f"Error communicating with Ollama: {e}")
            return None



