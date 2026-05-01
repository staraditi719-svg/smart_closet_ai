import { useState } from "react"
import axios from "axios"
import ReactMarkdown from 'react-markdown'

function Recommend() {
  const [occasion, setOccasion] = useState("casual")
  const [season, setSeason] = useState("summer")
  const [recommendation, setRecommendation] = useState("")
  const [loading, setLoading] = useState(false)

  const getRecommendation = async () => {
    setLoading(true)
    setRecommendation("")
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/recommend/", {
        params: { occasion, season }
      })
      setRecommendation(res.data.recommendation)
    } catch (err) {
      setRecommendation("Failed to get recommendation. Is backend running?")
    }
    setLoading(false)
  }

  return (
    <div className="card">
      <h2>AI Outfit Recommendation</h2>

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

      <button onClick={getRecommendation} disabled={loading}>
        {loading ? "Getting recommendation..." : "Get Outfit Recommendation"}
      </button>

      {recommendation && (
        <div className="recommendation">
          <ReactMarkdown>{recommendation}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default Recommend