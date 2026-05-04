from fastapi import APIRouter
from database import get_connection
from groq import Groq
import os
from dotenv import load_dotenv
from datetime import date, timedelta

load_dotenv()
router = APIRouter()

@router.get("/")
def get_calendar():
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM outfit_calendar ORDER BY date ASC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/plan")
def plan_outfit(
    date_str: str,
    occasion: str = "casual",
    season: str = "summer",
    note: str = ""
):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    conn = get_connection()

    existing = conn.execute(
        "SELECT * FROM outfit_calendar WHERE date = ?", (date_str,)
    ).fetchone()

    clothes = conn.execute(
        "SELECT * FROM clothes WHERE occasion = ? AND season = ?",
        (occasion, season)
    ).fetchall()

    if not clothes:
        conn.close()
        return {"message": "No clothes found for this occasion and season!"}

    clothes_text = "\n".join([
        f"- {c['main_category']} ({c['color']})" for c in clothes
    ])

    prompt = f"""You are a fashion stylist.
Plan an outfit for {date_str} for a {occasion} occasion in {season} season.
Note from user: {note if note else 'None'}

Available clothes:
{clothes_text}

Give a short outfit plan in 2-3 sentences. Be specific about which clothes to wear.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )
        recommendation = response.choices[0].message.content
    except Exception as e:
        recommendation = f"AI Error: {str(e)}"

    if existing:
        conn.execute(
            "UPDATE outfit_calendar SET occasion=?, season=?, note=?, recommendation=? WHERE date=?",
            (occasion, season, note, recommendation, date_str)
        )
    else:
        conn.execute(
            "INSERT INTO outfit_calendar (date, occasion, season, note, recommendation) VALUES (?, ?, ?, ?, ?)",
            (date_str, occasion, season, note, recommendation)
        )

    conn.commit()
    conn.close()
    return {"message": "Outfit planned!", "recommendation": recommendation}

@router.delete("/{date_str}")
def delete_plan(date_str: str):
    conn = get_connection()
    conn.execute("DELETE FROM outfit_calendar WHERE date = ?", (date_str,))
    conn.commit()
    conn.close()
    return {"message": "Plan deleted!"}