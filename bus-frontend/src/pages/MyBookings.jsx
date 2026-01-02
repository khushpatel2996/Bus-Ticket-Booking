import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please log in to view your bookings.");
      navigate("/login");
      return;
    }

    // ✅ Fetch bookings for the logged-in user
    fetch(`https://bus-backend-x2bc.onrender.com/api/booking/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Bookings API Response:", data);
        if (data.success && data.bookings?.length > 0) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
      })
      .catch((err) => console.error("❌ Error fetching bookings:", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  // ✅ Cancel Booking
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/booking/cancel/${bookingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("✅ Booking cancelled successfully and seats freed!");
        setBookings((prev) =>
          prev.map((b) =>
            b.BOOKING_ID === bookingId ? { ...b, STATUS: "CANCELLED" } : b
          )
        );
      } else {
        alert(data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      alert("Something went wrong while cancelling booking.");
    }
  };

  // 🧭 UI Rendering
  if (loading)
    return (
      <h3 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading your bookings...
      </h3>
    );

  if (bookings.length === 0)
    return (
      <h3 style={{ textAlign: "center", marginTop: "50px" }}>
        No bookings found. <a href="/home">Book a trip now!</a>
      </h3>
    );

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#fff",
        padding: "50px 5%",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#ff7a00",
          fontWeight: "700",
          marginBottom: "30px",
        }}
      >
        🚌 My Bookings
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {bookings.map((b) => (
          <div
            key={b.BOOKING_ID}
            style={{
              border: "2px dashed #ddd",
              borderRadius: "12px",
              padding: "20px",
              backgroundColor:
                b.STATUS === "CANCELLED" ? "#f5f5f5" : "#fff7f0",
              opacity: b.STATUS === "CANCELLED" ? 0.7 : 1,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <h3 style={{ color: "#ff7a00", marginBottom: "8px" }}>
              {b.BUS_NAME}
            </h3>

            <p>
              <b>Route:</b> {b.FROM_CITY} → {b.TO_CITY}
            </p>
            <p>
              <b>Seats:</b> {b.SEATS}
            </p>
            <p>
              <b>Amount:</b> ₹{parseFloat(b.AMOUNT).toFixed(2)}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    b.STATUS === "CANCELLED"
                      ? "red"
                      : b.STATUS === "SUCCESSFUL"
                      ? "green"
                      : "#222",
                  fontWeight: 600,
                }}
              >
                {b.STATUS}
              </span>
            </p>
            <p>
              <b>Departure:</b>{" "}
              {new Date(b.DEPARTURE_TS).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p>
              <b>Arrival:</b>{" "}
              {new Date(b.ARRIVAL_TS).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p style={{ fontSize: "13px", color: "#777" }}>
              <b>Booked On:</b>{" "}
              {new Date(b.CREATED_AT).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            <button
              onClick={() => handleCancel(b.BOOKING_ID)}
              disabled={b.STATUS === "CANCELLED"}
              style={{
                backgroundColor:
                  b.STATUS === "CANCELLED" ? "#ccc" : "#ff3b30",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontWeight: "600",
                marginTop: "10px",
                cursor:
                  b.STATUS === "CANCELLED" ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {b.STATUS === "CANCELLED"
                ? "Cancelled"
                : "Cancel Booking"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
