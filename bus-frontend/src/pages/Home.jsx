import React from "react";    
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
        backgroundColor: "#ffffff",
        padding: "0 8%",
      }}
    >
      {/* Left Text Section */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            color: "#222",
            lineHeight: "1.3",
            marginBottom: "20px",
          }}
        >
          Quick and Reliable <br />{" "}
          <span style={{ color: "#ff7a00" }}>Bus Booking</span>
        </h1>
        <p
          style={{
            color: "#555",
            fontSize: "16px",
            maxWidth: "440px",
            marginBottom: "40px",
          }}
        >
          Book your bus tickets easily with GoBus. Find and reserve seats on
          your preferred bus in just a few clicks.
        </p>
        <button
          onClick={() => navigate("/search")}
          style={{
            backgroundColor: "#ff7a00",
            border: "none",
            color: "white",
            padding: "14px 30px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(255,122,0,0.3)",
          }}
        >
          Search Bus
        </button>
      </div>

      {/* Right Illustration */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src="/home-illustration.svg"
          alt="Bus Illustration"
          style={{
            width: "85%",
            maxWidth: "450px",
          }}
        />
      </div>
    </div>
  );
}
