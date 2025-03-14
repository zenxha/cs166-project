from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from ..models import Item
from ..database import get_db


router = APIRouter(prefix="/api/menu", tags=["Menu"])

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
        if type not in ["entree", "sides", "drinks"]:
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



class MenuItemCreate(BaseModel):
    itemname: str
    ingredients: str
    typeofitem: str
    price: float
    description: Optional[str] = None

    class Config:
        from_attributes = True

class MenuItemUpdate(BaseModel):
    itemname: Optional[str] = None
    ingredients: Optional[str] = None
    typeofitem: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

@router.post("/", response_model=MenuItemCreate)
def create_menu_item(menu_item: MenuItemCreate, db: Session = Depends(get_db)):

    existing_item = db.query(Item).filter(Item.itemname == menu_item.itemname).first()
    if existing_item:
        raise HTTPException(status_code=400, detail="Menu item already exists")
    try:
        new_item = Item(
            itemname=menu_item.itemname,
            ingredients=menu_item.ingredients,
            typeofitem=menu_item.typeofitem,
            price=menu_item.price,
            description=menu_item.description  # Optional field
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return MenuItemCreate.from_orm(new_item)  # Return the created item
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add menu item")


@router.put("/{item_name}", response_model=MenuItemCreate)
def update_menu_item(
    item_name: str, menu_item: MenuItemUpdate, db: Session = Depends(get_db)
):
    # Find the item in the database
    existing_item = db.query(Item).filter(Item.itemname == item_name).first()
    
    if not existing_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Update the item details
    if menu_item.itemname:
        existing_item.itemname = menu_item.itemname
    if menu_item.ingredients:
        existing_item.ingredients = menu_item.ingredients
    if menu_item.typeofitem:
        if menu_item.typeofitem not in ["entree", "sides", "drinks"]:
            raise HTTPException(status_code=400, detail="Invalid menu item type specified")
        existing_item.typeofitem = menu_item.typeofitem
    if menu_item.price:
        try:
            existing_item.price = float(menu_item.price)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid price format")
    if menu_item.description:
        existing_item.description = menu_item.description

    try:
        db.commit()
        db.refresh(existing_item)
        return MenuItemCreate.from_orm(existing_item)  # Return the updated item
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update menu item")


