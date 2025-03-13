from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def read_all_users(db: Session = Depends(get_db)):
    # Select all users from the users table
    users = db.query(User).all()
    return users