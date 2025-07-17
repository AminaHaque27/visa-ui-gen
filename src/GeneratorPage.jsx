import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import { Toaster, toast } from "react-hot-toast";
import "./galaxy.css"; // base styles
import "./GeneratorPage.css"; // overrides (dark mode vars)
import { VisaModeDarkHigh, VisaModeLightHigh } from "@visa/nova-icons-react";

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

  const clearHistory = async () => {
    try {
      await fetch("http://localhost:8000/queries", { method: "DELETE" }); // clear server
    } catch (err) {
      console.error("Failed to clear backend history:", err);
    }

    localStorage.removeItem("nova-history"); // optional if you're persisting
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

    const userMessage = { type: "user", text: query };
    const newId = `hist-${history.length}`;
    const label = query.slice(0, 20) + (query.length > 20 ? "..." : "");

    // Step 1: Fetch component suggestion
    const { components, code, reasoning } = await getComponentInfo(query);

    const systemMessage = {
      type: "bot",
      text: null,
      suggestions: components,
      code: code,
      reasoning: reasoning, // ← add this line
    };

    setMessages((prev) => [...prev, userMessage, systemMessage]);

    // Step 2: Save to backend
    try {
      const saveResponse = await fetch("http://localhost:8000/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, components, code, reasoning }),
      });

      const { shared_id } = await saveResponse.json();
      toast.success(`✅ Query saved! Share link: /queries/${shared_id}`);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("⚠️ Failed to save query");
    }

    // Step 3: Store in local state/history
    const newItem = { id: newId, label, query, components, code };
    setHistory((prev) => [...prev, newItem]);
    setQuery("");
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

      <div className="page-container">
        <Toaster /> {/* Required for toast notifications */}
        <div
          style={{
            position: "absolute",
            left: navExpanded ? "430px" : "100px", // adjusts based on sidebar
            zIndex: 10,
            fontSize: "30px",
            fontWeight: "500",
            fontFamily: "Visa Sans Text, sans-serif",
            transition: "left 0.3s ease",
            top: "50px",
            background:
              "linear-gradient(90deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NovaUI
        </div>
        <div
          style={{
            position: "absolute",
            right: "50px",
            zIndex: 10,
            cursor: "pointer",
            padding: "8px",
            top: "20px",
          }}
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <VisaModeLightHigh
              style={{
                width: "55px",
                height: "55px",
                color: "var(--palette-default-text)",
              }}
              aria-label="Switch to light mode"
            />
          ) : (
            <VisaModeDarkHigh
              style={{
                width: "55px",
                height: "55px",
                color: "var(--palette-default-text)",
              }}
              aria-label="Switch to dark mode"
            />
          )}
        </div>
        <div className={`appContainer ${navExpanded ? "" : "collapsed"}`}>
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
          />
        </div>
      </div>
    </>
  );
}
