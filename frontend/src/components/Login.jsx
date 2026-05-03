import { useState, useEffect } from "react"
import axios from "axios"

function Login({ onLogin, isRegister: initialRegister }) {
  const [isRegister, setIsRegister] = useState(initialRegister ?? false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setIsRegister(initialRegister ?? false)
  }, [initialRegister])

  const handleSubmit = async () => {
    if (!email || !password) return setError("Please fill all fields!")
    setLoading(true)
    setError("")
    try {
      const url = isRegister
        ? "https://smart-closet-ai-backend.onrender.com/api/auth/register"
        : "https://smart-closet-ai-backend.onrender.com/api/auth/login"
      const res = await axios.post(url, null, {
        params: isRegister ? { email, password, name } : { email, password }
      })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userName", res.data.name || email)
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!")
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight:"100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      background:"#0B0F19",
      fontFamily:"Outfit, sans-serif"
    }}>
      {/* Background */}
      <div style={{
        position:"fixed", top:0, left:0, width:"100%", height:"100%",
        background:"radial-gradient(ellipse at 15% 15%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 85% 85%, rgba(59,130,246,0.1) 0%, transparent 50%)",
        zIndex:0
      }}></div>

      <div style={{
        position:"relative", zIndex:1,
        width:"100%", maxWidth:"400px",
        margin:"0 16px"
      }}>
        {/* Back to landing */}
        <div style={{textAlign:"center", marginBottom:"16px"}}>
          <span
            onClick={() => window.location.reload()}
            style={{
              fontSize:"12px", color:"#6B7280",
              cursor:"pointer", display:"inline-flex",
              alignItems:"center", gap:"4px"
            }}
          >
            ← Back to home
          </span>
        </div>

        {/* Logo */}
        <div style={{textAlign:"center", marginBottom:"32px"}}>
          <div style={{fontSize:"48px", marginBottom:"12px"}}>👗</div>
          <h1 style={{
            fontSize:"24px", fontWeight:"700",
            color:"#C0C0C0", letterSpacing:"1px"
          }}>
            SMART<span style={{color:"#8B5CF6"}}>CLOSET</span> AI
          </h1>
          <p style={{fontSize:"13px", color:"#6B7280", marginTop:"6px"}}>
            Your AI-powered wardrobe assistant
          </p>
        </div>

        {/* Card */}
        <div style={{
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"20px",
          padding:"32px",
          backdropFilter:"blur(20px)"
        }}>
          <h2 style={{
            fontSize:"20px", fontWeight:"600",
            color:"#E5E4E2", marginBottom:"24px",
            textAlign:"center"
          }}>
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          {isRegister && (
            <div style={{marginBottom:"14px"}}>
              <label style={styles.label}>Your Name</label>
              <input
                type="text"
                placeholder="e.g. Aditi"
                value={name}
                onChange={e => setName(e.target.value)}
                style={styles.input}
              />
            </div>
          )}

          <div style={{marginBottom:"14px"}}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{marginBottom:"20px"}}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={styles.input}
            />
          </div>

          {error && (
            <div style={{
              background:"rgba(239,68,68,0.1)",
              border:"1px solid rgba(239,68,68,0.25)",
              borderRadius:"10px",
              padding:"10px 14px",
              fontSize:"13px",
              color:"#FCA5A5",
              marginBottom:"16px"
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width:"100%",
              background:"linear-gradient(135deg, #8B5CF6, #6D28D9)",
              border:"none",
              color:"white",
              fontFamily:"Outfit, sans-serif",
              fontSize:"14px",
              fontWeight:"500",
              padding:"12px",
              borderRadius:"10px",
              cursor:"pointer",
              marginBottom:"16px"
            }}
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>

          <p style={{textAlign:"center", fontSize:"13px", color:"#6B7280"}}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => { setIsRegister(!isRegister); setError("") }}
              style={{color:"#8B5CF6", cursor:"pointer", fontWeight:"500"}}
            >
              {isRegister ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
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
  },
  input: {
    width:"100%",
    background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:"10px",
    color:"#E5E4E2",
    fontFamily:"Outfit, sans-serif",
    fontSize:"14px",
    padding:"10px 14px"
  }
}

export default Login