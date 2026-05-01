from fastapi import APIRouter
from database import get_connection
from groq import Groq
import os
from dotenv import load_dotenv
from datetime import date
import requests

load_dotenv()

router = APIRouter()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@router.get("/")
def get_recommendation(occasion: str = "casual", season: str = "summer"):
    conn = get_connection()
    clothes = conn.execute(
        "SELECT * FROM clothes WHERE occasion = ? AND season = ?",
        (occasion, season)
    ).fetchall()
    conn.close()

    if not clothes:
        return {"recommendation": "No clothes found for this occasion and season. Please upload some clothes first!"}

    clothes_list = []
    for c in clothes:
        clothes_list.append(f"- {c['category']} ({c['color']}) for {c['occasion']} in {c['season']}")

    clothes_text = "\n".join(clothes_list)

    prompt = f"""
You are a personal fashion stylist. Based on the following clothes in the wardrobe:

{clothes_text}

Create a stylish outfit recommendation for a {occasion} occasion in {season} season.
Give:
1. Complete outfit combination
2. Why this combination works
3. One styling tip

Keep it short, friendly and practical.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )
        recommendation_text = response.choices[0].message.content

        # Save to history
        conn = get_connection()
        conn.execute(
            "INSERT INTO outfit_history (occasion, season, recommendation) VALUES (?, ?, ?)",
            (occasion, season, recommendation_text)
        )
        conn.commit()
        conn.close()

        return {"recommendation": recommendation_text}
    except Exception as e:
        return {"recommendation": f"AI Error: {str(e)}"}


@router.get("/history")
def get_history():
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM outfit_history ORDER BY created_at DESC LIMIT 20"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


@router.get("/chat")
def chat_with_stylist(message: str = ""):
    if not message:
        return {"reply": "Please ask me something!"}

    prompt = f"""You are a friendly AI fashion stylist. 
Answer this fashion question briefly and helpfully in 2-3 sentences:
{message}"""

    try:
        response = client.chat.completions.create(
           model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        return {"reply": f"Sorry, I cannot answer right now. Error: {str(e)}"}


@router.get("/outfit-of-the-day")
def outfit_of_the_day():
    try:
        lat, lon = 26.4499, 80.3319
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weathercode"
        res = requests.get(url)
        data = res.json()
        temp = data["current"]["temperature_2m"]

        if temp >= 30:
            season = "summer"
        elif temp <= 15:
            season = "winter"
        else:
            season = "spring"

        conn = get_connection()
        clothes = conn.execute(
            "SELECT * FROM clothes WHERE season = ?", (season,)
        ).fetchall()

        today = str(date.today())
        existing = conn.execute(
            "SELECT * FROM outfit_history WHERE occasion = 'ootd' AND created_at LIKE ?",
            (f"{today}%",)
        ).fetchone()

        if existing:
            conn.close()
            return {
                "recommendation": existing["recommendation"],
                "temp": temp,
                "season": season,
                "cached": True
            }

        if not clothes:
            conn.close()
            return {
                "recommendation": "Upload some clothes first to get your Outfit of the Day!",
                "temp": temp,
                "season": season
            }

        clothes_text = "\n".join([
            f"- {c['category']} ({c['color']})" for c in clothes
        ])

        prompt = f"""You are a personal fashion stylist.
Today is {today}. Temperature is {temp}°C ({season} weather).

Available clothes:
{clothes_text}

Create today's perfect outfit recommendation.
Give:
1. Complete outfit for today
2. Why it suits today's weather
3. One quick styling tip

Keep it friendly, short and practical. Start with "Good morning! Today's outfit:"
"""

        response = client.chat.completions.create(
           model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )
        recommendation_text = response.choices[0].message.content

        conn.execute(
            "INSERT INTO outfit_history (occasion, season, recommendation) VALUES (?, ?, ?)",
            ("ootd", season, recommendation_text)
        )
        conn.commit()
        conn.close()

        return {
            "recommendation": recommendation_text,
            "temp": temp,
            "season": season,
            "cached": False
        }

    except Exception as e:
        return {"recommendation": f"Error: {str(e)}", "temp": 0, "season": "unknown"}