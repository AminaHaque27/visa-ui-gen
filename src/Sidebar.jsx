import {
  Button,
  Divider,
  Link,
  Nav,
  Tab,
  Tabs,
  Typography,
  Utility,
  UtilityFragment,
  VisaLogo,
} from "@visa/nova-react";
import {
  VisaMediaRewindTiny,
  VisaMediaFastForwardTiny,
  VisaFavoriteStarOutlineLow,
} from "@visa/nova-icons-react";

import { useEffect, useRef, useState } from "react";
import "./Sidebar.css";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function truncateText(text, width) {
  if (width > 1200) return text.slice(0, 60);
  if (width > 800) return text.slice(0, 40);
  return text.slice(0, 25);
}

export default function Sidebar({
  navExpanded,
  setNavExpanded,
  messages,
  setQuery,
  clearHistory,
}) {
  const width = useWindowWidth();

  let scale = 0.67;
  if (width <= 1200) scale = 0.67 * 0.9;
  if (width <= 800) scale = 0.67 * 0.8;
  if (width <= 480) scale = 0.67 * 0.7;

  const historyRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!historyRef.current) return;

      const buttons = Array.from(historyRef.current.querySelectorAll("button")); // Get all history buttons
      const focusedIndex = buttons.findIndex(
        (btn) => btn === document.activeElement
      );

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (focusedIndex + 1) % buttons.length;
        buttons[nextIndex].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = (focusedIndex - 1 + buttons.length) % buttons.length;
        buttons[prevIndex].focus();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        document.activeElement.click();
      }
    };

    const container = historyRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [messages]);

  return (
    <Nav
      id="generator-sidebar"
      alternate
      orientation="vertical"
      tag="header"
      style={{
        width: navExpanded ? `${400 * scale}px` : `${80 * scale}px`,
        transition: "width 0.3s ease",
        height: "100%",
        minHeight: "0",
        overflowY: "auto",
      }}
    >
      <UtilityFragment
        vFlex
        vFlexCol
        vGap={12 * scale}
        vMarginTop={16 * scale}
        vMarginRight={navExpanded ? 16 * scale : 4 * scale}
        vMarginBottom={30 * scale}
        vMarginLeft={navExpanded ? 20 * scale : 4 * scale}
      >
        <Link noUnderline href="#">
          {/* <VisaLogo /> */}
          <UtilityFragment
            vMarginLeft={navExpanded ? "auto" : 5 * scale}
            vMarginRight={navExpanded ? 8 * scale : 5 * scale}
          >
            <div className="sticky-toggle">
              <Button
                aria-label="Toggle navigation"
                aria-expanded={!!navExpanded}
                buttonSize="large"
                colorScheme="tertiary"
                iconButton
                iconTwoColor
                onClick={() => setNavExpanded(!navExpanded)}
                subtle
                style={{
                  transform: "scale(1.2)",
                  background: "transparent",
                  boxShadow: "none",
                }}
              >
                {navExpanded ? (
                  <VisaMediaRewindTiny rtl size={24 * scale} />
                ) : (
                  <VisaMediaFastForwardTiny rtl size={24 * scale} />
                )}
              </Button>
            </div>
          </UtilityFragment>
        </Link>
      </UtilityFragment>

      {navExpanded && (
        <>
          <UtilityFragment vGap={8 * scale}>
            <Typography
              variant="subtitle-1"
              className="nav-heading"
              style={{
                paddingLeft: `${120 * scale}px`,
                marginTop: `-${48 * scale}px`,
                fontWeight: "50",
                fontSize: `${30 * scale}px`,
              }}
            >
              History
            </Typography>
          </UtilityFragment>

          {/* MODIFIED: Added ref, tabindex for container focus, ARIA roles for tablist-like behavior, and keyboard handling */}
          <Tabs
            ref={historyRef}
            orientation="vertical"
            role="tablist"
            aria-label="History items"
            tabIndex={0}
            style={{
              marginBottom: `${40 * scale}px`,
              marginTop: `${40 * scale}px`,
            }}
          >
            {messages
              .filter((m) => m.type === "user")
              .map((msg, index) => (
                <Tab key={`msg-${index}`} role="tab" aria-selected="false">
                  {" "}
                  {/* ARIA for tabs; update aria-selected dynamically if needed */}
                  <Button
                    colorScheme="tertiary"
                    onClick={() => setQuery(msg.text)}
                    aria-label={`Select history item: ${msg.text}`} // Improved aria-label for screen readers
                    className="history-tab"
                  >
                    <VisaFavoriteStarOutlineLow
                      size={50 * scale}
                      style={{ marginRight: `${8 * scale}px` }}
                    />
                    <div
                      className="tab-label"
                      title={msg.text}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "inline-block",
                        maxWidth: `${280 * scale}px`,
                        lineHeight: "1.4",
                        verticalAlign: "middle",
                        transition: "color 0.2s ease",
                        color: "#fff",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#FCC015")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#fff")
                      }
                    >
                      {truncateText(msg.text, width)}
                    </div>
                  </Button>
                </Tab>
              ))}
          </Tabs>

          <div
            style={{
              position: "absolute",
              bottom: `${20 * scale}px`,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Button
              variant="tertiary"
              onClick={clearHistory}
              style={{
                fontSize: `${1.5 * scale}rem`,
                fontWeight: "200",
                padding: `${10 * scale}px ${16 * scale}px`,
                width: "80%",
                maxWidth: `${240 * scale}px`,
                margin: "0 auto",
                backgroundColor: "transparent",
                color: "#ffffff",
                border: `1px solid #ffffff`,
                boxShadow: "none",
                borderRadius: `${8 * scale}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                marginLeft: `${60 * scale}px`,
              }}
            >
              Clear History
            </Button>
          </div>

          <Utility
            vFlex
            vFlexCol
            vAlignSelf="stretch"
            vGap={4 * scale}
            vMarginTop="auto"
          >
            <Divider dividerType="decorative" />
          </Utility>
        </>
      )}
    </Nav>
  );
}
