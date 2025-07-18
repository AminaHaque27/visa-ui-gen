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

import { useEffect, useState } from "react";
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

  // Scale factor: reduce all size-related values to 67% of original
  const scale = 0.67;

  return (
    <Nav
      id="generator-sidebar"
      alternate
      orientation="vertical"
      tag="header"
      style={{
        width: navExpanded ? `${400 * scale}px` : `${80 * scale}px`,
        transition: "width 0.3s ease",
        height: "100%", // Height remains 100% as it's relative
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

          <Tabs
            orientation="vertical"
            style={{
              marginBottom: `${40 * scale}px`,
              marginTop: `${40 * scale}px`,
            }}
          >
            {messages
              .filter((m) => m.type === "user")
              .map((msg, index) => (
                <Tab key={`msg-${index}`}>
                  <Button
                    colorScheme="tertiary"
                    onClick={() => setQuery(msg.text)}
                    aria-label={`History item ${index + 1}`}
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
