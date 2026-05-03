import { useState } from "react"
import axios from "axios"

function Upload({ onUpload }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mainCategory, setMainCategory] = useState("upper")
  const [subcategory, setSubcategory] = useState("tshirt")
  const [occasion, setOccasion] = useState("casual")
  const [season, setSeason] = useState("summer")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const categorySystem = {
    upper: {
      label: "Upper Body",
      icon: "👕",
      subs: [
        { value: "tshirt", label: "T-Shirt" },
        { value: "shirt", label: "Shirt" },
        { value: "top", label: "Top / Crop Top" },
        { value: "hoodie", label: "Hoodie / Sweater" },
        { value: "blouse", label: "Blouse" },
        { value: "tank", label: "Tank Top" },
      ]
    },
    bottom: {
      label: "Bottom",
      icon: "👖",
      subs: [
        { value: "jeans", label: "Jeans" },
        { value: "pants", label: "Pants / Trousers" },
        { value: "skirt", label: "Skirt" },
        { value: "shorts", label: "Shorts" },
        { value: "leggings", label: "Leggings" },
      ]
    },
    fullbody: {
      label: "Full Body",
      icon: "👗",
      subs: [
        { value: "dress", label: "Dress" },
        { value: "frock", label: "Frock" },
        { value: "onepiece", label: "One-Piece" },
        { value: "jumpsuit", label: "Jumpsuit" },
        { value: "gown", label: "Gown" },
        { value: "saree", label: "Saree" },
        { value: "kurta", label: "Kurta / Kurti" },
      ]
    },
    footwear: {
      label: "Footwear",
      icon: "👟",
      subs: [
        { value: "shoes", label: "Shoes" },
        { value: "sneakers", label: "Sneakers" },
        { value: "sandals", label: "Sandals / Slippers" },
        { value: "heels", label: "Heels" },
        { value: "boots", label: "Boots" },
        { value: "flats", label: "Flats / Loafers" },
      ]
    },
    accessory: {
      label: "Accessories",
      icon: "👜",
      subs: [
        { value: "bag", label: "Bag / Purse" },
        { value: "watch", label: "Watch / Jewellery" },
        { value: "belt", label: "Belt" },
        { value: "scarf", label: "Scarf / Dupatta" },
        { value: "sunglasses", label: "Sunglasses" },
        { value: "cap", label: "Cap / Hat" },
      ]
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile))
    }
    setMessage("")
  }

  const handleMainCategoryChange = (main) => {
    setMainCategory(main)
    setSubcategory(categorySystem[main].subs[0].value)
  }

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file!")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("subcategory", subcategory)
    formData.append("occasion", occasion)
    formData.append("season", season)

    setLoading(true)
    try {
      const res = await axios.post("https://smart-closet-ai-backend.onrender.com/api/wardrobe/upload", formData)
      setMessage(`Uploaded! Color detected: ${res.data.color}`)
      onUpload()
      setFile(null)
      setPreview(null)
    } catch (err) {
      setMessage("Upload failed. Is backend running?")
    }
    setLoading(false)
  }

  return (
    <div className="card">
      <h2>Upload Cloth</h2>

      {/* Image Upload Zone */}
      <div style={{
        border: `2px dashed ${preview ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.15)"}`,
        borderRadius: "14px",
        padding: "20px",
        textAlign: "center",
        marginBottom: "20px",
        background: preview ? "rgba(139,92,246,0.05)" : "transparent",
        position: "relative"
      }}>
        {preview ? (
          <div>
            <img
              src={preview}
              alt="preview"
              style={{
                maxHeight: "180px",
                maxWidth: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
                objectFit: "contain"
              }}
            />
            <br/>
            <button
              onClick={() => { setFile(null); setPreview(null) }}
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#FCA5A5",
                fontSize: "12px",
                padding: "6px 14px",
                borderRadius: "8px",
                marginTop: "8px"
              }}
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div>
            <div style={{fontSize:"36px", marginBottom:"8px"}}>👗</div>
            <p style={{fontSize:"13px", color:"#6B7280", marginBottom:"12px"}}>
              Click to select clothing image
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{color:"#9CA3AF", fontSize:"13px"}}
            />
          </div>
        )}
        {preview && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position:"absolute", top:0, left:0,
              width:"100%", height:"100%",
              opacity:0, cursor:"pointer"
            }}
          />
        )}
      </div>

      {/* Main Category Selection */}
      <div style={{marginBottom:"14px"}}>
        <label style={styles.label}>Main Category</label>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(5, 1fr)",
          gap:"8px"
        }}>
          {Object.entries(categorySystem).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleMainCategoryChange(key)}
              style={{
                background: mainCategory === key
                  ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                  : "rgba(255,255,255,0.04)",
                border: mainCategory === key
                  ? "none"
                  : "1px solid rgba(255,255,255,0.1)",
                color: mainCategory === key ? "white" : "#9CA3AF",
                fontSize: "11px",
                padding: "8px 4px",
                borderRadius: "10px",
                cursor: "pointer",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <span style={{fontSize:"18px"}}>{val.icon}</span>
              <span>{val.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory */}
      <div style={{marginBottom:"14px"}}>
        <label style={styles.label}>Type</label>
        <select
          value={subcategory}
          onChange={e => setSubcategory(e.target.value)}
        >
          {categorySystem[mainCategory].subs.map(sub => (
            <option key={sub.value} value={sub.value}>{sub.label}</option>
          ))}
        </select>
      </div>

      {/* Occasion */}
      <div style={{marginBottom:"14px"}}>
        <label style={styles.label}>Occasion</label>
        <select value={occasion} onChange={e => setOccasion(e.target.value)}>
          <option value="casual">Casual</option>
          <option value="college">College</option>
          <option value="formal">Formal / Office</option>
          <option value="party">Party / Night out</option>
          <option value="wedding">Wedding / Festive</option>
          <option value="sports">Sports / Gym</option>
          <option value="beach">Beach / Vacation</option>
        </select>
      </div>

      {/* Season */}
      <div style={{marginBottom:"20px"}}>
        <label style={styles.label}>Season</label>
        <select value={season} onChange={e => setSeason(e.target.value)}>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="spring">Spring / Autumn</option>
          <option value="all">All Seasons</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        style={{width:"100%"}}
      >
        {loading ? "Uploading..." : "Upload Cloth"}
      </button>

      {message && (
        <div style={{
          marginTop:"12px",
          padding:"12px",
          background:"rgba(74,222,128,0.1)",
          border:"1px solid rgba(74,222,128,0.2)",
          borderRadius:"10px",
          fontSize:"13px",
          color:"#4ADE80"
        }}>
          {message}
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
    marginBottom:"8px",
    letterSpacing:"0.5px",
    textTransform:"uppercase"
  }
}

export default Upload