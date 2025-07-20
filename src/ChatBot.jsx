import {
  Button,
  Input,
  InputContainer,
  Typography,
  Utility,
} from "@visa/nova-react";
import { VisaSendHigh, VisaCloseLow } from "@visa/nova-icons-react";
import BotCodeReveal from "./BotCodeReveal";
import "./ChatBot.css";
import { useEffect, useState } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function ChatBot({
  showGreeting,
  messages,
  copiedIndex,
  copyToClipboard,
  showWelcome,
  setShowWelcome,
  query,
  handleQueryChange,
  handleGenerate,
  textareaRef,
  messagesEndRef,
  isLoading,
}) {
  const width = useWindowWidth();

  // Dynamic scale factor based on window width to adjust sizes proportionally
  let baseScale = 0.75;
  let adjustment = 1;
  if (width <= 1200) adjustment = 0.9;
  if (width <= 800) adjustment = 0.8;
  if (width <= 480) adjustment = 0.7;
  const scale = baseScale * adjustment;

  useEffect(() => {
    document.documentElement.style.setProperty("--scale", scale);
  }, [scale]);

  return (
    <div className="mainContent">
      <div className={`centered-message ${!showGreeting ? "fade-out" : ""}`}>
        <Typography variant="display-2">
          <span className="gradient-text">Hello!</span> What would you like to
          build today?
        </Typography>
      </div>

      <div className="message-area">
        <div className="chat-scroll-wrapper">
          <Utility
            vFlex
            vFlexCol
            vGap={12 * scale}
            style={{
              width: "100%",
              maxWidth: `${700 * scale}px`,
              margin: "0 auto",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.type === "user"
                    ? "chat-bubble user"
                    : msg.code
                    ? "bot-card-container"
                    : "chat-bubble bot"
                }
                style={{
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Typography
                  variant="body-1"
                  style={{
                    marginBottom: msg.suggestions ? `${8 * scale}px` : "0",
                    fontSize:
                      msg.type === "user"
                        ? `${1.5 * scale}rem`
                        : `${1 * scale}rem`,
                  }}
                >
                  {msg.text}
                </Typography>

                {msg.code && msg.type === "bot" && (
                  <BotCodeReveal
                    code={msg.code}
                    suggestions={msg.suggestions}
                    reasoning={msg.reasoning}
                    copied={copiedIndex === idx}
                    onCopy={() => copyToClipboard(msg.code, idx)}
                    codeTitle={messages[idx - 1]?.text || "your request"}
                    defaultOpen={true}
                  />
                )}
              </div>
            ))}

            {isLoading && (
              <div className="chat-loading-bubble">
                <span>NovaUI is generating your component...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </Utility>
        </div>
      </div>

      <div className="input-area">
        {showWelcome && (
          <div className="welcome-message" style={{ position: "relative" }}>
            <Typography
              variant="headline-1"
              className="headline-1"
              style={{
                marginBottom: `${8 * scale}px`,
                textAlign: "left",
                position: "relative",
              }}
            >
              Welcome to NovaUI, your personal UI assistant
            </Typography>

            <Typography
              variant="body"
              style={{
                position: "absolute",
                top: `${80 * scale}px`,
                left: "0",
                fontSize: `${20 * scale}px`,
                color: "var(--text-primary)",
                maxWidth: `${1000 * scale}px`,
                marginRight: `${20 * scale}px`,
                marginLeft: `${25 * scale}px`,
                lineHeight: "1.4",
                pointerEvents: "none",
              }}
            >
              Describe what you want to build — like “responsive login form with
              remember me” — and NovaUI will suggest components and generate
              code.
            </Typography>

            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setShowWelcome(false)}
              style={{
                position: "absolute",
                top: `${8 * scale}px`,
                right: `${15 * scale}px`,
                cursor: "pointer",
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              aria-label="Close welcome message"
            >
              <VisaCloseLow size={24 * scale} color="#0040dd" />
            </Button>
          </div>
        )}

        <Utility
          vFlex
          vFlexCol
          vGap={4 * scale}
          style={{
            width: "100%",
            maxWidth: `${900 * scale}px`,
            position: "relative",
          }}
        >
          <InputContainer
            style={{
              minHeight: `${150 * scale}px`,
              minWidth: `${1108 * scale}px`,
              borderRadius: `${16 * scale}px`,
              backgroundColor: "var(--background)",
              border: "1px solid var(--preview-border)",
            }}
          >
            <Input
              id="query-input"
              as="textarea"
              rows={4}
              placeholder="Ask NovaUI"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              ref={textareaRef}
              className="nova-textarea"
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
              <VisaSendHigh size={24 * scale} />
            </div>
          )}
        </Utility>
      </div>
    </div>
  );
}
