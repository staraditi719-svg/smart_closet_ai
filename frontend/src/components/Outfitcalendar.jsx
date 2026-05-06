import { useState, useEffect } from "react"
import axios from "axios"

function OutfitCalendar() {
  const [calendar, setCalendar] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [occasion, setOccasion] = useState("casual")
  const [season, setSeason] = useState("summer")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [recommendation, setRecommendation] = useState("")

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    fetchCalendar()
    setSelectedDate(today)
  }, [])

  const fetchCalendar = async () => {
    try {
      const res = await axios.get("https://smart-closet-ai.onrender.com/api/calendar/")
      setCalendar(res.data)
    } catch {}
  }

  const planOutfit = async () => {
    if (!selectedDate) return setMessage("Please select a date!")
    setLoading(true)
    setRecommendation("")
    setMessage("")
    try {
      const res = await axios.post("https://smart-closet-ai.onrender.com/api/calendar/plan", null, {
        params: { date_str: selectedDate, occasion, season, note }
      })
      setMessage(res.data.message)
      setRecommendation(res.data.recommendation || "")
      fetchCalendar()
    } catch {
      setMessage("Failed to plan outfit!")
    }
    setLoading(false)
  }

  const deletePlan = async (dateStr) => {
    try {
      await axios.delete(`https://smart-closet-ai.onrender.com/api/calendar/${dateStr}`)
      fetchCalendar()
    } catch {}
  }

  // Get next 7 days
  const next7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split("T")[0]
  })

  const getCalendarEntry = (dateStr) => {
    return calendar.find(c => c.date === dateStr)
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {weekday:'short', day:'numeric', month:'short'})
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>

      {/* WEEK VIEW */}
      <div className="card">
        <h2>This Week</h2>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(7, 1fr)",
          gap:"8px",
          marginBottom:"8px"
        }}>
          {next7Days.map(dateStr => {
            const entry = getCalendarEntry(dateStr)
            const isToday = dateStr === today
            const isSelected = dateStr === selectedDate
            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                    : entry
                    ? "rgba(139,92,246,0.15)"
                    : "rgba(255,255,255,0.04)",
                  border: isToday
                    ? "1px solid #8B5CF6"
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius:"12px",
                  padding:"10px 6px",
                  textAlign:"center",
                  cursor:"pointer",
                  transition:"all 0.2s"
                }}
              >
                <div style={{fontSize:"10px", color: isSelected ? "white" : "#6B7280", marginBottom:"4px"}}>
                  {new Date(dateStr).toLocaleDateString('en-IN', {weekday:'short'})}
                </div>
                <div style={{fontSize:"16px", fontWeight:"600", color: isSelected ? "white" : "#C0C0C0"}}>
                  {new Date(dateStr).getDate()}
                </div>
                {entry && (
                  <div style={{
                    width:"6px", height:"6px", borderRadius:"50%",
                    background: isSelected ? "white" : "#8B5CF6",
                    margin:"4px auto 0"
                  }}></div>
                )}
                {isToday && !isSelected && (
                  <div style={{fontSize:"8px", color:"#8B5CF6", marginTop:"2px"}}>Today</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* PLAN OUTFIT */}
      <div className="card">
        <h2>Plan Outfit</h2>
        <p style={{fontSize:"13px", color:"#6B7280", marginBottom:"16px"}}>
          Selected: <span style={{color:"#A78BFA"}}>{formatDate(selectedDate)}</span>
        </p>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px"}}>
          <div>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                width:"100%",
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:"10px",
                color:"#E5E4E2",
                fontFamily:"Outfit,sans-serif",
                fontSize:"14px",
                padding:"10px 14px"
              }}
            />
          </div>
          <div>
            <label style={styles.label}>Occasion</label>
            <select value={occasion} onChange={e => setOccasion(e.target.value)}>
              <option value="casual">Casual</option>
              <option value="college">College</option>
              <option value="formal">Formal</option>
              <option value="party">Party</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Season</label>
            <select value={season} onChange={e => setSeason(e.target.value)}>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. Office presentation"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        <button onClick={planOutfit} disabled={loading} style={{width:"100%"}}>
          {loading ? "Planning your outfit..." : "Plan Outfit with AI"}
        </button>

        {message && (
          <p style={{fontSize:"13px", color:"#4ADE80", marginTop:"10px"}}>{message}</p>
        )}

        {recommendation && (
          <div className="recommendation" style={{marginTop:"12px"}}>
            {recommendation}
          </div>
        )}
      </div>

      {/* PLANNED OUTFITS LIST */}
      {calendar.length > 0 && (
        <div className="card">
          <h2>Planned Outfits ({calendar.length})</h2>
          <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
            {calendar.map(item => (
              <div key={item.id} style={{
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:"14px",
                padding:"16px",
                display:"flex",
                gap:"14px",
                alignItems:"flex-start"
              }}>
                {/* Date box */}
                <div style={{
                  background:"rgba(139,92,246,0.2)",
                  border:"1px solid rgba(139,92,246,0.3)",
                  borderRadius:"10px",
                  padding:"8px 12px",
                  textAlign:"center",
                  flexShrink:0,
                  minWidth:"60px"
                }}>
                  <div style={{fontSize:"10px", color:"#A78BFA"}}>
                    {new Date(item.date).toLocaleDateString('en-IN', {month:'short'})}
                  </div>
                  <div style={{fontSize:"22px", fontWeight:"700", color:"#C0C0C0"}}>
                    {new Date(item.date).getDate()}
                  </div>
                </div>

                {/* Content */}
                <div style={{flex:1}}>
                  <div style={{display:"flex", gap:"8px", marginBottom:"8px", flexWrap:"wrap"}}>
                    <span style={styles.badge}>{item.occasion}</span>
                    <span style={styles.badge}>{item.season}</span>
                    {item.note && (
                      <span style={{...styles.badge, background:"rgba(59,130,246,0.1)", borderColor:"rgba(59,130,246,0.25)", color:"#93C5FD"}}>
                        {item.note}
                      </span>
                    )}
                  </div>
                  <p style={{fontSize:"13px", color:"#9CA3AF", lineHeight:"1.6"}}>
                    {item.recommendation}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deletePlan(item.date)}
                  style={{
                    background:"rgba(239,68,68,0.1)",
                    border:"1px solid rgba(239,68,68,0.25)",
                    color:"#FCA5A5",
                    fontSize:"11px",
                    padding:"6px 10px",
                    borderRadius:"8px",
                    flexShrink:0
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
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
  },
  badge: {
    background:"rgba(139,92,246,0.15)",
    border:"1px solid rgba(139,92,246,0.3)",
    color:"#A78BFA",
    fontSize:"11px",
    padding:"3px 10px",
    borderRadius:"20px"
  }
}

export default OutfitCalendar