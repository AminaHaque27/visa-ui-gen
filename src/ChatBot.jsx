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
  // Scale factor: reduce all size-related values to 75% of original
  const scale = 0.75;

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
                className={`chat-bubble ${
                  msg.type === "user" ? "user" : "bot"
                }`}
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
              <div
                className="chat-bubble bot"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  fontStyle: "italic",
                  opacity: 0.7,
                  padding: "1.2rem 1.5rem",
                  borderRadius: "12px",
                  textAlign: "left",
                  maxWidth: "700px",
                  alignSelf: "flex-start",
                  fontSize: "1.7rem",
                  lineHeight: "1.5",
                  color: "var(--text-secondary)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
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
