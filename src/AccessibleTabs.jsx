import { useState, useRef } from "react";

export default function AccessibleTabs({ tabs }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef([]);

  const handleKeyDown = (e) => {
    const count = tabs.length;
    let newIndex = selectedIndex;

    switch (e.key) {
      case "ArrowRight":
        newIndex = (selectedIndex + 1) % count;
        break;
      case "ArrowLeft":
        newIndex = (selectedIndex - 1 + count) % count;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = count - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    setSelectedIndex(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div role="tablist" aria-label="Tabs">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          ref={(el) => (tabRefs.current[index] = el)}
          aria-selected={selectedIndex === index}
          aria-controls={`panel-${tab.id}`}
          tabIndex={selectedIndex === index ? 0 : -1}
          onClick={() => setSelectedIndex(index)}
          onKeyDown={handleKeyDown}
        >
          {tab.label}
        </button>
      ))}

      <div
        id={`panel-${tabs[selectedIndex].id}`}
        role="tabpanel"
        aria-labelledby={`tab-${tabs[selectedIndex].id}`}
      >
        {tabs[selectedIndex].content}
      </div>
    </div>
  );
}
