from fastapi import APIRouter
from database import get_connection
import requests

router = APIRouter()

def get_coordinates(city: str):
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        if "results" not in data or len(data["results"]) == 0:
            return None, None, None
        result = data["results"][0]
        return result["latitude"], result["longitude"], result.get("country", "")
    except:
        return None, None, None

@router.get("/")
def get_weather_recommendation(city: str = "Kanpur"):
    lat, lon, country = get_coordinates(city)

    if lat is None:
        return {"error": f"City '{city}' not found. Please check spelling!"}

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weathercode,apparent_temperature&timezone=auto"
        response = requests.get(url, timeout=5)
        data = response.json()

        temp = round(data["current"]["temperature_2m"], 1)
        feels_like = round(data["current"]["apparent_temperature"], 1)
        code = data["current"]["weathercode"]

        if code == 0:
            description = "clear sky"
        elif code in [1, 2, 3]:
            description = "partly cloudy"
        elif code in [51, 53, 55, 61, 63, 65]:
            description = "rainy"
        elif code in [71, 73, 75]:
            description = "snowy"
        elif code in [95, 96, 99]:
            description = "thunderstorm"
        else:
            description = "cloudy"

        if temp >= 30:
            season = "summer"
        elif temp <= 15:
            season = "winter"
        else:
            season = "spring"

        conn = get_connection()
        clothes = conn.execute(
            "SELECT * FROM clothes WHERE season = ? OR season = 'all'",
            (season,)
        ).fetchall()
        conn.close()

        if not clothes:
            return {
                "city": city,
                "country": country,
                "temp": temp,
                "feels_like": feels_like,
                "description": description,
                "season": season,
                "available_clothes": [],
                "suggestion": f"It is {temp}°C in {city}, {country}. No clothes for {season}. Please upload some!"
            }

        return {
            "city": city,
            "country": country,
            "temp": temp,
            "feels_like": feels_like,
            "description": description,
            "season": season,
            "available_clothes": [dict(c) for c in clothes],
            "suggestion": f"It is {temp}°C (feels like {feels_like}°C) in {city}, {country} — {description}. Showing your {season} wardrobe!"
        }

    except Exception as e:
        return {"error": f"Weather fetch failed: {str(e)}"}
    