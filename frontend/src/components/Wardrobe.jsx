import { useEffect, useState } from "react"
import axios from "axios"

function Wardrobe({ refresh }) {
  const [clothes, setClothes] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterMain, setFilterMain] = useState("all")
  const [filterOccasion, setFilterOccasion] = useState("all")
  const [filterSeason, setFilterSeason] = useState("all")

  const fetchClothes = async () => {
    try {
      const res = await axios.get("https://smart-closet-ai.onrender.com/api/wardrobe/all")
      setClothes(res.data)
      setFiltered(res.data)
    } catch (err) {
      console.error("Failed to fetch clothes")
    }
    setLoading(false)
  }

  const deleteCloth = async (id) => {
    try {
      await axios.delete(`https://smart-closet-ai.onrender.com/api/wardrobe/${id}`)
      fetchClothes()
    } catch (err) {
      console.error("Failed to delete")
    }
  }

  useEffect(() => {
    fetchClothes()
  }, [refresh])

  useEffect(() => {
    let result = clothes

    if (search.trim()) {
      result = result.filter(c =>
        (c.subcategory || c.category || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.main_category || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.color || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.occasion || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.season || "").toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filterMain !== "all") {
      result = result.filter(c => (c.main_category || c.category) === filterMain)
    }

    if (filterOccasion !== "all") {
      result = result.filter(c => c.occasion === filterOccasion)
    }

    if (filterSeason !== "all") {
      result = result.filter(c => c.season === filterSeason)
    }

    setFiltered(result)
  }, [search, filterMain, filterOccasion, filterSeason, clothes])

  const clearFilters = () => {
    setSearch("")
    setFilterMain("all")
    setFilterOccasion("all")
    setFilterSeason("all")
  }

  const mainCategoryIcons = {
    upper: "👕",
    bottom: "👖",
    fullbody: "👗",
    footwear: "👟",
    accessory: "👜"
  }

  if (loading) return (
    <div className="card">
      <p style={{color:"#6B7280"}}>Loading wardrobe...</p>
    </div>
  )

  return (
    <div className="card">
      <h2>My Wardrobe ({filtered.length} items)</h2>

      {/* SEARCH BAR */}
      <div style={{marginBottom:"16px"}}>
        <input
          type="text"
          placeholder="Search by color, type, occasion..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr 1fr auto",
        gap:"10px",
        marginBottom:"16px"
      }}>
        <select value={filterMain} onChange={e => setFilterMain(e.target.value)}>
          <option value="all">All Types</option>
          <option value="upper">Upper Body</option>
          <option value="bottom">Bottom</option>
          <option value="fullbody">Full Body</option>
          <option value="footwear">Footwear</option>
          <option value="accessory">Accessories</option>
        </select>

        <select value={filterOccasion} onChange={e => setFilterOccasion(e.target.value)}>
          <option value="all">All Occasions</option>
          <option value="casual">Casual</option>
          <option value="college">College</option>
          <option value="formal">Formal</option>
          <option value="party">Party</option>
          <option value="wedding">Wedding</option>
          <option value="sports">Sports</option>
          <option value="beach">Beach</option>
        </select>

        <select value={filterSeason} onChange={e => setFilterSeason(e.target.value)}>
          <option value="all">All Seasons</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="spring">Spring</option>
          <option value="all">All Seasons</option>
        </select>

        <button
          onClick={clearFilters}
          style={{
            background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.15)",
            color:"#9CA3AF",
            fontSize:"12px",
            padding:"8px 14px",
            borderRadius:"10px",
            cursor:"pointer",
            whiteSpace:"nowrap",
            boxShadow:"none"
          }}
        >
          Clear
        </button>
      </div>

      {/* ACTIVE FILTER BADGES */}
      {(search || filterMain !== "all" || filterOccasion !== "all" || filterSeason !== "all") && (
        <div style={{display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px"}}>
          {search && <span style={styles.badge}>Search: "{search}"</span>}
          {filterMain !== "all" && <span style={styles.badge}>{filterMain}</span>}
          {filterOccasion !== "all" && <span style={styles.badge}>{filterOccasion}</span>}
          {filterSeason !== "all" && <span style={styles.badge}>{filterSeason}</span>}
        </div>
      )}

      {/* CLOTHES GRID */}
      {filtered.length === 0 ? (
        <div style={{textAlign:"center", padding:"40px", color:"#6B7280", fontSize:"14px"}}>
          {clothes.length === 0
            ? "No clothes yet! Go to Upload tab to add some."
            : "No clothes match your search. Try different filters!"}
        </div>
      ) : (
        <div className="clothes-grid">
          {filtered.map(cloth => {
            const mainCat = cloth.main_category || "upper"
            const subCat = cloth.subcategory || cloth.category || "unknown"
            const icon = mainCategoryIcons[mainCat] || "👗"

            return (
              <div key={cloth.id} className="cloth-card">
                <img
                  src={`https://smart-closet-ai.onrender.com/uploads/${cloth.filename}`}
                  alt={subCat}
                />

                {/* Category badges */}
                <div style={{display:"flex", gap:"4px", justifyContent:"center", flexWrap:"wrap", marginBottom:"6px"}}>
                  <span style={{...styles.badge, fontSize:"10px"}}>
                    {icon} {mainCat}
                  </span>
                  <span style={{...styles.badge, fontSize:"10px", background:"rgba(232,121,249,0.1)", borderColor:"rgba(232,121,249,0.3)", color:"#F0ABFC"}}>
                    {subCat}
                  </span>
                </div>

                {/* Color */}
                <div style={{display:"flex", alignItems:"center", gap:"6px", justifyContent:"center", marginBottom:"4px"}}>
                  <div style={{
                    width:"10px", height:"10px", borderRadius:"50%",
                    background: cloth.color,
                    border:"1px solid rgba(255,255,255,0.2)",
                    flexShrink:0
                  }}></div>
                  <p style={{fontSize:"12px"}}>{cloth.color}</p>
                </div>

                <p style={{fontSize:"11px", color:"#6B7280", marginBottom:"8px"}}>
                  {cloth.season} · {cloth.occasion}
                </p>

                <button
                  onClick={() => deleteCloth(cloth.id)}
                  style={{
                    background:"rgba(239,68,68,0.15)",
                    border:"1px solid rgba(239,68,68,0.3)",
                    color:"#FCA5A5",
                    fontSize:"12px",
                    padding:"6px 14px",
                    borderRadius:"8px",
                    width:"100%",
                    boxShadow:"none"
                  }}
                >
                  Delete
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  badge: {
    background:"rgba(139,92,246,0.15)",
    border:"1px solid rgba(139,92,246,0.3)",
    color:"#A78BFA",
    fontSize:"11px",
    padding:"3px 8px",
    borderRadius:"20px"
  }
}

export default Wardrobe
