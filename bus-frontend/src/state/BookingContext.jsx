import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Stores search input (from, to, date)
  const [searchParams, setSearchParams] = useState(null);

  // Stores selected bus (after user clicks “View Seats”)
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Stores seats selected by the user
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Stores the most recent confirmed booking (used by Ticket page)
  const [currentBooking, setCurrentBooking] = useState(null);

  // Stores logged-in user details
  const [user, setUser] = useState(null);

  const value = {
    searchParams,
    setSearchParams,
    selectedTrip,
    setSelectedTrip,
    selectedSeats,
    setSelectedSeats,
    currentBooking,
    setCurrentBooking,
    user,
    setUser,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

// Custom hook for easy access
export function useBooking() {
  return useContext(BookingContext);
}
