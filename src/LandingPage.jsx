import { useState, useEffect } from "react";
import { Typography, Button } from "@visa/nova-react";
import {
  VisaDeviceMonitorHigh,
  VisaModeDarkHigh,
  VisaModeLightHigh,
} from "@visa/nova-icons-react";
import VisaLogo from "./assets/VisaLogo.png";
import "./LandingPage.css";
import "./galaxy.css";

export default function LandingPage({ onStart }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Respect system preference on initial load (for accessibility/WCAG)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const initialMode = mediaQuery.matches;
    setIsDarkMode(initialMode);
    document.documentElement.setAttribute(
      "data-theme",
      initialMode ? "dark" : "light"
    );

    // Listener for system theme changes
    const handleChange = (e) => {
      const newMode = e.matches;
      setIsDarkMode(newMode);
      document.documentElement.setAttribute(
        "data-theme",
        newMode ? "dark" : "light"
      );
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : "light"
    );
  };

  return (
    <div className="galaxy-background">
      <div className="stars"></div>
      <div className="shooting-star"></div>

      <main className="page-container max-w-screen-lg mx-auto px-4">
        <header className="header">
          <img src={VisaLogo} alt="Visa Logo" className="logo" />
          <Typography
            variant="headline-1"
            style={{ color: "var(--text-accent)", fontWeight: "bold" }}
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
          <Typography variant="headline-1">NovaUI Generator</Typography>
        </div>

        <div className="hero">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Typography
              variant="display-1"
              style={{ color: "var(--text-accent)" }}
            >
              Welcome to{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "700",
                }}
              >
                NovaUI
              </span>
            </Typography>

            <Typography
              variant="headline-2"
              style={{ color: "var(--text-primary)", marginTop: "24px" }}
            >
              Make your wish. Turn your prompts into UI components.
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
                style={{
                  width: "80px",
                  height: "80px",
                  color: "var(--text-accent)",
                }}
              />
              <Typography
                variant="headline-2"
                style={{
                  color: "var(--text-primary)",
                  fontSize: "35px",
                }}
              >
                Start coding
              </Typography>
            </div>

            <Typography
              variant="body-l"
              style={{
                color: "var(--text-primary)",
                fontSize: "25px",
                textAlign: "left",
                lineHeight: "1.5",
                marginBottom: "40px",
              }}
            >
              Discover the fastest way to go from idea to implementation:
              Powered by Visa’s accessibility first, reusable components
              library.
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
    </div>
  );
}
