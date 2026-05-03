import { useState, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from 'react-markdown'

function OutfitOfTheDay() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("https://smart-closet-ai-backend.onrender.com/api/recommend/outfit-of-the-day")
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>☀️</div>
        <div>
          <div style={styles.title}>Outfit of the Day</div>
          <div style={styles.subtitle}>Loading today's recommendation...</div>
        </div>
      </div>
      <div style={styles.skeleton}></div>
    </div>
  )

  if (!data) return null

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>☀️</div>
        <div style={{flex:1}}>
          <div style={styles.title}>Outfit of the Day</div>
          <div style={styles.subtitle}>
            {new Date().toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long'})}
          </div>
        </div>
        <div style={styles.weatherBadge}>
          {data.temp}°C · {data.season}
        </div>
      </div>

      <div style={styles.recommendation}>
        <ReactMarkdown>{data.recommendation}</ReactMarkdown>
      </div>

      {data.cached && (
        <div style={styles.cachedNote}>
          Today's outfit already generated
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(232,121,249,0.08))",
    border: "1px solid rgba(139,92,246,0.3)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    backdropFilter: "blur(20px)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px"
  },
  icon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "rgba(139,92,246,0.2)",
    border: "1px solid rgba(139,92,246,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0
  },
  title: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#C0C0C0",
    marginBottom: "3px"
  },
  subtitle: {
    fontSize: "12px",
    color: "#6B7280"
  },
  weatherBadge: {
    background: "rgba(59,130,246,0.15)",
    border: "1px solid rgba(59,130,246,0.25)",
    color: "#93C5FD",
    fontSize: "12px",
    padding: "6px 12px",
    borderRadius: "20px",
    whiteSpace: "nowrap"
  },
  recommendation: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "14px",
    padding: "16px",
    fontSize: "13px",
    color: "#C0C0C0",
    lineHeight: "1.8"
  },
  cachedNote: {
    fontSize: "11px",
    color: "#4ADE80",
    marginTop: "10px",
    textAlign: "right"
  },
  skeleton: {
    height: "80px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "14px"
  }
}

export default OutfitOfTheDay