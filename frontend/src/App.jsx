import { useState } from "react"
import Upload from "./components/Upload"
import Wardrobe from "./components/Wardrobe"
import Recommend from "./components/Recommend"
import Weather from "./components/Weather"
import Analytics from "./components/Analytics"
import History from "./components/History"
import ChatBubble from "./components/ChatBubble"
import OutfitOfTheDay from "./components/OutfitOfTheDay"
import StyleProfile from "./components/StyleProfile"
import OutfitCalendar from "./components/OutfitCalendar"
import "./App.css"

function App() {
  const [activeTab, setActiveTab] = useState("home")
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">SMART<span>CLOSET</span> AI</div>
        <div className="tabs">
          <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "active" : ""}>Home</button>
          <button onClick={() => setActiveTab("wardrobe")} className={activeTab === "wardrobe" ? "active" : ""}>Wardrobe</button>
          <button onClick={() => setActiveTab("upload")} className={activeTab === "upload" ? "active" : ""}>Upload</button>
          <button onClick={() => setActiveTab("recommend")} className={activeTab === "recommend" ? "active" : ""}>Recommend</button>
          <button onClick={() => setActiveTab("weather")} className={activeTab === "weather" ? "active" : ""}>Weather</button>
          <button onClick={() => setActiveTab("analytics")} className={activeTab === "analytics" ? "active" : ""}>Analytics</button>
          <button onClick={() => setActiveTab("history")} className={activeTab === "history" ? "active" : ""}>History</button>
          <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>Profile</button>
          <button onClick={() => setActiveTab("calendar")} className={activeTab === "calendar" ? "active" : ""}>Calendar</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      {activeTab === "home" && (
        <div>
          <div className="hero">
            <div className="hero-left">
              <div className="hero-badge">AI Powered Wardrobe</div>
              <h1>Your <span>AI Smart</span> Closet</h1>
              <p>Organize. Style. Dress Smart with AI. Get outfit recommendations based on weather, occasion, and your personal style.</p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => setActiveTab("wardrobe")}>View Wardrobe</button>
                <button className="btn-secondary" onClick={() => setActiveTab("upload")}>Upload Clothes</button>
              </div>
            </div>
            <div className="hero-right">
              <div className="mannequin">
                <svg className="mannequin-svg" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="14" r="12" fill="rgba(139,92,246,0.3)" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <rect x="22" y="30" width="36" height="42" rx="6" fill="rgba(139,92,246,0.2)" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <rect x="8" y="32" width="14" height="32" rx="5" fill="rgba(139,92,246,0.15)" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <rect x="58" y="32" width="14" height="32" rx="5" fill="rgba(139,92,246,0.15)" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <rect x="24" y="74" width="14" height="38" rx="5" fill="rgba(139,92,246,0.15)" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <rect x="42" y="74" width="14" height="38" rx="5" fill="rgba(139,92,246,0.15)" stroke="#8B5CF6" strokeWidth="1.5"/>
                </svg>
                <div className="mannequin-label">AI Style Advisor</div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stat-card">
              <div style={{fontSize:"11px", color:"#6B7280", marginBottom:"8px"}}>Total Clothes</div>
              <div style={{fontSize:"28px", fontWeight:"700", color:"#E5E4E2"}}>0</div>
              <div style={{fontSize:"11px", color:"#4B5563"}}>items uploaded</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize:"11px", color:"#6B7280", marginBottom:"8px"}}>AI Outfits</div>
              <div style={{fontSize:"28px", fontWeight:"700", color:"#E5E4E2"}}>0</div>
              <div style={{fontSize:"11px", color:"#4B5563"}}>generated</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize:"11px", color:"#6B7280", marginBottom:"8px"}}>Weather</div>
              <div style={{fontSize:"28px", fontWeight:"700", color:"#93C5FD"}}>35°C</div>
              <div style={{fontSize:"11px", color:"#4B5563"}}>Kanpur, IN</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize:"11px", color:"#6B7280", marginBottom:"8px"}}>Style Score</div>
              <div style={{fontSize:"28px", fontWeight:"700", color:"#8B5CF6"}}>0</div>
              <div style={{fontSize:"11px", color:"#4B5563"}}>out of 100</div>
            </div>
          </div>

          {/* OUTFIT OF THE DAY */}
          <OutfitOfTheDay />

        </div>
      )}

      {/* CONTENT */}
      <div className="content">
        {activeTab === "wardrobe" && <Wardrobe refresh={refresh} />}
        {activeTab === "upload" && <Upload onUpload={() => setRefresh(r => r + 1)} />}
        {activeTab === "recommend" && <Recommend />}
        {activeTab === "weather" && <Weather />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "history" && <History />}
        {activeTab === "profile" && <StyleProfile />}
        {activeTab === "calendar" && <OutfitCalendar />}
      </div>

      {/* AI CHAT BUBBLE */}
      <ChatBubble />

    </div>
  
  )
}

export default App