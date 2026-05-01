import { useState, useEffect } from "react"
import axios from "axios"

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/recommend/history")
      .then(res => {
        setHistory(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="card"><p>Loading history...</p></div>

  if (history.length === 0) return (
    <div className="card">
      <h2>Outfit History</h2>
      <p>No recommendations yet! Go to Recommend tab first.</p>
    </div>
  )

  return (
    <div className="card">
      <h2>Outfit History ({history.length})</h2>
      {history.map(item => (
        <div key={item.id} className="recommendation" style={{ marginBottom: "15px" }}>
          <p style={{ color: "#c084fc", marginBottom: "8px" }}>
            {item.occasion} • {item.season} • {new Date(item.created_at).toLocaleDateString()}
          </p>
          <p>{item.recommendation}</p>
        </div>
      ))}
    </div>
  )
}

export default History