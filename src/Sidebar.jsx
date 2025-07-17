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
  const width = useWindowWidth(); // ✅ Use it here

  return (
    <Nav
      id="generator-sidebar"
      alternate
      orientation="vertical"
      tag="header"
      style={{
        width: navExpanded ? "400px" : "80px",
        transition: "width 0.3s ease",
      }}
    >
      <UtilityFragment
        vFlex
        vFlexCol
        vGap={12}
        vMarginTop={16}
        vMarginRight={navExpanded ? 16 : 4}
        vMarginBottom={30}
        vMarginLeft={navExpanded ? 20 : 4}
      >
        <Link noUnderline href="#">
          {/* <VisaLogo /> */}
          <UtilityFragment
            vMarginLeft={navExpanded ? "auto" : 5}
            vMarginRight={navExpanded ? 8 : 5}
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
                  <VisaMediaRewindTiny rtl size={24} />
                ) : (
                  <VisaMediaFastForwardTiny rtl size={24} />
                )}
              </Button>
            </div>
          </UtilityFragment>
        </Link>
      </UtilityFragment>

      {navExpanded && (
        <>
          <UtilityFragment vGap={8}>
            <Typography
              variant="subtitle-1"
              className="nav-heading"
              style={{
                paddingLeft: "120px",
                marginTop: "-73px",
                fontWeight: "50",
                fontSize: "30px",
              }}
            >
              History
            </Typography>
          </UtilityFragment>

          <Tabs
            orientation="vertical"
            style={{ marginBottom: "40px", marginTop: "40px" }}
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
                      size={50}
                      style={{ marginRight: "8px" }}
                    />
                    <div
                      className="tab-label"
                      title={msg.text}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "inline-block",
                        maxWidth: "280px",
                        lineHeight: "1.4",
                        verticalAlign: "middle",
                        transition: "color 0.2s ease", // optional smooth transition
                        color: "#fff", // base color
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
              bottom: "20px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Button
              variant="tertiary"
              onClick={clearHistory}
              style={{
                fontSize: "1.5rem",
                fontWeight: "200",
                padding: "10px 16px",
                width: "80%",
                maxWidth: "240px",
                margin: "0 auto",
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "1px solid #ffffff",
                boxShadow: "none",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                marginLeft: "60px",
              }}
            >
              Clear History
            </Button>
          </div>

          <Utility
            vFlex
            vFlexCol
            vAlignSelf="stretch"
            vGap={4}
            vMarginTop="auto"
          >
            <Divider dividerType="decorative" />
          </Utility>
        </>
      )}
    </Nav>
  );
}
