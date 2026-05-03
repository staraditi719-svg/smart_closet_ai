from fastapi import APIRouter
from database import get_connection
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
groq_key = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=groq_key) if groq_key else None
@router.get("/")
def get_profile():
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM style_profile ORDER BY id DESC LIMIT 1"
    ).fetchone()
    conn.close()
    if row:
        return dict(row)
    return {}

@router.post("/save")
def save_profile(
    name: str,
    age: int,
    gender: str,
    style_preference: str,
    favorite_colors: str,
    body_type: str
):
    conn = get_connection()
    conn.execute("DELETE FROM style_profile")
    conn.execute(
        "INSERT INTO style_profile (name, age, gender, style_preference, favorite_colors, body_type) VALUES (?, ?, ?, ?, ?, ?)",
        (name, age, gender, style_preference, favorite_colors, body_type)
    )
    conn.commit()
    conn.close()
    return {"message": "Profile saved successfully!"}

@router.get("/recommend")
def personalized_recommendation(occasion: str = "casual", season: str = "summer"):
    conn = get_connection()

    profile = conn.execute(
        "SELECT * FROM style_profile ORDER BY id DESC LIMIT 1"
    ).fetchone()

    clothes = conn.execute(
        "SELECT * FROM clothes WHERE occasion = ? AND season = ?",
        (occasion, season)
    ).fetchall()
    conn.close()

    if not clothes:
        return {"recommendation": "No clothes found! Please upload some clothes first."}

    clothes_text = "\n".join([
        f"- {c['main_category']} ({c['color']})" for c in clothes
    ])

    if profile:
        profile_text = f"""
User Profile:
- Name: {profile['name']}
- Age: {profile['age']}
- Gender: {profile['gender']}
- Style preference: {profile['style_preference']}
- Favorite colors: {profile['favorite_colors']}
- Body type: {profile['body_type']}
"""
    else:
        profile_text = "No profile set — giving general recommendation."

    prompt = f"""You are a personal AI fashion stylist.

{profile_text}

Available clothes:
{clothes_text}

Create a personalized outfit recommendation for {occasion} occasion in {season} season.
Address the user by name if available.
Consider their style preference and favorite colors.
Give:
1. Perfect outfit combination for them specifically
2. Why it suits their style
3. One personalized styling tip

Keep it friendly and personal!
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )
        return {"recommendation": response.choices[0].message.content}
    except Exception as e:
        return {"recommendation": f"AI Error: {str(e)}"}