import "./landingpage.css"

function LandingPage({ onGetStarted, onLogin, onExplore }) {

  const features = [
    { icon: "👗", title: "Smart Wardrobe", desc: "Upload clothes and AI automatically detects color using OpenCV computer vision. Search and filter instantly." },
    { icon: "🤖", title: "AI Outfit Recommendations", desc: "Get personalized outfit suggestions based on occasion, season and your personal style profile." },
    { icon: "🌤️", title: "Weather Based Styling", desc: "Type any city and get real-time weather. App suggests outfits perfect for today's temperature." },
    { icon: "☀️", title: "Outfit of the Day", desc: "Every morning get one perfect outfit suggestion automatically based on today's weather." },
    { icon: "📅", title: "Outfit Calendar", desc: "Plan your outfits for the week ahead. AI generates outfit plans for each day." },
    { icon: "📊", title: "Analytics Dashboard", desc: "See your wardrobe score, color distribution and most worn categories." },
  ]

  return (
    <div className="lp">

      {/* NAVBAR */}
      <nav className="lp-nav">
        <div className="lp-logo">SMART<span>CLOSET</span> AI</div>
        <div className="lp-nav-btns">
          <button className="lp-btn-login" onClick={onLogin}>Login</button>
          <button className="lp-btn-signup" onClick={onGetStarted}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="lp-hero">
        <div className="lp-badge">AI POWERED WARDROBE</div>
        <h1>Your Personal <span>AI Style Advisor</span></h1>
        <p>Upload your clothes, get AI outfit recommendations based on weather, occasion and your personal style. Never wonder what to wear again.</p>
        <div className="lp-hero-btns">
          <button className="lp-btn-primary" onClick={onGetStarted}>Get Started Free</button>
          <button className="lp-btn-secondary" onClick={onExplore}>Explore App</button>
        </div>
      </div>

      {/* STATS */}
      <div className="lp-stats">
        <div className="lp-stat"><div className="lp-stat-num">100%</div><div className="lp-stat-label">Free to use</div></div>
        <div className="lp-stat"><div className="lp-stat-num">AI</div><div className="lp-stat-label">Powered by Groq</div></div>
        <div className="lp-stat"><div className="lp-stat-num">OpenCV</div><div className="lp-stat-label">Color Detection</div></div>
        <div className="lp-stat"><div className="lp-stat-num">Real-time</div><div className="lp-stat-label">Weather Data</div></div>
      </div>

      {/* FEATURES */}
      <div className="lp-features">
        {features.map((f, i) => (
          <div key={i} className="lp-feature-card">
            <div className="lp-feature-icon">{f.icon}</div>
            <div className="lp-feature-title">{f.title}</div>
            <div className="lp-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="lp-cta">
        <h2>Ready to dress smarter?</h2>
        <p>Let AI transform the way you get dressed every morning.</p>
        <button className="lp-btn-primary" onClick={onGetStarted}>Create Free Account</button>
      </div>

    </div>
  )
}

export default LandingPage