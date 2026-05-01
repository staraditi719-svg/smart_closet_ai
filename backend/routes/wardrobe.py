from dotenv import load_dotenv
load_dotenv()
from fastapi import APIRouter, UploadFile, File, Form
from database import get_connection
from colorthief import ColorThief
import webcolors
import shutil
import uuid
import os

router = APIRouter()

# Category system
CATEGORIES = {
    "upper": ["tshirt", "shirt", "top", "hoodie", "sweater", "blouse", "tank"],
    "bottom": ["jeans", "pants", "skirt", "shorts", "leggings", "trousers"],
    "fullbody": ["dress", "frock", "onepiece", "jumpsuit", "gown", "saree", "kurta"],
    "footwear": ["shoes", "sneakers", "sandals", "heels", "boots", "flats"],
    "accessory": ["watch", "bag", "belt", "scarf", "jewellery", "sunglasses", "cap", "purse"]
}

def get_main_category(subcategory):
    for main, subs in CATEGORIES.items():
        if subcategory.lower() in subs:
            return main
    return "upper"

def closest_color(rgb):
    min_diff = float('inf')
    closest = "unknown"
    for name in webcolors.names("css3"):
        hex_val = webcolors.name_to_hex(name)
        r, g, b = webcolors.hex_to_rgb(hex_val)
        diff = abs(r - rgb[0]) + abs(g - rgb[1]) + abs(b - rgb[2])
        if diff < min_diff:
            min_diff = diff
            closest = name
    return closest

def detect_color(image_path):
    try:
        import cv2
        import numpy as np

        img = cv2.imread(image_path)
        if img is None:
            raise Exception("Cannot read image")

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        h, w = img.shape[:2]

        top, bottom = int(h*0.2), int(h*0.8)
        left, right = int(w*0.2), int(w*0.8)
        img = img[top:bottom, left:right]
        img = cv2.resize(img, (100, 100))

        hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)

        color_ranges = {
            "red":    [([0,100,100], [10,255,255]), ([160,100,100], [180,255,255])],
            "orange": [([11,100,100], [25,255,255])],
            "yellow": [([26,100,100], [35,255,255])],
            "green":  [([36,50,50], [85,255,255])],
            "teal":   [([86,50,50], [100,255,255])],
            "blue":   [([101,50,50], [130,255,255])],
            "purple": [([131,50,50], [155,255,255])],
            "pink":   [([156,50,100], [165,255,255])],
            "white":  [([0,0,200], [180,30,255])],
            "black":  [([0,0,0], [180,255,50])],
            "grey":   [([0,0,50], [180,30,200])],
        }

        color_counts = {}
        total_pixels = img.shape[0] * img.shape[1]

        for color_name, ranges in color_ranges.items():
            mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
            for lower, upper in ranges:
                lower = np.array(lower, dtype=np.uint8)
                upper = np.array(upper, dtype=np.uint8)
                mask += cv2.inRange(hsv, lower, upper)
            count = cv2.countNonZero(mask)
            if count > total_pixels * 0.05:
                color_counts[color_name] = count

        neutral_colors = {"white", "black", "grey"}
        colored = {k: v for k, v in color_counts.items() if k not in neutral_colors}
        neutrals = {k: v for k, v in color_counts.items() if k in neutral_colors}

        if "white" in neutrals:
            if neutrals["white"] / total_pixels > 0.5:
                neutrals.pop("white")

        if not colored and not neutrals:
            ct = ColorThief(image_path)
            dominant = ct.get_color(quality=1)
            return closest_color(dominant)

        significant_colors = [k for k, v in colored.items() if v > total_pixels * 0.12]

        if len(significant_colors) >= 3:
            return "multicolor"

        if len(significant_colors) == 2:
            return f"{significant_colors[0]} and {significant_colors[1]}"

        if colored:
            dominant = max(colored, key=colored.get)
            pixels_flat = img.reshape(-1, 3)
            brightness_vals = []
            for pixel in pixels_flat:
                hsv_pixel = cv2.cvtColor(
                    __import__('numpy').uint8([[pixel]]),
                    cv2.COLOR_RGB2HSV
                )[0][0]
                brightness_vals.append(hsv_pixel[2])
            avg_v = sum(brightness_vals) / len(brightness_vals)
            if avg_v < 80:
                return f"dark {dominant}"
            elif avg_v > 200:
                return f"light {dominant}"
            else:
                return dominant

        if neutrals:
            return max(neutrals, key=neutrals.get)

        return "unknown"

    except Exception as e:
        print(f"Color detection error: {e}")
        try:
            ct = ColorThief(image_path)
            dominant = ct.get_color(quality=1)
            return closest_color(dominant)
        except:
            return "unknown"


@router.post("/upload")
async def upload_cloth(
    file: UploadFile = File(...),
    subcategory: str = Form(...),
    occasion: str = Form(...),
    season: str = Form(...)
):
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"uploads/{filename}"

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    color = detect_color(filepath)
    main_category = get_main_category(subcategory)

    conn = get_connection()
    conn.execute(
        "INSERT INTO clothes (filename, main_category, subcategory, color, occasion, season) VALUES (?, ?, ?, ?, ?, ?)",
        (filename, main_category, subcategory, color, occasion, season)
    )
    conn.commit()
    conn.close()

    return {
        "message": "Uploaded successfully!",
        "color": color,
        "filename": filename,
        "main_category": main_category,
        "subcategory": subcategory
    }


@router.get("/all")
def get_all_clothes():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM clothes ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@router.delete("/{cloth_id}")
def delete_cloth(cloth_id: int):
    conn = get_connection()
    row = conn.execute("SELECT filename FROM clothes WHERE id = ?", (cloth_id,)).fetchone()
    if row:
        filepath = f"uploads/{row['filename']}"
        if os.path.exists(filepath):
            os.remove(filepath)
        conn.execute("DELETE FROM clothes WHERE id = ?", (cloth_id,))
        conn.commit()
    conn.close()
    return {"message": "Deleted successfully"}