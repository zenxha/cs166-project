from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from ..models import Store
from ..database import get_db

router = APIRouter(prefix="/stores", tags=["Store"])

class StoreResponse(BaseModel):

    storeid: int
    address: str
    city: str
    state: str
    isopen: str
    reviewscore: Optional[float] = None  # Optional field for review score

    class Config:
        orm_mode = True

@router.get("/", response_model=List[StoreResponse])
def get_all_stores(db: Session = Depends(get_db)):
    try:
        stores = db.query(Store).all()
        return stores
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
