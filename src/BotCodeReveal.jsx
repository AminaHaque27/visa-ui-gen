import { useState, useRef, useEffect } from "react";
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
  const [open, setOpen] = useState(true);
  const [showComponents, setShowComponents] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const sectionRef = useRef(null);
  const sectionContentRef = useRef(null);
  const [height, setHeight] = useState(0);

  // Scale factor: reduce all size-related values to 75% of original
  const scale = 0.75;

  useEffect(() => {
    if (open && sectionContentRef.current) {
      setHeight(sectionContentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open, showCode, showPreview, showComponents, reasoning]);

  return (
    <div className="bot-code-reveal" ref={sectionRef}>
      <Typography variant="headline-2" className="bot-heading">
        Suggestions for:{" "}
        <span style={{ color: "var(--text-accent)" }}>{codeTitle}</span>
      </Typography>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className="toggle-open-btn"
      >
        {open ? "Hide" : "Open"}
      </Button>
      <div
        className="bot-section"
        ref={sectionRef}
        style={{
          maxHeight: `${height}px`,
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
        }}
      >
        <div ref={sectionContentRef}>
          {suggestions?.length > 0 && (
            <>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setShowComponents((p) => !p)}
                className="toggle-components-btn"
              >
                {showComponents ? "Hide Components" : "Show Components"}
              </Button>
              {showComponents && (
                <ul className="bot-code-suggestions">
                  {suggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              )}
            </>
          )}

          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setShowCode((p) => !p)}
            className="toggle-code-btn"
          >
            {showCode ? "Hide Code" : "Show Code"}
          </Button>
          {showCode && (
            <div className="code-box-with-copy">
              <pre className="code-snippet">{code}</pre>
              <Button
                variant="tertiary"
                size="sm"
                onClick={onCopy}
                aria-label="Copy code to clipboard"
                className="icon-copy-btn"
              >
                <VisaDocumentHigh size={32 * scale} />
                {copied ? " Copied!" : " Copy"}
              </Button>
            </div>
          )}

          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setShowPreview((p) => !p)}
            className="toggle-preview-btn"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          {showPreview && (
            <>
              <Typography
                variant="subtitle-2"
                style={{
                  marginTop: `${10 * scale}px`,
                  fontSize: `${1.5 * scale}rem`,
                }}
              >
                Live Preview:
              </Typography>
              <LiveProvider code={code} scope={{ ...Nova, ...NovaIcons }}>
                <div className="preview-box">
                  <div className="preview-content">
                    <LivePreview />
                  </div>
                </div>
                <LiveError
                  style={{ color: "red", fontSize: `${0.9 * scale}rem` }}
                />
              </LiveProvider>
            </>
          )}

          {reasoning && (
            <div
              style={{
                marginTop: `${25 * scale}px`,
                padding: `${16 * scale}px`,
                backgroundColor: "var(--background-secondary)",
                borderRadius: `${12 * scale}px`,
                fontSize: `${2 * scale}rem`,
                lineHeight: "1.6",
                color: "var(--text-primary)",
              }}
            >
              <Typography
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
            </div>
          )}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
