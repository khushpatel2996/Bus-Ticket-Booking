import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        color: "var(--muted)",
        marginTop: "40px",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        fontSize: "14px",
      }}
    >
      © {new Date().getFullYear()} GoBus — Book your journey with comfort 🚌
    </footer>
  );
}
