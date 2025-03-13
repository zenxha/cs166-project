from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Item
from ..database import get_db


router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/")
def read_menu_items(db: Session = Depends(get_db)):
    return db.query(Item).all()



