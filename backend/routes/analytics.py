from fastapi import APIRouter
from database import get_connection

router = APIRouter()

@router.get("/")
def get_analytics():
    conn = get_connection()

    # Total clothes count
    total = conn.execute("SELECT COUNT(*) as count FROM clothes").fetchone()["count"]

    # Count by category
    categories = conn.execute(
        "SELECT category, COUNT(*) as count FROM clothes GROUP BY category ORDER BY count DESC"
    ).fetchall()

    # Count by color
    colors = conn.execute(
        "SELECT color, COUNT(*) as count FROM clothes GROUP BY color ORDER BY count DESC LIMIT 6"
    ).fetchall()

    # Count by season
    seasons = conn.execute(
        "SELECT season, COUNT(*) as count FROM clothes GROUP BY season"
    ).fetchall()

    # Count by occasion
    occasions = conn.execute(
        "SELECT occasion, COUNT(*) as count FROM clothes GROUP BY occasion"
    ).fetchall()

    # Total recommendations
    total_recommendations = conn.execute(
        "SELECT COUNT(*) as count FROM outfit_history"
    ).fetchone()["count"]

    conn.close()

    return {
        "total_clothes": total,
        "total_recommendations": total_recommendations,
        "by_category": [dict(r) for r in categories],
        "by_color": [dict(r) for r in colors],
        "by_season": [dict(r) for r in seasons],
        "by_occasion": [dict(r) for r in occasions],
        "wardrobe_score": min(100, total * 4 + total_recommendations * 2)
    }
