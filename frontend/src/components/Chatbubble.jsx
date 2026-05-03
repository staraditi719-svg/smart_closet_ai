import { useState } from "react"
import axios from "axios"

function ChatBubble() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I am your AI Style Advisor. Ask me anything about fashion!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg = { role: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await axios.get("https://smart-closet-ai-backend.onrender.com/api/recommend/chat", {
        params: { message: input }
      })
      setMessages(prev => [...prev, { role: "ai", text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I am unavailable right now. Try again later!" }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div style={{
          position:"fixed", bottom:"90px", right:"24px",
          width:"320px", height:"420px",
          background:"rgba(15,20,35,0.95)",
          border:"1px solid rgba(139,92,246,0.3)",
          borderRadius:"20px", display:"flex",
          flexDirection:"column", zIndex:1000,
          backdropFilter:"blur(20px)",
          boxShadow:"0 20px 60px rgba(139,92,246,0.2)"
        }}>
          {/* Header */}
          <div style={{
            padding:"16px 20px",
            borderBottom:"1px solid rgba(255,255,255,0.06)",
            display:"flex", alignItems:"center", gap:"10px"
          }}>
            <div style={{
              width:"32px", height:"32px", borderRadius:"50%",
              background:"linear-gradient(135deg, #8B5CF6, #E879F9)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"14px"
            }}>✦</div>
            <div>
              <div style={{fontSize:"13px", fontWeight:"500", color:"#C0C0C0"}}>AI Style Advisor</div>
              <div style={{fontSize:"11px", color:"#4ADE80"}}>● Online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              marginLeft:"auto", background:"none",
              border:"none", color:"#6B7280",
              fontSize:"18px", cursor:"pointer",
              padding:"0", boxShadow:"none"
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex:1, overflowY:"auto", padding:"16px",
            display:"flex", flexDirection:"column", gap:"10px"
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display:"flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  maxWidth:"80%", padding:"10px 14px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                    : "rgba(255,255,255,0.06)",
                  border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  fontSize:"12px", color:"#E5E4E2", lineHeight:"1.6"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{fontSize:"12px", color:"#6B7280"}}>AI is thinking...</div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding:"12px 16px",
            borderTop:"1px solid rgba(255,255,255,0.06)",
            display:"flex", gap:"8px"
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about fashion..."
              style={{
                flex:1, background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:"10px", color:"#E5E4E2",
                fontFamily:"Outfit,sans-serif", fontSize:"12px",
                padding:"8px 12px"
              }}
            />
            <button onClick={sendMessage} style={{
              padding:"8px 14px", fontSize:"12px",
              borderRadius:"10px", whiteSpace:"nowrap"
            }}>Send</button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div onClick={() => setOpen(!open)} style={{
        position:"fixed", bottom:"24px", right:"24px",
        background:"linear-gradient(135deg, #8B5CF6, #6D28D9)",
        borderRadius:"50px", padding:"14px 22px",
        display:"flex", alignItems:"center", gap:"8px",
        cursor:"pointer", zIndex:1000,
        boxShadow:"0 8px 30px rgba(139,92,246,0.4)",
        transition:"transform 0.2s"
      }}>
        <div style={{
          width:"8px", height:"8px", borderRadius:"50%",
          background:"#4ADE80", animation:"pulse 2s infinite"
        }}></div>
        <span style={{
          fontSize:"13px", fontWeight:"500",
          color:"white", fontFamily:"Outfit,sans-serif"
        }}>Ask Your Stylist</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}

export default ChatBubble