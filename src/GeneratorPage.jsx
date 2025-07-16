import { useState, useRef, useEffect } from "react";
import {
  Button,
  Divider,
  Input,
  InputContainer,
  Label,
  Link,
  Nav,
  NavAppName,
  Tab,
  TabSuffix,
  Tabs,
  Typography,
  Utility,
  UtilityFragment,
  VisaLogo,
} from "@visa/nova-react";
import {
  VisaSendHigh,
  VisaCloseLow,
  VisaMediaRewindTiny,
  VisaMediaFastForwardTiny,
  VisaChevronDownTiny,
  VisaChevronUpTiny,
  VisaAccountTiny,
} from "@visa/nova-icons-react";
import "./GeneratorPage.css";

export default function GeneratorPage() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [navExpanded, setNavExpanded] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);
  const [messages, setMessages] = useState([]);

  const handleQueryChange = (e) => {
    if (showGreeting) setShowGreeting(false); // fade "Hello!" once
    setQuery(e.target.value);
  };

  const handleGenerate = () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };

    const newId = `hist-${history.length}`;
    const label = query.slice(0, 20) + (query.length > 20 ? "..." : "");
    const components = getSuggestedComponents(query);
    const code = getCodeSnippet(query);

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

  const getSuggestedComponents = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes("login")) {
      return [
        "Input: For username/email and password fields.",
        'Checkbox: For "Remember me" option.',
        "Button: For submit action.",
        "Form: To wrap the login form.",
        "Link: For forgot password.",
      ];
    } else if (lower.includes("form")) {
      return [
        "Form: Container for form elements.",
        "Input: Text input fields.",
        "Input (multiline): Multi-line input.",
        "Button: Submit button.",
      ];
    } else if (lower.includes("navigation")) {
      return [
        "Nav: Navigation container.",
        "Tabs: For tabbed navigation.",
        "Link: For navigation links.",
      ];
    } else if (lower.includes("card")) {
      return [
        "ContentCard: For displaying content in cards.",
        "ContentCardTitle: Card title.",
        "ContentCardBody: Card body.",
      ];
    } else {
      return [
        "Typography: For text elements.",
        "Button: General purpose buttons.",
        "Utility: For layout utilities.",
      ];
    }
  };

  const getCodeSnippet = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes("login")) {
      return `<div>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <input type="checkbox" /> Remember me
  <button>Login</button>
</div>`;
    }
    return `<div>
  <p>${q}</p>
  <button>Action</button>
</div>`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert("Code copied!"));
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  return (
    <div className={`appContainer ${navExpanded ? "" : "collapsed"}`}>
      <Nav id="generator-sidebar" alternate orientation="vertical" tag="header">
        {navExpanded && (
          <>
            <UtilityFragment
              vFlex
              vFlexCol
              vGap={12}
              vMarginTop={16}
              vMarginRight={16}
              vMarginBottom={30}
              vMarginLeft={20}
            >
              <Link noUnderline href="#">
                <VisaLogo />
                <NavAppName>
                  <Typography variant="subtitle-1">SheepStack</Typography>
                </NavAppName>
              </Link>
            </UtilityFragment>

            <nav aria-label="Query History">
              <UtilityFragment vGap={8}>
                <Tabs orientation="vertical">
                  {messages
                    .filter((m) => m.type === "user")
                    .map((msg, index) => (
                      <Tab key={`msg-${index}`}>
                        <Button
                          colorScheme="tertiary"
                          onClick={() => setQuery(msg.text)}
                          aria-label={`History item ${index + 1}`}
                          style={{ textAlign: "left", width: "100%" }}
                        >
                          {msg.text.slice(0, 30)}
                        </Button>
                      </Tab>
                    ))}
                </Tabs>
              </UtilityFragment>
            </nav>
          </>
        )}
        <Utility vFlex vFlexCol vAlignSelf="stretch" vGap={4} vMarginTop="auto">
          <Divider dividerType="decorative" />
          <UtilityFragment
            vMarginLeft={navExpanded ? "auto" : 5}
            vMarginRight={navExpanded ? 8 : 5}
          >
            <Button
              aria-label="Toggle navigation"
              aria-expanded={!!navExpanded}
              buttonSize="small"
              colorScheme="tertiary"
              iconButton
              iconTwoColor
              onClick={() => setNavExpanded(!navExpanded)}
              subtle
            >
              {navExpanded ? (
                <VisaMediaRewindTiny rtl />
              ) : (
                <VisaMediaFastForwardTiny rtl />
              )}
            </Button>
          </UtilityFragment>
        </Utility>
      </Nav>
      <div className="mainContent">
        <div className={`centered-message ${!showGreeting ? "fade-out" : ""}`}>
          <Typography variant="display-2" style={{ marginBottom: "16px" }}>
            <span className="gradient-text">Hello!</span> What would you like to
            build today?
          </Typography>
        </div>

        <div className="message-area">
          <Utility
            vFlex
            vFlexCol
            vGap={12}
            style={{
              width: "100%",
              maxWidth: "900px",
              alignItems: "center",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${
                  msg.type === "user" ? "user" : "bot"
                }`}
                style={{
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Typography
                  variant="body-1"
                  style={{ marginBottom: msg.suggestions ? "8px" : "0" }}
                >
                  {msg.text}
                </Typography>

                {msg.suggestions && (
                  <ul>
                    {msg.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                )}

                {msg.code && (
                  <>
                    <pre className="code-snippet">{msg.code}</pre>
                    <Button
                      variant="secondary"
                      onClick={() => copyToClipboard(msg.code)}
                      aria-label="Copy code to clipboard"
                    >
                      Copy Code
                    </Button>
                  </>
                )}
              </div>
            ))}
          </Utility>
        </div>

        <div className="input-area">
          {showWelcome && (
            <div className="welcome-message">
              <Typography
                variant="headline-1"
                style={{ marginBottom: "8px", textAlign: "left" }}
              >
                Welcome to SheepStack, your personal UI assistant
              </Typography>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setShowWelcome(false)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "15px",
                  cursor: "pointer",
                  background: "transparent", // transparent background
                  border: "none", // no border
                  padding: 0, // no extra space
                }}
                aria-label="Close welcome message"
              >
                <VisaCloseLow size={24} color="#0040dd" />
              </Button>
            </div>
          )}

          <Utility
            vFlex
            vFlexCol
            vGap={4}
            style={{ width: "100%", maxWidth: "900px", position: "relative" }}
          >
            <InputContainer
              style={{
                minHeight: "150px",
                minWidth: "1165px",
                borderRadius: "16px",
              }}
            >
              <Input
                id="query-input"
                multiline
                rows={4}
                placeholder="Ask SheepStack"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                ref={textareaRef}
                className="body-1-textarea"
              />
            </InputContainer>
            {query.trim() && (
              <div
                className="send-icon"
                role="button"
                aria-label="Send input"
                onClick={handleGenerate}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleGenerate();
                }}
              >
                <VisaSendHigh size={24} />
              </div>
            )}
          </Utility>
        </div>
      </div>
    </div>
  );
}
