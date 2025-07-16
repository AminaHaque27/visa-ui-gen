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
  VisaAccountTiny,
} from "@visa/nova-icons-react";

export default function Sidebar({
  navExpanded,
  setNavExpanded,
  messages,
  setQuery,
  clearHistory,
}) {
  return (
    <Nav id="generator-sidebar" alternate orientation="vertical" tag="header">
      <UtilityFragment
        vFlex
        vFlexCol
        vGap={12}
        vMarginTop={16}
        vMarginRight={navExpanded ? 16 : 4} // Reduced when collapsed for tighter fit
        vMarginBottom={30}
        vMarginLeft={navExpanded ? 20 : 4} // Reduced when collapsed
      >
        <Link noUnderline href="#">
          {/* <VisaLogo /> */} {/* Kept commented as in your code */}
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
                  background: "transparent", // <--- remove background
                  boxShadow: "none", // optional: remove any shadow/glow
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
                paddingTop: "4px",
                fontWeight: "50",
                fontSize: "30px",
              }}
            >
              History
            </Typography>
          </UtilityFragment>

          <Tabs
            orientation="vertical"
            style={{ marginBottom: "40px", marginTop: "20px" }}
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
                    <VisaAccountTiny size={50} style={{ marginRight: "8px" }} />
                    <span className="tab-label">{msg.text.slice(0, 30)}</span>
                  </Button>
                </Tab>
              ))}
          </Tabs>
          <Button
            variant="tertiary"
            onClick={clearHistory}
            style={{
              margin: "0 auto 16px auto",
              fontSize: "1.3rem",
              padding: "10px 16px",
              display: "block",
              width: "60%",
              textAlign: "center",
            }}
          >
            🗑️ Clear History
          </Button>

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
