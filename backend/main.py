from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from database import init_db
from routes import wardrobe, recommend, weather, analytics, profile, calendar, auth
import os

load_dotenv()

app = FastAPI(title="Smart Wardrobe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(wardrobe.router, prefix="/api/wardrobe")
app.include_router(recommend.router, prefix="/api/recommend")
app.include_router(weather.router, prefix="/api/weather")
app.include_router(analytics.router, prefix="/api/analytics")
app.include_router(profile.router, prefix="/api/profile")
app.include_router(calendar.router, prefix="/api/calendar")
app.include_router(auth.router, prefix="/api/auth")

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Smart Wardrobe API running ✅"}