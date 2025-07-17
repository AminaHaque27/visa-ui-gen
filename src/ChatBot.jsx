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
}) {
  return (
    <div className="mainContent">
      <div className={`centered-message ${!showGreeting ? "fade-out" : ""}`}>
        <Typography
          variant="display-2"
          style={{ marginBottom: "-1000px", marginTop: "270px" }}
        >
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
              className={`chat-bubble ${msg.type === "user" ? "user" : "bot"}`}
              style={{
                alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Typography
                variant="body-1"
                style={{
                  marginBottom: msg.suggestions ? "8px" : "0",
                  fontSize: msg.type === "user" ? "1.5rem" : "1rem",
                }}
              >
                {msg.text}
              </Typography>

              {msg.code && msg.type === "bot" && (
                <>
                  <BotCodeReveal
                    code={msg.code}
                    suggestions={msg.suggestions}
                    reasoning={msg.reasoning}
                    copied={copiedIndex === idx}
                    onCopy={() => copyToClipboard(msg.code, idx)}
                    codeTitle={messages[idx - 1]?.text || "your request"}
                  />
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Utility>
      </div>

      <div className="input-area">
        {showWelcome && (
          <div className="welcome-message" style={{ position: "relative" }}>
            <Typography
              variant="headline-1"
              style={{
                marginBottom: "8px",
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
                top: "80px",
                left: "0",
                fontSize: "20px",
                color: "var(--text-primary)",
                maxWidth: "1000px",
                marginRight: "20px",
                marginLeft: "25px",
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
                top: "8px",
                right: "15px",
                cursor: "pointer",
                background: "transparent",
                border: "none",
                padding: 0,
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
              <VisaSendHigh size={24} />
            </div>
          )}
        </Utility>
      </div>
    </div>
  );
}
