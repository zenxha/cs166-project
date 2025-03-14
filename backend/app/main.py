from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import users, menu, order, store, auth
from .database import engine, Base


app = FastAPI()

# Allowing CORS for the frontend URL
origins = [
    "http://localhost:5173", 
    "http://localhost",  
    "http://localhost:3000",  
]

# Add CORSMiddleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Database initialization
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(users.router)
app.include_router(menu.router)
app.include_router(order.router)
app.include_router(store.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Pizza Store API"}