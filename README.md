# SmartCloset AI 👗

I built this because I was tired of staring at my wardrobe every morning thinking "I have nothing to wear" — so I made an AI that decides for me.

---

## What is this?

SmartCloset AI is a full-stack web app that helps you manage your wardrobe and get outfit recommendations based on your mood, the weather outside, and the occasion. It uses real AI to suggest outfits — not just random combinations.

You upload your clothes once. The app remembers everything, checks the weather, understands your style, and tells you exactly what to wear.

---

## Why I built this

I wanted to build something actually useful, not just another todo app. This project taught me how to connect a React frontend with a Python backend, work with real APIs, integrate AI into a real product, and handle things like color detection, image uploads, and user authentication from scratch.

---

## 📸 Screenshots

### 🏠 Home Dashboard
The dashboard shows your wardrobe stats at a glance — total clothes, AI outfits generated, live weather, and your style score.

![Home](screenshots/home.png)
![Home Logged Out](screenshots/home_logged_out.png)

---

### 🔐 Login & Signup
Simple and clean. Your wardrobe is personal so everything is behind auth.

| Login | Sign Up |
|-------|---------|
| ![Login](screenshots/login.png) | ![Signup](screenshots/signup.png) |

---

### 📤 Upload Clothes
Upload a photo of any clothing item and tag it. The app **auto-detects the color** using OpenCV — you don't have to type it manually.

![Upload](screenshots/upload.png)
![Upload Success](screenshots/upload_success.png)

The category selector updates the type dropdown automatically based on what you pick:

**👕 Upper Body**
T-Shirt · Shirt · Top / Crop Top · Hoodie / Sweater · Blouse · Tank Top

![Upper Body](screenshots/dropdown_upperbody.png)

**👖 Bottom**
Jeans · Pants / Trousers · Skirt · Shorts · Leggings

![Bottom](screenshots/dropdown_bottom.png)

**👗 Full Body**
Dress · Frock · One-Piece · Jumpsuit · Gown · Saree · Kurta / Kurti

![Full Body](screenshots/dropdown_fullbody.png)

**👟 Footwear**
Shoes · Sneakers · Sandals / Slippers · Heels · Boots · Flats / Loafers

![Footwear](screenshots/dropdown_footwear.png)

**👜 Accessories**
Bag / Purse · Watch / Jewellery · Belt · Scarf / Dupatta · Sunglasses · Cap / Hat

![Accessories](screenshots/dropdown_accessories.png)

Each item is also tagged with occasion and season:

**Occasion** — Casual · Formal & Professional · Streetwear · Bohemian · Minimalist · Ethnic & Traditional · Sporty & Athletic

![Occasion](screenshots/dropdown_occasion.png)

---

### 👚 My Wardrobe
All your clothes in one place. Filter by type, occasion, or season. Every item shows its detected color and tags.

![Wardrobe](screenshots/wardrobe.png)
![Wardrobe Filtered](screenshots/wardrobe_filtered.png)

---

### 🤖 AI Outfit Recommendation
Tell the AI your occasion and season — it picks clothes from your actual wardrobe and explains why the combination works, plus gives you a styling tip.

![Recommend Casual](screenshots/recommend_casual.png)
![Recommend College](screenshots/recommend_college.png)

---

### 🌦️ Weather-Based Suggestions
Enter any city, get real-time weather, and the app automatically shows clothes from your wardrobe that match the season. Works for any city in the world.

![Weather Mumbai](screenshots/weather_mumbai.png)
![Weather Hyderabad](screenshots/weather_hyderabad.png)

---

### 📊 Analytics Dashboard
See your wardrobe breakdown — clothes by category, color distribution, season split, occasion coverage, and a wardrobe score out of 100.

![Analytics](screenshots/analytics.png)

---

### 📜 Outfit History
Every AI recommendation is saved automatically. Great for when you liked an outfit last week but can't remember what it was.

![History](screenshots/history.png)

---

### 📅 Outfit Calendar
Plan outfits ahead of time. Pick a date, occasion, and season — AI generates an outfit and saves it to your weekly calendar.

![Calendar](screenshots/calendar.png)
![Calendar Result](screenshots/calendar_result.png)
![Planned Outfits](screenshots/ai_planned_outfits.png)

---

### 👤 Style Profile
Tell the app your style preferences, body type, and favorite colors. The AI uses this to give you more personalized recommendations.

**Style Preference** — Casual · Formal & Professional · Streetwear · Bohemian · Minimalist · Ethnic & Traditional · Sporty & Athletic

**Body Type** — Slim · Average · Athletic · Curvy · Plus Size

![Profile](screenshots/profile.png)
![Body Type](screenshots/dropdown_bodytype.png)

---

### 💬 AI Style Advisor
A floating chat widget always available on screen. Ask anything fashion related — it knows your wardrobe and your style.

![AI Stylist](screenshots/ai_stylist.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Database | SQLite |
| AI / LLM | Groq API (Llama 3) |
| Color Detection | OpenCV |
| Weather | OpenWeatherMap API |
| Auth | JWT-based |

---

## How to run locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Create a `.env` file in the backend folder:
```
GROQ_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here
SECRET_KEY=your_secret_here
```
Get a free Groq key at [console.groq.com](https://console.groq.com)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Project Structure

```
smart-closet-ai/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── routes/
│   │   ├── wardrobe.py
│   │   ├── recommend.py
│   │   ├── weather.py
│   │   ├── analytics.py
│   │   ├── profile.py
│   │   └── calendar.py
│   └── .env (not pushed to GitHub)
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── App.jsx
└── screenshots/
```

---

## What I want to add next

- Share outfit as an image card
- PostgreSQL instead of SQLite for multi-user support
- Cloud image storage with AWS S3 or Cloudinary
- Mobile app with React Native
- Virtual try-on using AI image generation
- Cost-per-wear tracker — add price when uploading, track how often you wear it

---

## Honest note

I learned a lot building this. Some parts were easy, some were really frustrating — especially getting the color detection right and connecting everything together. But I figured it out and I'm proud of how it turned out.

---

## Author

**Aditi** — BTech 3rd year student who likes building things that actually solve real problems.
