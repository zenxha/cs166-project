from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from ..models import FoodOrder, ItemsInOrder, Item
from ..database import get_db

router = APIRouter(prefix="/api/orders", tags=["Orders"])

class OrderItem(BaseModel):
    itemname: str
    quantity: int

class OrderCreate(BaseModel):
    login: str
    storeid: int
    items: List[OrderItem]  # List of items in the order

    class Config:
        orm_mode = True 
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.strftime('%Y-%m-%d %H:%M:%S')
        }

class OrderResponse(BaseModel):
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

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        # Create a new food order
        total_price = sum(item.quantity * db.query(Item.price).filter(Item.itemname == item.itemname).scalar() for item in order.items)
        new_order = FoodOrder(
            login=order.login,
            storeid=order.storeid,
            totalprice=total_price,
            ordertimestamp=datetime.now(),
            orderstatus="Pending"  # Default status
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
    

@router.get("/history/", response_model=List[OrderCreate])
def get_all_orders(db: Session = Depends(get_db), login: Optional[str] = None, limit: Optional[int] = None):
    try:
        query = db.query(FoodOrder)
        if login:
            query = query.filter(FoodOrder.login == login)

        orders = query.all()
        res = []
        
        for order in orders:
            items = db.query(ItemsInOrder).filter(ItemsInOrder.orderid == order.orderid).all()
            res.append({
                "orderid": order.orderid,
                "login": order.login,
                "storeid": order.storeid,
                "totalprice": order.totalprice,
                "ordertimestamp": order.ordertimestamp.strftime('%Y-%m-%d %H:%M:%S'),
                "orderstatus": order.orderstatus,
                "items": [{"itemname": item.itemname, "quantity": item.quantity} for item in items]
            })

        if limit:
            res = res[:limit]

        return res
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error: " + str(e))
    
@router.get("/{orderid}", response_model=OrderCreate)
def get_order_by_id(orderid: int, db: Session = Depends(get_db)):
    try:
        order = db.query(FoodOrder).filter(FoodOrder.orderid == orderid).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        items = db.query(ItemsInOrder).filter(ItemsInOrder.orderid == orderid).all()
        return {
            "orderid": order.orderid,
            "login": order.login,
            "storeid": order.storeid,
            "totalprice": order.totalprice,
            "ordertimestamp": order.ordertimestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "orderstatus": order.orderstatus,
            "items": [{"itemname": item.itemname, "quantity": item.quantity} for item in items]
        }
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error: " + str(e))

class OrderStatusUpdate(BaseModel):
    status: str

@router.put("/{orderid}/status", response_model=OrderCreate)
def update_order_status(orderid: int, status_update: OrderStatusUpdate, db: Session = Depends(get_db)):
    try:
        if status_update.status not in ["Pending", "In Progress", "Delivered", "Cancelled"]:
            raise HTTPException(status_code=400, detail="Invalid status update")
        order = db.query(FoodOrder).filter(FoodOrder.orderid == orderid).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order.orderstatus = status_update.status
        db.commit()
        db.refresh(order) 

        # Fetch items associated with the order
        items = db.query(ItemsInOrder).filter(ItemsInOrder.orderid == orderid).all()


        return {
            "orderid": order.orderid,
            "login": order.login,
            "storeid": order.storeid,
            "totalprice": order.totalprice,
            "ordertimestamp": order.ordertimestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "orderstatus": order.orderstatus,
            "items": [{"itemname": item.itemname, "quantity": item.quantity} for item in items]
        }
        
    except SQLAlchemyError as e:
        db.rollback()  # Rollback in case of an exception
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        db.rollback()  # Rollback for other exceptions
        raise HTTPException(status_code=400, detail="Error: " + str(e))