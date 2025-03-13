from .database import Base
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship


# Users table
class User(Base):
    __tablename__ = "users"
    
    login = Column(String(50), primary_key=True)
    password = Column(String(30), nullable=False)
    role = Column(String(20), nullable=False)
    favoriteitems = Column(Text)
    phonenum = Column(String(20), nullable=False)

    # Relationship to FoodOrder
    orders = relationship("FoodOrder", back_populates="user")

# Items table
class Item(Base):
    __tablename__ = "items"
    
    itemname = Column(String(50), primary_key=True)
    ingredients = Column(String(300), nullable=False)
    typeofitem = Column(String(30), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    description = Column(Text)

    # Relationship to ItemsInOrder
    orders = relationship("ItemsInOrder", back_populates="item")

# Store table
class Store(Base):
    __tablename__ = "store"
    
    storeID = Column(Integer, primary_key=True)
    address = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(60), nullable=False)
    isopen = Column(String(60), nullable=False)
    reviewscore = Column(Float)

    # Relationship to FoodOrder
    orders = relationship("FoodOrder", back_populates="store")

# FoodOrder table
class FoodOrder(Base):
    __tablename__ = "foodorder"
    
    orderID = Column(Integer, primary_key=True)
    login = Column(String(50), ForeignKey("users.login", ondelete="CASCADE"), nullable=False)
    storeID = Column(Integer, ForeignKey("store.storeID", ondelete="CASCADE"), nullable=False)
    totalPrice = Column(Numeric(10, 2), nullable=False)
    orderTimestamp = Column(DateTime, nullable=False)
    orderStatus = Column(String(50))

    # Relationships
    user = relationship("User", back_populates="orders")
    store = relationship("Store", back_populates="orders")
    items = relationship("ItemsInOrder", back_populates="order")

# ItemsInOrder table
class ItemsInOrder(Base):
    __tablename__ = "itemsinorder"
    
    orderID = Column(Integer, ForeignKey("foodorder.orderID", ondelete="CASCADE"), primary_key=True)
    itemname = Column(String(50), ForeignKey("items.itemname", ondelete="CASCADE"), primary_key=True)
    quantity = Column(Integer, nullable=False)

    # Relationships
    order = relationship("FoodOrder", back_populates="items")
    item = relationship("Item", back_populates="orders")