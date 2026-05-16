# 👗 SmartCloset AI

> **Your AI-powered wardrobe assistant** — organize your clothes, get outfit recommendations based on weather and occasion, and chat with your own personal AI stylist.

---

## ✨ What is this?

SmartCloset AI is a full-stack web application that helps you manage your wardrobe smartly. You upload your clothes once, and the app takes care of the rest — it remembers everything, suggests outfits based on the weather outside, tells you what to wear for college or a date night, tracks your style history, and even lets you plan outfits for the whole week ahead.

Built with **React + Vite** on the frontend and **FastAPI + SQLite** on the backend, with AI recommendations powered by **Groq (Llama 3)** and color detection using **OpenCV**.

---

## 📸 Screenshots

### 🏠 Landing Page & Dashboard
The home screen shows your wardrobe stats at a glance — total clothes, AI outfits generated, live weather, and your style score.

![Home](screenshots/home.png)
![Home Logged Out](screenshots/home_logged_out.png)

---

### 🔐 Authentication
Clean login and signup pages with a dark luxury theme. Your wardrobe is personal, so everything is behind auth.

| Login | Sign Up |
|-------|---------|
| ![Login](screenshots/login.png) | ![Signup](screenshots/signup.png) |

---

### 📤 Upload Clothes
Upload any clothing item and tag it with a category, type, occasion, and season. The app auto-detects the color using OpenCV — no manual input needed.

![Upload](screenshots/upload.png)
![Upload Success](screenshots/upload_success.png)

The category selector dynamically updates the type dropdown based on what you pick:

**👕 Upper Body**
T-Shirt · Shirt · Top / Crop Top · Hoodie / Sweater · Blouse · Tank Top

![Upper Body Dropdown](screenshots/dropdown_upperbody.png)

**👖 Bottom**
Jeans · Pants / Trousers · Skirt · Shorts · Leggings

![Bottom Dropdown](screenshots/dropdown_bottom.png)

**👗 Full Body**
Dress · Frock · One-Piece · Jumpsuit · Gown · Saree · Kurta / Kurti

![Full Body Dropdown](screenshots/dropdown_fullbody.png)

**👟 Footwear**
Shoes · Sneakers · Sandals / Slippers · Heels · Boots · Flats / Loafers

![Footwear Dropdown](screenshots/dropdown_footwear.png)

**👜 Accessories**
Bag / Purse · Watch / Jewellery · Belt · Scarf / Dupatta · Sunglasses · Cap / Hat

![Accessories Dropdown](screenshots/dropdown_accessories.png)

You also tag each item with:

- **Occasion** — Casual, Formal & Professional, Streetwear, Bohemian, Minimalist, Ethnic & Traditional, Sporty & Athletic

![Occasion Dropdown](screenshots/dropdown_occasion.png)

---

### 👚 My Wardrobe
All your uploaded clothes in one place. Filter by type, occasion, or season. Search by color, type, or occasion. Every item shows its auto-detected color and tags.

![Wardrobe](screenshots/wardrobe.png)
![Wardrobe Filtered](screenshots/wardrobe_filtered.png)

---

### 🤖 AI Outfit Recommendation
Tell the AI your occasion and season, and it pulls outfit combinations directly from your wardrobe. It explains *why* the combination works and gives you a personal styling tip.

![Recommend Casual](screenshots/recommend_casual.png)
![Recommend College](screenshots/recommend_college.png)

---

### 🌦️ Weather-Based Suggestions
Enter any city and the app fetches live weather, then shows clothes from your wardrobe that match the season. Quick city shortcuts are available for Delhi, Mumbai, Bangalore, Kanpur, Pune, Chennai, Kolkata, and Hyderabad.

![Weather Mumbai](screenshots/weather_mumbai.png)
![Weather Hyderabad](screenshots/weather_hyderabad.png)

---

### 📊 Analytics Dashboard
A full breakdown of your wardrobe — clothes by category, color distribution, season split, and occasion coverage. Plus a wardrobe score out of 100 that reflects how diverse and outfit-ready your closet is.

![Analytics](screenshots/analytics.png)

---

### 📜 Outfit History
Every AI recommendation you've ever asked for, saved automatically. Great for when you liked an outfit but forgot what it was.

![History](screenshots/history.png)

---

### 📅 Outfit Calendar
Plan your outfits ahead of time. Pick a date, occasion, and season — the AI generates an outfit for that day and saves it to your weekly calendar.

![Calendar](screenshots/calendar.png)
![Calendar Result](screenshots/calendar_result.png)
![Planned Outfits](screenshots/ai_planned_outfits.png)

---

### 👤 Style Profile
Tell the app about your style preferences, body type, and favorite colors — and it uses that context to give you even more personalized recommendations.

- **Style Preference** — Casual, Formal & Professional, Streetwear, Bohemian, Minimalist, Ethnic & Traditional, Sporty & Athletic
- **Body Type** — Slim, Average, Athletic, Curvy, Plus Size

![Profile](screenshots/profile.png)
![Body Type Dropdown](screenshots/dropdown_bodytype.png)

---

### 💬 AI Style Advisor (Chat)
A floating chat widget that's always available when you need it. Ask anything — *"What should I wear for a job interview?"* or *"What colors go with black jeans?"* — and get instant AI fashion advice.

![AI Stylist](screenshots/ai_stylist.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Database | SQLite |
| AI / LLM | Groq API (Llama 3) |
| Color Detection | OpenCV |
| Weather | OpenWeatherMap API |
| Auth | JWT-based (custom) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A Groq API key (free at [console.groq.com](https://console.groq.com))
- An OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org))

---

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/your-username/smart-closet-ai.git
cd smart-closet-ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Add your GROQ_API_KEY and OPENWEATHER_API_KEY in .env

# Run the server
uvicorn main:app --reload
```

The backend will be running at `http://localhost:8000`.

---

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔑 Environment Variables

**Backend `.env`:**
```
GROQ_API_KEY=your_groq_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
SECRET_KEY=your_jwt_secret_key_here
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
```

> ⚠️ Never commit your `.env` files to GitHub. They are already in `.gitignore`.

---

## 📁 Project Structure

```
smart-closet-ai/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── models.py            # Database models
│   ├── routes/              # API route handlers
│   ├── services/            # AI, color detection, weather logic
│   ├── uploads/             # Stored clothing images
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Home, Wardrobe, Upload, Recommend, etc.
│   │   ├── components/      # Navbar, ChatWidget, Cards, etc.
│   │   └── api/             # Axios API calls
│   └── package.json
│
└── screenshots/             # README screenshots
```

---

## 🌟 Features at a Glance

- Upload clothes with auto color detection (OpenCV)
- AI outfit recommendations by occasion + season (Groq / Llama 3)
- Live weather integration → shows matching wardrobe items
- Style profile for personalized recommendations
- Wardrobe analytics with color distribution and category breakdown
- Outfit history — every suggestion saved automatically
- Weekly outfit calendar planner
- Floating AI style advisor chat widget
- JWT-based user authentication

---

## 🙋‍♀️ About

Built by **Aditi** — a third-year BTech student passionate about AI and full-stack development.

This project was built as a portfolio project to demonstrate real-world AI integration, REST API design, and full-stack engineering skills.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
