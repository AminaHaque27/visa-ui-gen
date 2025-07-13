import { Typography, Button } from "@visa/nova-react";
import VisaLogo from "./assets/VisaLogo.png";
import "./LandingPage.css";

export default function LandingPage({ onStart }) {
  return (
    <main className="page-container">
      <header className="header">
        <img src={VisaLogo} alt="Visa Logo" className="logo" />
        <Typography
          variant="headline-1"
          style={{ color: "#1434cb", fontWeight: "bold" }}
        >
          Product Design System
        </Typography>
      </header>

      <div className="blue-bar">
        <Typography variant="headline-1">UI Generator</Typography>
      </div>

      <div className="hero">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Typography variant="display-1" style={{ color: "#1434cb" }}>
            Visa Product Design System UI Generator
          </Typography>
          <Typography variant="headline-2" style={{ color: "#000000ff" }}>
            Helps you turn prompts into UI components
          </Typography>
        </div>
      </div>

      <div className="cta-section">
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <Typography variant="body-m" style={{ color: "#6b7280" }}>
            Discover the fastest way to go from idea to implementation - powered
            by Visa’s accessibility first, reusable components library.
          </Typography>
          <Button
            variant="primary"
            onClick={onStart}
            style={{ marginTop: "24px" }}
          >
            Get Started
          </Button>
        </div>
      </div>

      <footer className="footer">Powered by React + Visa System</footer>
    </main>
  );
}
