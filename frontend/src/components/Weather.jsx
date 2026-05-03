import { useState } from "react"
import axios from "axios"

function Weather() {
  const [city, setCity] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getWeather = async () => {
    if (!city.trim()) return setError("Please enter a city name!")
    setLoading(true)
    setData(null)
    setError("")
    try {
      const res = await axios.get("https://smart-closet-ai-backend.onrender.com/api/weather/", {
        params: { city }
      })
      if (res.data.error) {
        setError(res.data.error)
      } else {
        setData(res.data)
      }
    } catch (err) {
      setError("Failed to get weather. Is backend running?")
    }
    setLoading(false)
  }

  const getWeatherIcon = (description) => {
    if (!description) return "🌤️"
    if (description.includes("clear")) return "☀️"
    if (description.includes("cloudy")) return "⛅"
    if (description.includes("rain")) return "🌧️"
    if (description.includes("snow")) return "❄️"
    if (description.includes("thunder")) return "⛈️"
    return "🌤️"
  }

  const getTempColor = (temp) => {
    if (temp >= 35) return "#EF4444"
    if (temp >= 25) return "#F97316"
    if (temp >= 15) return "#EAB308"
    return "#3B82F6"
  }

  const getSeasonAdvice = (temp, description) => {
    if (description && description.includes("rain"))
      return "Carry an umbrella! Wear waterproof shoes and avoid light colors."
    if (temp >= 35)
      return "Very hot! Wear light, breathable fabrics like cotton or linen."
    if (temp >= 25)
      return "Warm weather! Light clothing recommended."
    if (temp >= 15)
      return "Mild weather! A light jacket would be perfect."
    return "Cold weather! Layer up with warm clothes."
  }

  // Popular Indian cities for quick select
  const popularCities = ["Delhi", "Mumbai", "Bangalore", "Kanpur", "Pune", "Chennai", "Kolkata", "Hyderabad"]

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>

      {/* Search Card */}
      <div className="card">
        <h2>Weather Based Suggestion</h2>
        <p style={{fontSize:"13px", color:"#6B7280", marginBottom:"16px"}}>
          Enter any city to get real-time weather and outfit suggestions
        </p>

        {/* City Input */}
        <div style={{display:"flex", gap:"10px", marginBottom:"12px"}}>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === "Enter" && getWeather()}
            placeholder="Type any city (e.g. Pune, Delhi, Mumbai...)"
            style={{flex:1}}
          />
          <button
            onClick={getWeather}
            disabled={loading}
            style={{whiteSpace:"nowrap", padding:"10px 20px"}}
          >
            {loading ? "Fetching..." : "Get Weather"}
          </button>
        </div>

        {/* Quick city buttons */}
        <div style={{display:"flex", flexWrap:"wrap", gap:"8px"}}>
          {popularCities.map(c => (
            <button
              key={c}
              onClick={() => { setCity(c); }}
              style={{
                background: city === c
                  ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                  : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: city === c ? "white" : "#9CA3AF",
                fontSize:"12px",
                padding:"6px 14px",
                borderRadius:"20px",
                cursor:"pointer",
                boxShadow:"none"
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {error && (
          <p style={{color:"#EF4444", fontSize:"13px", marginTop:"12px"}}>
            {error}
          </p>
        )}
      </div>

      {/* Weather Result */}
      {data && (
        <>
          {/* Weather Info Card */}
          <div style={{
            background:"rgba(59,130,246,0.08)",
            border:"1px solid rgba(59,130,246,0.2)",
            borderRadius:"20px",
            padding:"24px",
            backdropFilter:"blur(20px)"
          }}>
            <div style={{display:"flex", alignItems:"center", gap:"16px", marginBottom:"16px"}}>
              <div style={{fontSize:"48px"}}>
                {getWeatherIcon(data.description)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"13px", color:"#6B7280", marginBottom:"4px"}}>
                  {data.city}{data.country ? `, ${data.country}` : ""}
                </div>
                <div style={{
                  fontSize:"42px",
                  fontWeight:"700",
                  color: getTempColor(data.temp),
                  lineHeight:1
                }}>
                  {data.temp}°C
                </div>
                <div style={{fontSize:"13px", color:"#9CA3AF", marginTop:"4px", textTransform:"capitalize"}}>
                  {data.description}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{
                  background:"rgba(139,92,246,0.15)",
                  border:"1px solid rgba(139,92,246,0.3)",
                  color:"#A78BFA",
                  fontSize:"12px",
                  padding:"6px 14px",
                  borderRadius:"20px",
                  marginBottom:"8px"
                }}>
                  {data.season}
                </div>
                <div style={{fontSize:"12px", color:"#6B7280"}}>
                  Feels like {data.feels_like}°C
                </div>
              </div>
            </div>

            {/* Style advice */}
            <div style={{
              background:"rgba(0,0,0,0.2)",
              borderRadius:"12px",
              padding:"12px 16px",
              fontSize:"13px",
              color:"#C0C0C0"
            }}>
              💡 {getSeasonAdvice(data.temp, data.description)}
            </div>
          </div>

          {/* Outfit Suggestions */}
          {data.available_clothes && data.available_clothes.length > 0 ? (
            <div className="card">
              <h2>
                Suggested Outfits for {data.city}
              </h2>
              <p style={{fontSize:"13px", color:"#6B7280", marginBottom:"16px"}}>
                {data.suggestion}
              </p>
              <div className="clothes-grid">
                {data.available_clothes.map(cloth => (
                  <div key={cloth.id} className="cloth-card">
                    <img
                      src={`https://smart-closet-ai-backend.onrender.com/uploads/${cloth.filename}`}
                      alt={cloth.subcategory || cloth.category}
                    />
                    <div style={{
                      display:"inline-block",
                      background:"rgba(139,92,246,0.15)",
                      border:"1px solid rgba(139,92,246,0.3)",
                      color:"#A78BFA",
                      fontSize:"10px",
                      padding:"2px 8px",
                      borderRadius:"10px",
                      marginBottom:"4px"
                    }}>
                      {cloth.subcategory || cloth.category}
                    </div>
                    <div style={{display:"flex", alignItems:"center", gap:"4px", justifyContent:"center"}}>
                      <div style={{
                        width:"8px", height:"8px", borderRadius:"50%",
                        background: cloth.color,
                        border:"1px solid rgba(255,255,255,0.2)"
                      }}></div>
                      <p style={{fontSize:"11px"}}>{cloth.color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <p style={{color:"#6B7280", fontSize:"14px", textAlign:"center", padding:"20px"}}>
                No clothes found for {data.season} season. Upload some clothes first!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Weather