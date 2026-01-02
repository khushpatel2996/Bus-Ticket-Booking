import axios from "axios";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: "/api", // Goes to "https://bus-backend-x2bc.onrender.com",/api via Vite proxy
});

// 🔍 Fetch trips based on route and date
export async function fetchTrips(searchParams) {
  const { from, to, date } = searchParams;

  try {
    const response = await api.get(`/trip/search`, {
      params: { from, to, date },
    });
    return response.data; // Should return trips from backend
  } catch (error) {
    console.error("❌ Error fetching trips:", error);
    return []; // return empty array if error
  }
}

// 🎟️ Fetch booked seats for a trip
export async function fetchBookedSeats(tripId) {
  try {
    const response = await api.get(`/booking/trip/${tripId}`);
    return response.data; // backend should send list of booked seat numbers
  } catch (error) {
    console.error("❌ Error fetching booked seats:", error);
    return [];
  }
}

// 🪑 Book seats
export async function bookSeats(tripId, seats, token) {
  try {
    const response = await api.post(
      `/booking`,
      { tripId, seats },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Booking failed:", error);
    throw error;
  }
}

// ✅ (Optional) Export default instance if needed
export default api;
