import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import { Toaster, toast } from "react-hot-toast";
import "./galaxy.css";
import "./GeneratorPage.css";
import {
  VisaModeDarkHigh,
  VisaModeLightHigh,
  VisaQuestionHigh,
} from "@visa/nova-icons-react";
import { Link } from "react-router-dom";
import { VisaHomeLow } from "@visa/nova-icons-react";

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const getComponentInfo = async (query) => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; // fallback

  try {
    const response = await fetch(
      `${BASE_URL}/suggest?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) throw new Error("Failed to fetch from backend");

    return await response.json();
  } catch (error) {
    console.error("Backend fetch failed:", error);
    return {
      components: [
        "Typography: For text elements.",
        "Button: General purpose buttons.",
      ],
      code: `<div>\n  <p>${query}</p>\n  <button>Action</button>\n</div>`,
    };
  }
};

export default function GeneratorPage() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [navExpanded, setNavExpanded] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);

  // Scale factor: reduce all size-related values to 75% of original
  const scale = 0.75;

  useEffect(() => {
    // Respect system preference on initial load (for accessibility/WCAG)
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

  const toggleAccessibilityInfo = () => {
    setShowAccessibilityInfo(!showAccessibilityInfo);
  };

  const clearHistory = async () => {
    try {
      await fetch("http://localhost:8000/queries", { method: "DELETE" }); // clear server
    } catch (err) {
      console.error("Failed to clear backend history:", err);
    }

    localStorage.removeItem("nova-history");
    setMessages([]);
    setHistory([]);
    setQuery("");
    setShowGreeting(true);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast.success("✅ Code copied to clipboard!");

      // Reset after 2 seconds
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleQueryChange = (e) => {
    if (showGreeting) setShowGreeting(false); // fade "Hello!" once
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setShowGreeting(false);
    }
  }, [messages]);

  const handleGenerate = async () => {
    if (!query.trim()) return;

    setIsLoading(true); //  Show loading spinner/message

    const userMessage = { type: "user", text: query };
    const newId = `hist-${history.length}`;
    const label = query.slice(0, 20) + (query.length > 20 ? "..." : "");

    try {
      // Step 1: Fetch component suggestion
      const { components, code, reasoning } = await getComponentInfo(query);

      const systemMessage = {
        type: "bot",
        text: null,
        suggestions: components,
        code: code,
        reasoning: reasoning,
      };

      setMessages((prev) => [...prev, userMessage, systemMessage]);

      // Step 2: Save to backend
      const saveResponse = await fetch("http://localhost:8000/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, components, code, reasoning }),
      });

      const { shared_id } = await saveResponse.json();
      toast.success(`✅ Query saved! Share link: /queries/${shared_id}`);

      // Step 3: Store in local state/history
      const newItem = { id: newId, label, query, components, code };
      setHistory((prev) => [...prev, newItem]);
      setQuery("");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("⚠️ Failed to save query");
    } finally {
      setIsLoading(false); //  Hide spinner/message
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch("http://localhost:8000/queries");
        const data = await response.json();

        // Transform backend data into user/bot message pairs
        const processedMessages = data.flatMap((item) => [
          { type: "user", text: item.query },
          {
            type: "bot",
            text: null,
            suggestions: item.components,
            code: item.code,
            reasoning: item.reasoning,
          },
        ]);

        setMessages(processedMessages);

        setHistory(
          data.map((item, i) => ({
            id: `hist-${i}`,
            label: item.query.slice(0, 20),
            query: item.query,
            components: item.components,
            code: item.code,
          }))
        );
      } catch (error) {
        console.error("Load from backend failed:", error);
      }
    };

    loadHistory();
  }, []);

  return (
    <>
      <div className="galaxy-background">
        <div className="stars"></div>
        <div className="shooting-star"></div>
      </div>

      <div className="page-container compact-mode">
        <Toaster /> {/* Required for toast notifications */}
        <Link
          to="/"
          style={{
            position: "absolute",
            left: navExpanded ? `${380 * scale}px` : `${100 * scale}px`,
            zIndex: 10,
            fontSize: `${30 * scale}px`,
            fontWeight: "500",
            fontFamily: "Visa Sans Text, sans-serif",
            transition: "left 0.3s ease",
            top: `${40 * scale}px`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            background:
              "linear-gradient(90deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          aria-label="Go to home page"
        >
          <VisaHomeLow
            size={32}
            style={{ position: "relative", top: "-3px" }}
          />
          <span>NovaUI</span>
        </Link>
        <div
          style={{
            position: "absolute",
            right: `${50 * scale}px`,
            zIndex: 10,
            top: `${20 * scale}px`,
            display: "flex",
            alignItems: "center",
            gap: `${10 * scale}px`,
          }}
        >
          <div
            style={{
              cursor: "pointer",
              padding: `${8 * scale}px`,
            }}
            onClick={toggleAccessibilityInfo}
            aria-label="View accessibility information"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleAccessibilityInfo();
              }
            }}
          >
            <VisaQuestionHigh
              style={{
                width: `${55 * scale}px`,
                height: `${55 * scale}px`,
                color: "var(--palette-default-text)",
              }}
            />
          </div>
          <div
            style={{
              cursor: "pointer",
              padding: `${8 * scale}px`,
            }}
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <VisaModeLightHigh
                style={{
                  width: `${55 * scale}px`,
                  height: `${55 * scale}px`,
                  color: "var(--palette-default-text)",
                }}
                aria-label="Switch to light mode"
              />
            ) : (
              <VisaModeDarkHigh
                style={{
                  width: `${55 * scale}px`,
                  height: `${55 * scale}px`,
                  color: "var(--palette-default-text)",
                }}
                aria-label="Switch to dark mode"
              />
            )}
          </div>
        </div>
        {showAccessibilityInfo && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: isDarkMode
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
            onClick={toggleAccessibilityInfo}
            aria-modal="true"
            role="dialog"
          >
            <div
              style={{
                backgroundColor: isDark ? "#121212" : "#ffffff",
                color: isDark ? "#f5f5f5" : "#000000",
                padding: `${20 * scale}px`,
                borderRadius: `${12 * scale}px`,
                maxWidth: "600px",
                width: "100%",
                marginBottom: `${40 * scale}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: `${10 * scale}px` }}>
                How to Use This Website
              </h2>
              <p>
                NovaUI helps developers quickly generate UI components by
                describing what they want to build in plain English. Here's how
                to use the tool effectively:
              </p>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>
                  Type a description of the UI you want—e.g.,{" "}
                  <em>"responsive login form with remember me"</em>—into the
                  input field.
                </li>
                <li>
                  Press <strong>Enter</strong> to generate suggestions. The
                  system will return:
                  <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                    <li>
                      A list of relevant components from the Visa Design System
                    </li>
                    <li>
                      An auto-generated code snippet using those components
                    </li>
                  </ul>
                </li>
                <li>
                  Use the <strong>Tab</strong> key to move between focusable
                  elements, like input fields and buttons.
                </li>
                <li>
                  Use the <strong>arrow keys</strong> (← / →) to navigate
                  between tabs.
                </li>
                <li>
                  Press <strong>Enter</strong> or <strong>Space</strong> to
                  activate a selected tab and view its content.
                </li>
                <li>
                  Click the <strong>copy</strong> icon next to any code block to
                  copy it to your clipboard for easy use in your own project.
                </li>
                <li>
                  Toggle between <strong>light and dark modes</strong> using the
                  icon in the top right—NovaUI also respects your system’s
                  default theme.
                </li>
                <li>
                  If the tool takes a few seconds to load on first use, please
                  wait—backend initialization may cause a brief delay.
                </li>
              </ul>

              <button
                onClick={toggleAccessibilityInfo}
                style={{
                  marginTop: `${10 * scale}px`,
                  padding: `${8 * scale}px ${16 * scale}px`,
                  backgroundColor: isDark ? "#ffffff" : "#000000",
                  color: isDark ? "#000000" : "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div
          className={`appContainer ${navExpanded ? "" : "collapsed"}`}
          style={{
            "--sidebar-width": navExpanded
              ? `${400 * scale}px`
              : `${80 * scale}px`,
          }}
        >
          <Sidebar
            navExpanded={navExpanded}
            setNavExpanded={setNavExpanded}
            messages={messages}
            setQuery={setQuery}
            clearHistory={clearHistory}
          />
          <ChatBot
            showGreeting={showGreeting}
            messages={messages}
            copiedIndex={copiedIndex}
            copyToClipboard={copyToClipboard}
            showWelcome={showWelcome}
            setShowWelcome={setShowWelcome}
            query={query}
            handleQueryChange={handleQueryChange}
            handleGenerate={handleGenerate}
            textareaRef={textareaRef}
            messagesEndRef={messagesEndRef}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
