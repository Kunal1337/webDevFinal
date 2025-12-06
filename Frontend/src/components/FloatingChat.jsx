import { useState } from "react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const response = await fetch(
        "https://webdevfinal-ai.onrender.com/api/ai/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json();

      // Add bot message
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "No response" },
      ]);
   } catch (error) {
  console.error("AI chat error:", error);   // <-- now it's used
  setMessages((prev) => [
    ...prev,
    { role: "bot", text: "Server error. Try again." },
  ]);
}
    setUserMessage("");
  };

  return (
    <>
      {/* Floating Chat Container */}
      <div
        style={{
          position: "fixed",
          bottom: "90px",
          right: "40px",
          width: open ? "340px" : "0px",
          height: open ? "420px" : "0px",
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(12px)",
          borderRadius: "18px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.3)",
          overflow: "hidden",
          transition: "all 0.35s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#f77a4a",
            padding: "12px",
            color: "white",
            fontWeight: "600",
            fontSize: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Watch Expert AI
          <span
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              opacity: 0.8,
            }}
            onClick={() => setOpen(false)}
          >
            ✕
          </span>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "14px",
            overflowY: "auto",
            fontSize: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#f77a4a" : "white",
                color: m.role === "user" ? "white" : "#333",
                padding: "10px 14px",
                borderRadius: "14px",
                maxWidth: "80%",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "10px",
            borderTop: "1px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.45)",
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            placeholder="Ask about a watch..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#f77a4a",
              color: "white",
              borderRadius: "10px",
              padding: "10px 14px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Floating chat button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "40px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#f77a4a",
          color: "white",
          border: "none",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          transition: "0.3s",
        }}
      >
        💬
      </button>
    </>
  );
}
