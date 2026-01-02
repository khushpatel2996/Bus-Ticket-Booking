import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Load user info from localStorage on page load or refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear everything related to session
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("ticketData");

      setUser(null);
      alert("👋 Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <header
      className="header container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
      }}
    >
      {/* ✅ Brand Logo + Name */}
      <div
        className="brand"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/home")}
      >
        <img
          src="/bus-logo.png"
          alt="GoBus Logo"
          style={{ width: "38px", height: "38px" }}
        />
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "0.5px",
              color: "var(--text-primary)",
            }}
          >
            GoBus
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>
            Smart • Fast • Secure
          </div>
        </div>
      </div>

      {/* ✅ Navigation Links */}
      <nav
        className="nav"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          fontSize: "15px",
        }}
      >
        <Link to="/home">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/bookings">My Bookings</Link>
        <Link to="/contact">Contact</Link>

        {/* ✅ Auth Buttons */}
        {user ? (
          <>
            <span style={{ color: "var(--muted)", fontSize: "14px" }}>
              👋 Hi, {user.name?.split(" ")[0] || user.email?.split("@")[0] || "User"}
            </span>
            <button
              className="btn small"
              style={{
                backgroundColor: "#ff7a00",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost small">
              Login
            </Link>
            <Link to="/register" className="btn small">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
