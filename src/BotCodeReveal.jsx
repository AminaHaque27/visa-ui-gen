import { useState, useRef, useEffect } from "react";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import * as Nova from "@visa/nova-react";
import * as NovaIcons from "@visa/nova-icons-react";
import { Button, Typography } from "@visa/nova-react";
import "./BotCodeReveal.css";
import { VisaDocumentHigh } from "@visa/nova-icons-react";

export default function BotCodeReveal({ code, suggestions, copied, onCopy }) {
  const [open, setOpen] = useState(false);
  const [showComponents, setShowComponents] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (open && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [open]);

  return (
    <div className="bot-code-reveal" ref={sectionRef}>
      <Typography variant="headline-1" className="bot-heading">
        Based on your description, here are suggested components
      </Typography>

      {/* Open/Hide Toggle */}
      <Button
        variant="primary"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className="toggle-open-btn"
      >
        {open ? "Hide" : "Open"}
      </Button>

      {/* Expandable Section */}
      <div
        className="bot-section"
        style={{ maxHeight: open ? "1000px" : "0px" }}
      >
        {/* Component Suggestions */}
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

        {/* Code Toggle */}
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
              <VisaDocumentHigh size={32} />
              {copied ? " Copied!" : " Copy"}
            </Button>
          </div>
        )}

        {/* Preview Toggle */}
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
              style={{ marginTop: "10px", fontSize: "1.5rem" }}
            >
              Live Preview:
            </Typography>
            <LiveProvider code={code} scope={{ ...Nova, ...NovaIcons }}>
              <div className="preview-box">
                <div className="preview-content">
                  <LivePreview />
                </div>
              </div>
              <LiveError style={{ color: "red", fontSize: "0.9rem" }} />
            </LiveProvider>
          </>
        )}
      </div>
    </div>
  );
}
