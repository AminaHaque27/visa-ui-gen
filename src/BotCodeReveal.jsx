import { LiveProvider, LiveError, LivePreview } from "react-live";
import * as Nova from "@visa/nova-react";
import * as NovaIcons from "@visa/nova-icons-react";
import { Button, Typography } from "@visa/nova-react";
import "./BotCodeReveal.css";
import { VisaDocumentHigh } from "@visa/nova-icons-react";

export default function BotCodeReveal({
  code,
  suggestions,
  copied,
  onCopy,
  reasoning,
  codeTitle,
}) {
  const scale = 0.75;

  return (
    <div className="bot-code-reveal">
      <div className="bot-card-wrapper">
        <Typography variant="headline-2" className="bot-heading">
          Suggestions for:{" "}
          <span style={{ color: "var(--text-accent)" }}>{codeTitle}</span>
        </Typography>

        <div
          className="bot-section"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${24 * scale}px`,
            paddingLeft: `${10 * scale}px`,
          }}
        >
          {/*  Components */}
          {suggestions?.length > 0 && (
            <section role="region" aria-labelledby="components-heading">
              <Typography
                id="components-heading"
                variant="headline-3"
                style={{
                  color: "var(--text-accent)",
                  borderLeft: `4px solid var(--text-accent)`,
                  paddingLeft: `${8 * scale}px`,
                }}
              >
                Components
              </Typography>
              <ul className="bot-code-suggestions">
                {suggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </section>
          )}
          {/*  Code */}
          <section role="region" aria-labelledby="code-heading">
            <Typography
              id="code-heading"
              variant="headline-3"
              style={{
                color: "var(--text-accent)",
                borderLeft: `4px solid var(--text-accent)`,
                paddingLeft: `${8 * scale}px`,
              }}
            >
              Code
            </Typography>
            <div className="code-box-wrapper">
              <pre className="code-snippet">{code}</pre>
              <div className="code-copy-bottom">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={onCopy}
                  aria-label={
                    copied
                      ? "Code copied to clipboard"
                      : "Copy code to clipboard"
                  }
                  aria-live="polite"
                  className="icon-copy-btn"
                >
                  <VisaDocumentHigh size={28 * scale} />
                  {copied ? " Copied!" : " Copy"}
                </Button>
              </div>
            </div>
          </section>
          {/*  Preview */}
          <section role="region" aria-labelledby="preview-heading">
            <Typography
              id="preview-heading"
              variant="headline-3"
              style={{
                color: "var(--text-accent)",
                borderLeft: `4px solid var(--text-accent)`,
                paddingLeft: `${8 * scale}px`,
              }}
            >
              UI Preview
            </Typography>
            <LiveProvider code={code} scope={{ ...Nova, ...NovaIcons }}>
              <div className="preview-box" tabIndex={-1}>
                {" "}
                {/* tabIndex=-1 to allow programmatic focus if needed, but not tabbable by default */}
                <div className="preview-content">
                  <LivePreview />
                </div>
              </div>
              <LiveError
                style={{ color: "red", fontSize: `${0.9 * scale}rem` }}
                role="alert"
              />
            </LiveProvider>
          </section>
          {/*  Reasoning */}
          {reasoning && (
            <section
              role="region"
              aria-labelledby="reasoning-heading"
              style={{
                padding: `${32 * scale}px`,
                backgroundColor: "var(--bg-secondary)",
                borderRadius: `${16 * scale}px`,
                fontSize: `${2 * scale}rem`,
                lineHeight: "1.6",
                color: "var(--text-primary)",
                width: "100%",
                maxWidth: "100%",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Typography
                id="reasoning-heading"
                variant="headline-3"
                style={{ marginBottom: `${8 * scale}px` }}
              >
                Why these components?
              </Typography>
              <Typography
                variant="body-1"
                style={{ fontSize: `${1.3 * scale}rem` }}
              >
                {reasoning}
              </Typography>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
