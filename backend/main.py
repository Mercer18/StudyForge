from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="StudyForge API",
    description="Backend API for the StudyForge Document-to-Learning Workspace Generator",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3002", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthCheck(BaseModel):
    status: str
    message: str

@app.get("/", response_model=HealthCheck)
def root():
    return HealthCheck(status="ok", message="StudyForge API is running.")

from routes import subjects, chat

app.include_router(subjects.router, prefix="/api/v1/subjects", tags=["Subjects"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
