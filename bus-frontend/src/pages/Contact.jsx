import React, { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !email || !message) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await response.json();

    if (data.success) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      alert("Error sending message: " + data.message);
    }
  } catch (error) {
    alert("Something went wrong!");
    console.error(error);
  }
};


  return (
    <div className="container card" style={{ maxWidth: 600 }}>
      <h2 style={{ textAlign: "center" }}>Contact Us</h2>
      <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: 20 }}>
        We’d love to hear from you! Fill out the form below and we’ll get back to you soon.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          rows="4"
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className="btn" type="submit">
          Send Message
        </button>
      </form>

      {submitted && (
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "var(--accent)",
            fontWeight: 600,
          }}
        >
          ✅ Message Sent Successfully!
        </p>
      )}

      <div style={{ marginTop: 30, textAlign: "center", color: "var(--muted)" }}>
        <p>📧 gobus2603@gmail.com</p>
        <p>📞 +91 98765 43210</p>
        <p>🏢 123 Swift Street, Ahmedabad, India</p>
      </div>
    </div>
  );
}
