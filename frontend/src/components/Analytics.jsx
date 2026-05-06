import { useState, useEffect } from "react"
import axios from "axios"

function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("https://smart-closet-ai.onrender.com/api/analytics/")
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={styles.card}>
      <p style={{color:"#6B7280"}}>Loading analytics...</p>
    </div>
  )

  if (!data) return (
    <div style={styles.card}>
      <p style={{color:"#6B7280"}}>Failed to load analytics. Is backend running?</p>
    </div>
  )

  const colorMap = {
    red:"#EF4444", blue:"#3B82F6", green:"#22C55E",
    black:"#1F2937", white:"#F9FAFB", yellow:"#EAB308",
    purple:"#8B5CF6", pink:"#EC4899", orange:"#F97316",
    brown:"#92400E", gray:"#6B7280", grey:"#6B7280",
    crimson:"#DC2626", indianred:"#CD5C5C", tan:"#D97706",
    dimgrey:"#6B7280", darkslategrey:"#374151", unknown:"#4B5563"
  }

  const getColor = (name) => {
    if (!name) return "#4B5563"
    const key = name.toLowerCase().replace(/\s/g,"")
    for (let k of Object.keys(colorMap)) {
      if (key.includes(k)) return colorMap[k]
    }
    return "#8B5CF6"
  }

  const maxCat = data.by_category.length > 0
    ? Math.max(...data.by_category.map(c => c.count)) : 1

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>

      {/* Stat Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Clothes</div>
          <div style={styles.statValue}>{data.total_clothes}</div>
          <div style={styles.statSub}>items in wardrobe</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Outfits Generated</div>
          <div style={styles.statValue}>{data.total_recommendations}</div>
          <div style={styles.statSub}>AI recommendations</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Wardrobe Score</div>
          <div style={{...styles.statValue, color:"#8B5CF6"}}>{data.wardrobe_score}</div>
          <div style={styles.statSub}>out of 100</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Colors</div>
          <div style={styles.statValue}>{data.by_color.length}</div>
          <div style={styles.statSub}>unique colors</div>
        </div>
      </div>

      {/* Wardrobe Score Bar */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Wardrobe Score</h3>
        <div style={styles.scoreBarBg}>
          <div style={{
            ...styles.scoreBarFill,
            width: `${Math.min(data.wardrobe_score, 100)}%`
          }}></div>
        </div>
        <p style={{fontSize:"12px", color:"#6B7280", marginTop:"8px"}}>
          {data.wardrobe_score < 30 ? "Add more clothes to improve your score!" :
           data.wardrobe_score < 60 ? "Good start! Keep adding more variety." :
           data.wardrobe_score < 80 ? "Great wardrobe! Try generating more outfits." :
           "Excellent wardrobe! You are a style pro!"}
        </p>
      </div>

      {/* Category Chart */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Clothes by Category</h3>
        {data.by_category.length === 0 ? (
          <p style={{color:"#6B7280", fontSize:"13px"}}>No clothes uploaded yet!</p>
        ) : (
          <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
            {data.by_category.map(item => (
              <div key={item.category}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}>
                  <span style={{fontSize:"13px", color:"#C0C0C0", textTransform:"capitalize"}}>{item.category}</span>
                  <span style={{fontSize:"13px", color:"#8B5CF6"}}>{item.count}</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: `${(item.count / maxCat) * 100}%`
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color Distribution */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Color Distribution</h3>
        {data.by_color.length === 0 ? (
          <p style={{color:"#6B7280", fontSize:"13px"}}>No colors detected yet!</p>
        ) : (
          <div style={{display:"flex", flexWrap:"wrap", gap:"10px"}}>
            {data.by_color.map(item => (
              <div key={item.color} style={{
                display:"flex", alignItems:"center", gap:"8px",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:"20px", padding:"6px 14px"
              }}>
                <div style={{
                  width:"12px", height:"12px", borderRadius:"50%",
                  background: getColor(item.color),
                  border:"1px solid rgba(255,255,255,0.2)",
                  flexShrink:0
                }}></div>
                <span style={{fontSize:"12px", color:"#C0C0C0", textTransform:"capitalize"}}>{item.color}</span>
                <span style={{fontSize:"12px", color:"#6B7280"}}>×{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Season + Occasion Row */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}}>

        {/* Season Breakdown */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>By Season</h3>
          {data.by_season.length === 0 ? (
            <p style={{color:"#6B7280", fontSize:"13px"}}>No data yet!</p>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {data.by_season.map(item => {
                const icons = {summer:"☀️", winter:"❄️", spring:"🌸"}
                return (
                  <div key={item.season} style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <span style={{fontSize:"13px", color:"#C0C0C0", textTransform:"capitalize"}}>
                      {icons[item.season] || "🍂"} {item.season}
                    </span>
                    <span style={{
                      background:"rgba(139,92,246,0.15)",
                      border:"1px solid rgba(139,92,246,0.3)",
                      color:"#A78BFA", fontSize:"12px",
                      padding:"2px 10px", borderRadius:"10px"
                    }}>{item.count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Occasion Breakdown */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>By Occasion</h3>
          {data.by_occasion.length === 0 ? (
            <p style={{color:"#6B7280", fontSize:"13px"}}>No data yet!</p>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {data.by_occasion.map(item => {
                const icons = {casual:"👟", college:"🎒", formal:"👔", party:"🎉"}
                return (
                  <div key={item.occasion} style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <span style={{fontSize:"13px", color:"#C0C0C0", textTransform:"capitalize"}}>
                      {icons[item.occasion] || "✨"} {item.occasion}
                    </span>
                    <span style={{
                      background:"rgba(232,121,249,0.1)",
                      border:"1px solid rgba(232,121,249,0.25)",
                      color:"#F0ABFC", fontSize:"12px",
                      padding:"2px 10px", borderRadius:"10px"
                    }}>{item.count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

const styles = {
  card: {
    background:"rgba(31,40,51,0.6)",
    border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"16px",
    padding:"20px",
    backdropFilter:"blur(10px)"
  },
  cardTitle: {
    fontSize:"14px",
    fontWeight:"500",
    color:"#C0C0C0",
    marginBottom:"16px",
    letterSpacing:"0.5px"
  },
  statsRow: {
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))",
    gap:"12px"
  },
  statCard: {
    background:"rgba(31,40,51,0.6)",
    border:"1px solid rgba(139,92,246,0.2)",
    borderRadius:"12px",
    padding:"16px",
    borderLeft:"3px solid #8B5CF6"
  },
  statLabel: {fontSize:"11px", color:"#6B7280", marginBottom:"8px", letterSpacing:"0.5px"},
  statValue: {fontSize:"28px", fontWeight:"700", color:"#E5E4E2", marginBottom:"4px"},
  statSub: {fontSize:"11px", color:"#4B5563"},
  scoreBarBg: {
    background:"rgba(255,255,255,0.05)",
    borderRadius:"10px", height:"10px",
    overflow:"hidden"
  },
  scoreBarFill: {
    height:"100%", borderRadius:"10px",
    background:"linear-gradient(90deg, #8B5CF6, #E879F9)",
    transition:"width 1s ease"
  },
  barBg: {
    background:"rgba(255,255,255,0.05)",
    borderRadius:"6px", height:"6px", overflow:"hidden"
  },
  barFill: {
    height:"100%", borderRadius:"6px",
    background:"linear-gradient(90deg, #8B5CF6, #3B82F6)",
    transition:"width 0.8s ease"
  }
}

export default Analytics