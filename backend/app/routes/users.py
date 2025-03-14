from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional, List
from pydantic import BaseModel
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserUpdate(BaseModel):
    login: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    phonenum: Optional[str] = None
    favoriteitems: Optional[str] = None 
    class Config:
        orm_mode = True
        from_attributes = True


@router.get("/", response_model=List[UserUpdate])
def read_all_users(db: Session = Depends(get_db)):
    # Select all users from the users table
    users = db.query(User).all()
    return users

@router.put("/{login}", response_model=UserUpdate)
def update_user(curruser: UserUpdate, db: Session = Depends(get_db), login: str = None):
    try:
        # Check if user exists
        user = db.query(User).filter(User.login == login).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update fields if provided in the request
        if curruser.login:
            user.login = curruser.login
        if curruser.password:
            user.password = curruser.password
        if curruser.role:
            user.role = curruser.role
        if curruser.phonenum:
            user.phonenum = curruser.phonenum
        if curruser.favoriteitems:
            user.favoriteitems = curruser.favoriteitems


        db.commit()
        db.refresh(user) 

        return UserUpdate.from_orm(user) 
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error: " + str(e))
    
@router.get("/{login}", response_model=UserUpdate)
def get_user_by_login(login: str, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.login == login).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserUpdate.from_orm(user)  # Return the user details
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error: " + str(e))