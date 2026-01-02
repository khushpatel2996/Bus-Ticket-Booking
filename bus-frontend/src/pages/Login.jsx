import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../state/BookingContext";

export default function Login() {
  const navigate = useNavigate();
const { setUser } = useBooking();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // ✅ Debug: log what backend sends
      console.log("Login response:", data);

      if (data.success) {
        // ✅ Save user + token to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // ✅ Update context (important!)
      setUser(data.user);

        alert("✅ Login successful!");
        navigate("/home"); // redirect to home page
      } else {
        alert(data.message || "❌ Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    style={{
      width: "100%",
      minHeight: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      paddingTop: "40px", // gives space below header
    }}
  >
    <div
      style={{
        display: "flex",
        width: "85%",
        maxWidth: "1100px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        padding: "40px 50px",
      }}
    >
      {/* LEFT : Login Form */}
      <div style={{ flex: 1, paddingRight: "30px" }}>
        <h1 style={{ fontSize: "34px", marginBottom: "25px" }}>Login</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#ff7a00",
              color: "#fff",
              border: "none",
              padding: "12px 0",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "20px" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#ff7a00", fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </div>

      {/* RIGHT : SVG Illustration */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src="/Login-pana.svg"
          alt="login illustration"
          style={{ width: "100%", maxWidth: "430px" }}
        />
      </div>
    </div>
  </div>
);
}