from fastapi import FastAPI
from .routes import users, menu, order, store, auth
from .database import engine, Base

app = FastAPI()

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