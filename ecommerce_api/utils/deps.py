from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from .auth import decode_token
from typing import Optional
from fastapi import Request
from fastapi.security.utils import get_authorization_scheme_param


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token, is_refresh=False)
    if payload is None:
        raise credentials_exception
        
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
        
    return user

async def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

async def get_optional_current_user(
    request: Request = None,  # Optional request arg
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Attempts to retrieve the current user if an Authorization header is present.
    If no header is present or validation fails, it returns None (for guest sessions).
    """

    if not request:
        return None
        
    authorization: str = request.headers.get("Authorization")
    scheme, param = get_authorization_scheme_param(authorization)
    
    if not authorization or scheme.lower() != "bearer":
        return None
        
    try:
        payload = decode_token(param, is_refresh=False)
        if payload is None:
            return None
        email: str = payload.get("sub")
        if email is None:
            return None
        user = db.query(User).filter(User.email == email).first()
        if user and user.is_active:
            return user
    except Exception:
        pass
        
    return None

