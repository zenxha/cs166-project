from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
import jwt
import datetime
from ..models import User
from ..database import get_db

SECRET_KEY = "omegalul"
ALGORITHM = "HS256"  # Algorithm used for JWT encoding/decoding
TOKEN_EXPIRATION_MINUTES = 30  # Token expiration time in minutes

router = APIRouter(prefix="/api/auth", tags=["Authentication", "Auth"])


class UserCreate(BaseModel):
    login: str
    password: str
    phonenum: str

    class Config:
        orm_mode = True 

class UserLogin(BaseModel):
    login: str
    password: str


class UserResponse(BaseModel):
    userid: int
    login: str
    role: str
    phonenum: str
    favoriteitem: Optional[str] = None  # Optional field for favorite item

    class Config:
        orm_mode = True  # Enable ORM mode to read data as dict

@router.post("/register",)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.login == user.login).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        # Create a new user
        new_user = User(login=user.login, password=user.password, role="customer", phonenum=user.phonenum)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)  # Refresh to get the newly created user

        return {"login": new_user.login, "role": new_user.role, "phonenum": new_user.phonenum, "favoriteitem": ""}  # Return the created user

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

    class Config:
        orm_mode = True

@router.post("/login", response_model=TokenResponse)
def login(curr_user: UserLogin, db: Session = Depends(get_db)):
    try:
        query = db.query(User).filter(User.login == curr_user.login, User.password == curr_user.password)
        user = query.first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid login credentials")

        # generate jwt token
        expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=TOKEN_EXPIRATION_MINUTES)
        payload = {
            "sub": curr_user.login,  
            "exp": expiration,  
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token, "token_type": "bearer"}  


    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error: " + str(e))
