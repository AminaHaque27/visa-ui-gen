import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import componentMap from "./componentMap.json";
import { Toaster, toast } from "react-hot-toast";
import "./GeneratorPage.css";
import "./galaxy.css";

const getComponentInfo = (query) => {
  const lower = query.toLowerCase();

  for (const key in componentMap) {
    if (lower.includes(key)) {
      return {
        components: componentMap[key].components,
        code: componentMap[key].code,
      };
    }
  }

  // fallback/default
  return {
    components: [
      "Typography: For text elements.",
      "Button: General purpose buttons.",
    ],
    code: `<div>\n  <p>${query}</p>\n  <button>Action</button>\n</div>`,
  };
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

  const clearHistory = () => {
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

  const handleGenerate = () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };

    const newId = `hist-${history.length}`;
    const label = query.slice(0, 20) + (query.length > 20 ? "..." : "");
    const { components, code } = getComponentInfo(query);

    const systemMessage = {
      type: "bot",
      text: "Based on your description, here are suggested Visa components:",
      suggestions: components,
      code: code,
    };

    setMessages((prev) => [...prev, userMessage, systemMessage]);

    const newItem = { id: newId, label, query, components, code };
    setHistory([...history, newItem]);
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
    const saved = localStorage.getItem("nova-history");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
      setHistory(
        parsed
          .filter((m) => m.type === "user")
          .map((m, i) => ({
            id: `hist-${i}`,
            label: m.text.slice(0, 20),
            query: m.text,
            components: m.suggestions || [],
            code: m.code || "",
          }))
      );
    }
  }, []);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("nova-history", JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <>
      {/* Animated floating blue specs background */}
      <div className="galaxy-background">
        <div className="stars"></div>
        <div className="shooting-star"></div>
      </div>
      <Toaster /> {/* Required for toast notifications */}
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
    </>
  );
}
