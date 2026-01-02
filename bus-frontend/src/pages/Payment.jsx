import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { bus, selectedSeats, bookingId, totalAmount, perSeat } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [loading, setLoading] = useState(false);

  if (!bus || !bookingId) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2>⚠️ No booking found!</h2>
        <p>Please select seats and proceed again.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#ff7a00",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // ✅ Handle Payment
  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!paymentDetails.trim()) {
      alert("Please enter payment details.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Create payment payload
      const payload = {
        booking_id: bookingId,
        provider: paymentMethod,
        provider_payment_id: "TXN_" + Date.now(), // unique fake transaction ID
        status: "SUCCESSFUL",
      };

      // ✅ Send payment to backend (this triggers the email automatically)
      const res = await fetch("http://localhost:5000/api/payment/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ✅ Check actual backend response (not payment_id)
      if (!res.ok || !data.success) {
        alert(data.message || "Payment failed. Please try again.");
        return;
      }

      // ✅ Save ticket info in sessionStorage (so it survives refresh)
      sessionStorage.setItem(
        "ticketData",
        JSON.stringify({
          bus,
          selectedSeats,
          bookingId,
          totalAmount,
          perSeat,
          paymentMethod,
        })
      );

      alert("✅ Payment Successful! Ticket will be sent to your email.");

      // ✅ Redirect to Ticket page
      navigate("/ticket", {
        replace: true,
        state: {
          bus,
          selectedSeats,
          bookingId,
          totalAmount,
          perSeat,
          paymentMethod,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render Inputs for Different Payment Methods
  const renderPaymentInput = () => {
    switch (paymentMethod) {
      case "UPI":
        return (
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontWeight: "600" }}>Enter UPI ID:</label>
            <input
              type="text"
              placeholder="example@upi"
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      case "Credit Card":
      case "Debit Card":
        return (
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontWeight: "600" }}>Card Number:</label>
            <input
              type="text"
              placeholder="XXXX XXXX XXXX XXXX"
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              style={inputStyle}
              maxLength={19}
            />
          </div>
        );
      case "Net Banking":
        return (
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontWeight: "600" }}>Enter Bank Name:</label>
            <input
              type="text"
              placeholder="e.g., SBI, HDFC, ICICI"
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // ✅ Main Render
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#fff",
        minHeight: "100vh",
        padding: "40px 5%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222" }}>
        Payment Page 💳
      </h2>

      {/* 🚌 Bus Info */}
      <div
        style={{
          backgroundColor: "#fafafa",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "12px",
          padding: "25px 40px",
          marginTop: "30px",
          width: "420px",
          textAlign: "left",
        }}
      >
        <h3 style={{ color: "#ff7a00", marginBottom: "10px" }}>
          {bus.name || "GoBus"}
        </h3>
        <p>
          <b>From:</b> {bus.from}
        </p>
        <p>
          <b>To:</b> {bus.to}
        </p>
        <p>
          <b>Time:</b> {bus.time}
        </p>
        <p>
          <b>Seats:</b> {selectedSeats.join(", ")}
        </p>
        <p>
          <b>Fare per seat:</b> ₹{perSeat}
        </p>
        <p style={{ fontWeight: "700", color: "#222" }}>
          <b>Total Amount:</b>{" "}
          <span style={{ color: "#ff7a00" }}>₹{totalAmount}</span>
        </p>
      </div>

      {/* 💳 Payment Method Section */}
      <div
        style={{
          marginTop: "35px",
          width: "420px",
          backgroundColor: "#fafafa",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "12px",
          padding: "25px 40px",
        }}
      >
        <h3
          style={{
            fontWeight: "700",
            fontSize: "18px",
            marginBottom: "15px",
            color: "#222",
          }}
        >
          Select Payment Method:
        </h3>

        <div style={{ display: "grid", gap: "12px" }}>
          {["UPI", "Credit Card", "Debit Card", "Net Banking"].map((method) => (
            <div
              key={method}
              onClick={() => setPaymentMethod(method)}
              style={{
                border:
                  paymentMethod === method
                    ? "2px solid #ff7a00"
                    : "2px solid #ddd",
                borderRadius: "8px",
                padding: "12px 16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor:
                  paymentMethod === method ? "#fff7f0" : "#ffffff",
              }}
            >
              <b>{method}</b>
              {paymentMethod === method && renderPaymentInput()}
            </div>
          ))}
        </div>

        {/* 🟠 Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            marginTop: "25px",
            width: "100%",
            backgroundColor: loading ? "#ccc" : "#ff7a00",
            color: "#fff",
            border: "none",
            padding: "14px 0",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 6px 14px rgba(255, 122, 0, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Processing Payment..." : `Pay Now ₹${totalAmount}`}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "6px",
  fontSize: "15px",
  outline: "none",
};
