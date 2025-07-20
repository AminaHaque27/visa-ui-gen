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
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Scale factor: reduce all size-related values to 80% of previous
  const scale = 0.576;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const initialMode = mediaQuery.matches;
    setIsDarkMode(initialMode);
    document.documentElement.setAttribute(
      "data-theme",
      initialMode ? "dark" : "light"
    );

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

      <main className="page-container">
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
              padding: `${0.5 * scale}rem`,
            }}
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <VisaModeLightHigh
                style={{
                  width: `${5 * scale}rem`,
                  height: `${5 * scale}rem`,
                  color: "var(--palette-default-text)",
                }}
                aria-label="Switch to light mode"
              />
            ) : (
              <VisaModeDarkHigh
                style={{
                  width: `${5 * scale}rem`,
                  height: `${5 * scale}rem`,
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
          <div style={{ maxWidth: `${1000 * scale}px`, margin: "0 auto" }}>
            <Typography
              variant="display-1"
              style={{
                color: "var(--text-accent)",
                marginTop: `0`,
                fontSize: `${8 * scale}rem`,
              }}
            >
              Welcome to <span className="gradient-text">NovaUI</span>
            </Typography>

            <Typography
              variant="headline-2"
              style={{
                color: "var(--text-primary)",
                marginTop: `${1.5 * scale}rem`,
                fontSize: `${3 * scale}rem`,
              }}
            >
              Make your wish. Turn your prompts into UI components.
            </Typography>
          </div>
        </div>

        <div className="cta-section">
          <div
            style={{
              maxWidth: `${800 * scale}px`,
              margin: "0 auto",
              padding: `0 ${1.5 * scale}rem`,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${1 * scale}rem`,
                marginBottom: `${6 * scale}rem`,
              }}
            >
              <VisaDeviceMonitorHigh
                aria-label="Visa Device Monitor High"
                style={{
                  width: `${7 * scale}rem`,
                  height: `${7 * scale}rem`,
                  color: "var(--text-accent)",
                }}
              />
              <Typography
                variant="headline-2"
                style={{
                  color: "var(--text-primary)",
                  fontSize: `${2.7 * scale}rem`,
                  marginLeft: "1.4rem",
                }}
              >
                Start coding
              </Typography>
            </div>

            <Typography
              variant="body-l"
              style={{
                color: "var(--text-primary)",
                fontSize: `${2.7 * scale}rem`,
                textAlign: "left",
                lineHeight: "1.5",
                marginBottom: `${2.5 * scale}rem`,
                marginTop: "0",
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
                navigate("/generate");
              }}
              style={{
                padding: `${1 * scale}rem ${2 * scale}rem`,
                fontSize: `${2 * scale}rem`,
                width: "100%",
                maxWidth: `${200 * scale}px`,
                height: `${5 * scale}rem`,
                margin: "0 auto",
                display: "block",
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
