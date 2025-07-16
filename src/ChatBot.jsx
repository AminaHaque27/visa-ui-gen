import {
  Button,
  Input,
  InputContainer,
  Typography,
  Utility,
} from "@visa/nova-react";
import { VisaSendHigh, VisaCloseLow } from "@visa/nova-icons-react";

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
                    size="lg"
                    onClick={() => copyToClipboard(msg.code, idx)}
                    aria-label="Copy code to clipboard"
                    className="copy-button"
                  >
                    {copiedIndex === idx ? "✅ Copied!" : "Copy Code"}
                  </Button>
                  <div className="live-preview">
                    <Typography
                      variant="subtitle-2"
                      style={{ marginTop: "10px" }}
                    >
                      Live Preview:
                    </Typography>
                    <div
                      className="preview-box"
                      dangerouslySetInnerHTML={{ __html: msg.code }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Utility>
      </div>

      <div className="input-area">
        {showWelcome && (
          <div className="welcome-message">
            <Typography
              variant="headline-1"
              style={{ marginBottom: "8px", textAlign: "left" }}
            >
              Welcome to NovaUI, your personal UI assistant
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
  );
}
