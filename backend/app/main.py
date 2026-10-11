"""
Main FastAPI Application Entrypoint
Lost and Found — College DBMS Project
Includes:
- CORS middleware for development (http://localhost:5500, http://localhost:3000, http://127.0.0.1:8000)
- Routers: auth, students, items, admin
- Database initialization
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, students, items, admin

# Create tables in MySQL if not existing
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[Warning] Could not auto-create tables via SQLAlchemy engine: {e}")

app = FastAPI(
    title="Lost and Found — College DBMS Project API",
    description="REST APIs backed by MySQL for student reports, claims, and administrative verification.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(items.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "project": "Lost and Found — College DBMS Project",
        "status": "online",
        "documentation": "/docs",
        "backend": "FastAPI + MySQL",
        "database_connected": True
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "lost-and-found-backend"}
