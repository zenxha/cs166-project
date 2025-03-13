from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from ..models import FoodOrder, ItemsInOrder
from ..database import get_db

router = APIRouter(prefix="/orders", tags=["Orders"])

class OrderItem(BaseModel):
    itemname: str
    quantity: int

class OrderCreate(BaseModel):
    orderid: Optional[int] = None 
    login: str
    storeid: int
    totalprice: float
    ordertimestamp: datetime
    orderstatus: Optional[str] = None 
    items: List[OrderItem]  # Add the list of items

    class Config:
        orm_mode = True 
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.strftime('%Y-%m-%d %H:%M:%S')
        }

@router.post("/", response_model=OrderCreate)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        # Create a new food order
        new_order = FoodOrder(
            login=order.login,
            storeid=order.storeid,
            totalprice=order.totalprice,
            ordertimestamp=order.ordertimestamp,
            orderstatus=order.orderstatus
        )

        db.add(new_order)
        db.commit()  #  Commit to get the orderID
        db.refresh(new_order) # neworder has newly generared id

        # need to add to itemsinorder relation
        for item in order.items:
            item_in_order = ItemsInOrder(
                orderid=new_order.orderid,
                itemname=item.itemname,
                quantity=item.quantity
            )
            db.add(item_in_order)

    
        db.commit()

        # Refresh the new order object to include the related items
        db.refresh(new_order)  

        items = db.query(ItemsInOrder).filter(ItemsInOrder.orderid == new_order.orderid).all()
        return {
            "ikuyo": "kitA",
            "orderid": new_order.orderid,
            "login": new_order.login,
            "storeid": new_order.storeid,
            "totalprice": new_order.totalprice,
            "ordertimestamp": new_order.ordertimestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "orderstatus": new_order.orderstatus,
            "items": [{"itemname": item.itemname, "quantity": item.quantity} for item in items]
        }    # doing this cuz i cant figure out SqlAlchemy relationsihps to return the order with the items in it lul

    except SQLAlchemyError as e:
        db.rollback()  # Rollback the transaction in case of an error
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        db.rollback()  # Rollback on other exceptions
        raise HTTPException(status_code=400, detail="Error: " + str(e))