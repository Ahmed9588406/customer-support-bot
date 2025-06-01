import os
import chromadb
from chromadb.utils import embedding_functions
from typing import List, Optional

class RAGService:
    def __init__(self, documents_path: str = "data/faq_documents.txt", collection_name: str = "faq_collection"):
        """
        Initialize the RAG service with Chroma DB.
        :param documents_path: Path to the file containing FAQ documents.
        :param collection_name: Name of the Chroma DB collection.
        """
        # Resolve the documents path relative to the project root
        self.documents_path = self._resolve_path(documents_path)
        self.collection_name = collection_name

        # Initialize Chroma DB client and embedding function
        self.client = chromadb.Client()
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

        # Load or create the collection
        self.collection = self._initialize_collection()

        # Load documents into Chroma DB if not already loaded
        self._load_documents()


    def _resolve_path(self, relative_path: str) -> str:
        """
        Resolve a path relative to the project root directory.
        """
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        absolute_path = os.path.join(project_root, relative_path)
        return os.path.normpath(absolute_path)

    def _initialize_collection(self):
        """
        Initialize or retrieve the Chroma DB collection.
        :return: The Chroma DB collection.
        """
        try:
            # Try to get existing collection
            return self.client.get_collection(
                name=self.collection_name,
                embedding_function=self.embedding_function
            )
        except chromadb.errors.InvalidCollectionException:
            # Create new collection if it doesn't exist
            return self.client.create_collection(
                name=self.collection_name,
                embedding_function=self.embedding_function
            )

    def _load_documents(self):
        """
        Load and index documents from the file.
        """
        try:
            with open(self.documents_path, 'r', encoding='utf-8') as file:
                documents = file.readlines()
            
            # Add documents to the collection with IDs
            self.collection.add(
                documents=documents,
                ids=[f"doc_{i}" for i in range(len(documents))]
            )
        except FileNotFoundError:
            print(f"Documents file not found: {self.documents_path}")
            raise

    def retrieve_context(self, query: str, n_results: int = 3) -> List[str]:
        """
        Retrieve relevant context for a query.
        :param query: The query text
        :param n_results: Number of results to return
        :return: List of relevant document chunks
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results['documents'][0] if results['documents'] else []