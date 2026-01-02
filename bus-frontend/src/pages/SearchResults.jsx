import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// removed: import { fetchTrips } from "../api";

export default function SearchResults() {
  const navigate = useNavigate();
 function convertToMySQL(dateStr) {
  if (!dateStr) return "";

  const parts = dateStr.split("-");

  // if browser already gives yyyy-mm-dd
  if (parts[0].length === 4) {
    return dateStr;
  }

  // convert dd-mm-yyyy to yyyy-mm-dd
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [searched, setSearched] = useState(false);
  const [availableBuses, setAvailableBuses] = useState([]); // always an array
  const [loading, setLoading] = useState(false);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Helper: format ISO datetime to readable string
  const formatDateTime = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  // small fare calc: ₹6 per km as placeholder (you can replace)
  const estimateFare = (distanceKm) => {
    if (!distanceKm) return 0;
    const km = parseFloat(distanceKm);
    if (isNaN(km)) return 0;
    return Math.round(km * 6); // simple heuristic
  };

  // 🔹 Handle search button click
const handleSearch = async (e) => {
  e.preventDefault();
  console.log("Frontend sends:", form.from, form.to, form.date);

  if (!form.from || !form.to || !form.date) {
    alert("Please fill in all fields before searching.");
    return;
  }

  setLoading(true);
  setSearched(true);
  setAvailableBuses([]);

  try {
    const encodedFrom = encodeURIComponent(form.from.trim());
    const encodedTo = encodeURIComponent(form.to.trim());

    // 🔥 FIX: Convert date to MySQL format
    const fixedDate = convertToMySQL(form.date.trim());
    const encodedDate = encodeURIComponent(fixedDate);

    const url = `http://localhost:5000/api/trip/search?from=${encodedFrom}&to=${encodedTo}&date=${encodedDate}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.success) {
      setAvailableBuses([]);
    } else {
      const transformed = data.trips.map((t) => ({
        id: t.ID,
        name: t.BUS_NAME || "Unknown Bus",
        departure: formatDateTime(t.DEPARTURE_DATETIME),
        arrival: formatDateTime(t.ARRIVAL_DATETIME),
        fare: t.PRICE,
        startCity: t.START_CITY,
        endCity: t.END_CITY,
        raw: t,
      }));

      setAvailableBuses(transformed);
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
    alert("Failed to fetch trips. Please try again.");
    setAvailableBuses([]);
  } finally {
    setLoading(false);
  }
};
   


  // 🔹 When user clicks "View Seats"
  const handleSeatSelection = (bus) => {
    navigate(`/select/${bus.id}`, { state: bus });
  };

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#fff",
        minHeight: "100vh",
        padding: "50px 8%",
      }}
    >
      {/* Page Title */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "700",
          color: "#222",
          marginBottom: "25px",
        }}
      >
        Search Bus
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          name="from"
          placeholder="From"
          value={form.from}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="to"
          placeholder="To"
          value={form.to}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          {loading ? "Searching..." : "Search Bus"}
        </button>
      </form>

      {/* Search Results */}
      {searched && (
        <>
          <div
            style={{
              marginBottom: "20px",
              textAlign: "center",
              color: "#444",
              fontSize: "16px",
            }}
          >
            Showing results for <b>{form.from}</b> → <b>{form.to}</b> on{" "}
            <b>{form.date}</b>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#999" }}>Loading...</p>
          ) : availableBuses.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>
              No buses found.
            </p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <th style={thStyle}>Bus Name</th>
                  <th style={thStyle}>Route</th>
                  <th style={thStyle}>Departure</th>
                  <th style={thStyle}>Arrival</th>
                  <th style={thStyle}>Fare</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableBuses.map((bus) => (
                  <tr key={bus.id} style={trStyle}>
                    <td style={tdStyle}>{bus.name}</td>
                    <td style={tdStyle}>
                      {bus.startCity} → {bus.endCity}
                    </td>
                    <td style={tdStyle}>{bus.departure}</td>
                    <td style={tdStyle}>{bus.arrival}</td>
                    <td style={tdStyle}>₹{bus.fare}</td>
                    <td style={tdStyle}>
                      <button
                        style={viewSeatButton}
                        onClick={() => handleSeatSelection(bus)}
                      >
                        View Seats
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

/* 🎨 Styles */
const inputStyle = {
  padding: "10px 14px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  width: "180px",
};

const buttonStyle = {
  backgroundColor: "#ff7a00",
  border: "none",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(255,122,0,0.3)",
  transition: "all 0.3s ease",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  borderRadius: "10px",
  overflow: "hidden",
};

const thStyle = {
  textAlign: "left",
  padding: "14px 20px",
  fontWeight: "600",
  color: "#333",
  borderBottom: "2px solid #eee",
};

const tdStyle = {
  padding: "14px 20px",
  color: "#444",
  borderBottom: "1px solid #eee",
  fontSize: "15px",
};

const trStyle = {
  backgroundColor: "#fff",
};

const viewSeatButton = {
  backgroundColor: "#ff7a00",
  color: "#fff",
  border: "none",
  padding: "8px 18px",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.3s ease",
};
