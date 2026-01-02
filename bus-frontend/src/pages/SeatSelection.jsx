import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function SeatSelection() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bus, setBus] = useState(location.state || null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(!location.state);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // ✅ Fetch trip + booked seats
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        if (location.state) {
          const trip = location.state;
          setBus({
  id: trip.id,
  name: trip.name,
  from: trip.startCity,
  to: trip.endCity,
  fare: trip.fare,                   // ✅ ADD PRICE HERE
  time: `${new Date(trip.raw?.DEPARTURE_TS || trip.departure).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${new Date(trip.raw?.ARRIVAL_TS || trip.arrival).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`,
});

        } else {
          const tripRes = await fetch(`http://localhost:5000/api/trip/${tripId}`);
          const tripData = await tripRes.json();

          if (tripData.success) {
           setBus({
  id: tripData.trip.ID,
  name: tripData.trip.BUS_NAME,
  from: tripData.trip.START_CITY,
  to: tripData.trip.END_CITY,
  fare: tripData.trip.PRICE,   // ✅ FIX ADDED
  time: `${new Date(tripData.trip.DEPARTURE_TS).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${new Date(tripData.trip.ARRIVAL_TS).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`,
});

          }
        }

        const seatRes = await fetch(
          `http://localhost:5000/api/booking/booked-seats/${tripId}`
        );
        const seatData = await seatRes.json();
        if (seatData.success) setBookedSeats(seatData.bookedSeats || []);
      } catch (error) {
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, location.state]);

  // ✅ Seat numbers
  const seats = Array.from({ length: 45 }, (_, i) => i + 1);

  // ✅ Toggle seat
  const toggleSeat = (seatNo) => {
    if (bookedSeats.includes(seatNo)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNo)
        ? prev.filter((s) => s !== seatNo)
        : [...prev, seatNo]
    );
  };

  // ✅ Handle booking
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }

    try {
      setBookingLoading(true);

     // ✅ Get the logged-in user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.id) {
  alert("⚠️ Please log in again before booking.");
  navigate("/login");
  return;
}

const payload = {
  user_id: user.id, // ✅ Correct dynamic user ID
  trip_id: bus.id,
  seats: selectedSeats,
};


      const res = await fetch(
  "http://localhost:5000/api/booking/create-with-seats",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }
);


      const data = await res.json();

      if (!data.success) {
        console.log("Booking API response:", data);

        alert(data.message || "Booking failed. Please try again.");
        setBookingLoading(false);
        return;
      }

      // ✅ Success message
      setBookingSuccess(true);
      console.log("Navigating to payment page...", {
        bus,
        selectedSeats,
        bookingId: data.booking_id,
      });

      // ✅ Instantly redirect to payment page
      navigate("/payment", {
        replace: true,
        state: {
          bus,
          selectedSeats,
          bookingId: data.booking_id,
          totalAmount: data.total_amount,
          perSeat: data.per_seat,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong while booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

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
      {loading ? (
        <p>Loading trip details...</p>
      ) : (
        <>
          {/* ✅ Bus Info */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#222",
                marginBottom: "6px",
              }}
            >
              {bus.name || "GoBus"}
            </h2>
            <p style={{ fontSize: "16px", color: "#555", margin: "5px 0" }}>
              {bus.from || "From City"} → {bus.to || "To City"}
            </p>
            <p style={{ fontSize: "14px", color: "#777", marginTop: "4px" }}>
              {bus.time || "00:00 - 00:00"}
            </p>
          </div>

          {/* ✅ Seat Legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "25px",
              marginBottom: "25px",
            }}
          >
            <LegendBox color="#fff" label="Available" border />
            <LegendBox color="#ff7a00" label="Selected" />
            <LegendBox color="#bbb" label="Booked" />
          </div>

          {/* 🪑 Seat Layout */}
          <div
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              padding: "30px 40px",
              width: "fit-content",
            }}
          >
            <div
              style={{
                textAlign: "right",
                marginBottom: "12px",
                color: "#ff7a00",
                fontWeight: "600",
              }}
            >
              🚌 Driver
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(10, auto)",
                gap: "10px",
              }}
            >
              {[...Array(10)].map((_, rowIndex) => {
                const start = rowIndex * 4 + 1;
                const rowSeats = seats.slice(start - 1, start + 3);

                return (
                  <div
                    key={rowIndex}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 50px)",
                      justifyItems: "center",
                      alignItems: "center",
                      columnGap: "10px",
                    }}
                  >
                    {rowSeats.map((seatNo, index) => (
                      <React.Fragment key={seatNo}>
                        {index === 2 && <div></div>}
                        <SeatBox
                          seatNo={seatNo}
                          bookedSeats={bookedSeats}
                          selectedSeats={selectedSeats}
                          toggleSeat={toggleSeat}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Last Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 50px)",
                justifyItems: "center",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              {seats.slice(40).map((seatNo) => (
                <SeatBox
                  key={seatNo}
                  seatNo={seatNo}
                  bookedSeats={bookedSeats}
                  selectedSeats={selectedSeats}
                  toggleSeat={toggleSeat}
                />
              ))}
            </div>
          </div>

          {/* ✅ Loading or Success Message */}
          {bookingLoading && (
            <p style={{ color: "#777", marginTop: "20px" }}>
              Processing your booking...
            </p>
          )}

          {bookingSuccess && (
            <div
              style={{
                backgroundColor: "#e6ffed",
                color: "#008a1c",
                border: "1px solid #77c080",
                padding: "10px 20px",
                borderRadius: "8px",
                marginTop: "20px",
                fontWeight: "500",
              }}
            >
              ✅ Booking successful! Redirecting to payment page...
            </div>
          )}

          {/* ✅ Seat Summary */}
          <div style={{ marginTop: "25px", textAlign: "center" }}>
            {selectedSeats.length > 0 ? (
              <p>
                Selected Seats:{" "}
                <b style={{ color: "#ff7a00" }}>{selectedSeats.join(", ")}</b>
              </p>
            ) : (
              <p style={{ color: "#777" }}>No seats selected yet.</p>
            )}
          </div>

          {/* 🟧 Book Now Button */}
          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            style={{
              backgroundColor: bookingLoading ? "#ccc" : "#ff7a00",
              color: "#fff",
              border: "none",
              padding: "14px 28px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "16px",
              marginTop: "20px",
              cursor: bookingLoading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 14px rgba(255, 122, 0, 0.3)",
              transition: "all 0.2s ease",
            }}
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </>
      )}
    </div>
  );
}

/* 🧩 Small Components */
const LegendBox = ({ color, label, border = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "5px",
        backgroundColor: color,
        border: border ? "2px solid #ccc" : "none",
      }}
    ></div>
    <span style={{ color: "#555", fontSize: "14px" }}>{label}</span>
  </div>
);

const SeatBox = ({ seatNo, bookedSeats, selectedSeats, toggleSeat }) => (
  <div
    onClick={() => toggleSeat(seatNo)}
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      border: "2px solid #ccc",
      backgroundColor: bookedSeats.includes(seatNo)
        ? "#bbb"
        : selectedSeats.includes(seatNo)
        ? "#ff7a00"
        : "#fff",
      color: bookedSeats.includes(seatNo)
        ? "#666"
        : selectedSeats.includes(seatNo)
        ? "#fff"
        : "#444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: bookedSeats.includes(seatNo) ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
    }}
  >
    {seatNo}
  </div>
);
