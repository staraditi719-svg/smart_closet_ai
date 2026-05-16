from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_connection
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

router = APIRouter()
security = HTTPBearer()

SECRET_KEY = "smartcloset_secret_key_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode('utf-8'),
        hashed.encode('utf-8')
    )

def create_token(user_id: int, email: str):
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    data = {"sub": str(user_id), "email": email, "exp": expire}
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        email = payload.get("email")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/register")
def register(email: str, password: str, name: str = ""):
    conn = get_connection()
    existing = conn.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered!")
    hashed = hash_password(password)
    conn.execute(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        (email, hashed, name)
    )
    conn.commit()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()
    conn.close()
    token = create_token(user["id"], email)
    return {"token": token, "name": name, "email": email, "message": "Registered successfully!"}

@router.post("/login")
def login(email: str, password: str):
    conn = get_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()
    conn.close()
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password!")
    token = create_token(user["id"], email)
    return {"token": token, "name": user["name"], "email": email, "message": "Login successful!"}

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    user = conn.execute(
        "SELECT id, email, name, created_at FROM users WHERE id = ?",
        (current_user["id"],)
    ).fetchone()
    conn.close()
    return dict(user)