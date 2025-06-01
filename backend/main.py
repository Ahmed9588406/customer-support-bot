from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.chat import router as chat_router

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from the React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include the chat router
app.include_router(chat_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Customer Support Bot API!"}