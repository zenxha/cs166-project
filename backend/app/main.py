from fastapi import FastAPI
from .routes import users, menu
from .database import engine, Base

app = FastAPI()

# Database initialization
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(users.router)
# app.include_router(orders.router)
app.include_router(menu.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Pizza Store API"}