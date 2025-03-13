from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models import Item
from ..database import get_db


router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/")
def read_menu_items(
    db: Session = Depends(get_db),
    type: Optional[str] = None,
    maxprice: Optional[float] = None,
    sort: Optional[str] = None,
    ):
    
    query = db.query(Item)

    # filters
    if type:
        if type not in ["Main", "Side"]:
            raise HTTPException(status_code=400, detail="Invalid menu item type specified")
        query = query.filter(Item.typeofitem == type)
    if maxprice is not None:
        query = query.filter(Item.price <= maxprice)

    if sort:
        if sort == "asc":
            query = query.order_by(Item.price.asc())
        elif sort == "desc":
            query = query.order_by(Item.price.desc())

    res = query.all()


    return res



