import { useState } from "react";
import { Typography, Button } from "@visa/nova-react";
import {
  VisaDeviceMonitorHigh,
  VisaModeDarkHigh,
  VisaModeLightHigh,
} from "@visa/nova-icons-react";
import VisaLogo from "./assets/VisaLogo.png";
import "./LandingPage.css";

export default function LandingPage({ onStart }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : "light"
    );
  };

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

        <div
          style={{
            marginLeft: "auto",
            cursor: "pointer",
            padding: "8px",
          }}
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <VisaModeLightHigh
              style={{
                width: "40px",
                height: "40px",
                color: "var(--palette-default-text)",
              }}
              aria-label="Switch to light mode"
            />
          ) : (
            <VisaModeDarkHigh
              style={{
                width: "40px",
                height: "40px",
                color: "var(--palette-default-text)",
              }}
              aria-label="Switch to dark mode"
            />
          )}
        </div>
      </header>

      <div className="blue-bar">
        <Typography variant="headline-1">UI Generator</Typography>
      </div>

      <div className="hero">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Typography variant="display-1" style={{ color: "#1434cb" }}>
            Visa Product Design System UI Generator
          </Typography>
          <Typography
            variant="headline-2"
            style={{ color: "#000000ff", marginTop: "24px" }}
          >
            Helps you turn prompts into UI components
          </Typography>
        </div>
      </div>

      <div className="cta-section">
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Icon + Headline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <VisaDeviceMonitorHigh
              aria-label="Visa Device Monitor High"
              style={{ width: "80px", height: "80px", color: "#1434cb" }}
            />
            <Typography
              variant="headline-2"
              style={{
                color: "#000000ff",
                fontSize: "35px",
              }}
            >
              Start coding
            </Typography>
          </div>

          <Typography
            variant="body-l"
            style={{
              color: "#000000ff",
              fontSize: "25px",
              textAlign: "left",
              lineHeight: "1.5",
              marginBottom: "40px",
            }}
          >
            Discover the fastest way to go from idea to implementation: Powered
            by Visa’s accessibility first, reusable components library.
          </Typography>

          <Button
            variant="secondary"
            size="large"
            onClick={() => {
              console.log("✅ Get Started button clicked");
              onStart();
            }}
            style={{
              padding: "20px 40px",
              fontSize: "20px",
              width: "250px",
              height: "60px",
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </main>
  );
}
