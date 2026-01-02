import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ToastProvider from "./components/Toast";

// Pages
//import Intro from "./pages/Intro";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Contact from "./pages/Contact";
import { BookingProvider } from "./state/BookingContext";


function App() {
  const location = useLocation();
  const hideLayoutPaths = ["/login", "/register"];
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <BookingProvider>
      <ToastProvider>
        {!shouldHideLayout && <Header />}

        <main
          className="container"
          style={{
            paddingTop: shouldHideLayout ? 0 : 20,
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/select/:tripId" element={<SeatSelection />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {!shouldHideLayout && <Footer />}
      </ToastProvider>
    </BookingProvider>
  );
}

export default App;
