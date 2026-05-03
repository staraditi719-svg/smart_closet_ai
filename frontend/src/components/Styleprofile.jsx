import { useState, useEffect } from "react"
import axios from "axios"

function StyleProfile() {
  const [profile, setProfile] = useState({
    name: "", age: "", gender: "female",
    style_preference: "casual", favorite_colors: "", body_type: "average"
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState("")
  const [recLoading, setRecLoading] = useState(false)
  const [occasion, setOccasion] = useState("casual")
  const [season, setSeason] = useState("summer")

  useEffect(() => {
    axios.get("https://smart-closet-ai-backend.onrender.com/api/profile/")
      .then(res => {
        if (res.data && res.data.name) setProfile(res.data)
      })
      .catch(() => {})
  }, [])

  const saveProfile = async () => {
    setLoading(true)
    try {
      await axios.post("https://smart-closet-ai-backend.onrender.com/api/profile/save", null, {
        params: profile
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Failed to save profile")
    }
    setLoading(false)
  }

  const getPersonalizedRec = async () => {
    setRecLoading(true)
    setRecommendation("")
    try {
      const res = await axios.get("https://smart-closet-ai-backend.onrender.com/api/profile/recommend", {
        params: { occasion, season }
      })
      setRecommendation(res.data.recommendation)
    } catch {
      setRecommendation("Failed to get recommendation!")
    }
    setRecLoading(false)
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>

      {/* PROFILE CARD */}
      <div className="card">
        <h2>Style Profile</h2>
        <p style={{fontSize:"13px", color:"#6B7280", marginBottom:"20px"}}>
          Tell us about yourself so AI can give personalized recommendations!
        </p>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px"}}>

          <div>
            <label style={styles.label}>Your Name</label>
            <input
              type="text"
              placeholder="e.g. Aditi"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>

          <div>
            <label style={styles.label}>Age</label>
            <input
              type="text"
              placeholder="e.g. 20"
              value={profile.age}
              onChange={e => setProfile({...profile, age: e.target.value})}
            />
          </div>

          <div>
            <label style={styles.label}>Gender</label>
            <select
              value={profile.gender}
              onChange={e => setProfile({...profile, gender: e.target.value})}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Style Preference</label>
            <select
              value={profile.style_preference}
              onChange={e => setProfile({...profile, style_preference: e.target.value})}
            >
              <option value="casual">Casual</option>
              <option value="formal">Formal & Professional</option>
              <option value="streetwear">Streetwear</option>
              <option value="bohemian">Bohemian</option>
              <option value="minimalist">Minimalist</option>
              <option value="ethnic">Ethnic & Traditional</option>
              <option value="sporty">Sporty & Athletic</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Favorite Colors</label>
            <input
              type="text"
              placeholder="e.g. black, white, blue"
              value={profile.favorite_colors}
              onChange={e => setProfile({...profile, favorite_colors: e.target.value})}
            />
          </div>

          <div>
            <label style={styles.label}>Body Type</label>
            <select
              value={profile.body_type}
              onChange={e => setProfile({...profile, body_type: e.target.value})}
            >
              <option value="slim">Slim</option>
              <option value="average">Average</option>
              <option value="athletic">Athletic</option>
              <option value="curvy">Curvy</option>
              <option value="plus">Plus Size</option>
            </select>
          </div>

        </div>

        <button
          onClick={saveProfile}
          disabled={loading}
          style={{marginTop:"20px", width:"100%"}}
        >
          {loading ? "Saving..." : saved ? "✅ Profile Saved!" : "Save Profile"}
        </button>
      </div>

      {/* PERSONALIZED RECOMMENDATION */}
      <div className="card">
        <h2>Personalized AI Recommendation</h2>
        <p style={{fontSize:"13px", color:"#6B7280", marginBottom:"16px"}}>
          Get outfit suggestions tailored specifically for you!
        </p>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px"}}>
          <select value={occasion} onChange={e => setOccasion(e.target.value)}>
            <option value="casual">Casual</option>
            <option value="college">College</option>
            <option value="formal">Formal</option>
            <option value="party">Party</option>
          </select>
          <select value={season} onChange={e => setSeason(e.target.value)}>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
          </select>
        </div>

        <button onClick={getPersonalizedRec} disabled={recLoading} style={{width:"100%"}}>
          {recLoading ? "Getting your personalized outfit..." : "Get My Personalized Outfit"}
        </button>

        {recommendation && (
          <div className="recommendation" style={{marginTop:"16px"}}>
            {recommendation}
          </div>
        )}
      </div>

    </div>
  )
}

const styles = {
  label: {
    display:"block",
    fontSize:"11px",
    color:"#6B7280",
    marginBottom:"6px",
    letterSpacing:"0.5px",
    textTransform:"uppercase"
  }
}

export default StyleProfile