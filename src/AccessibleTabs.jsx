import React, { useState } from "react";

const AccessibleTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      setActiveTab((index + 1) % tabs.length);
    } else if (e.key === "ArrowLeft") {
      setActiveTab((index - 1 + tabs.length) % tabs.length);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Tab menu"
      className="flex gap-4 border-b p-2 fixed bottom-4 left-4 bg-black rounded-md shadow-lg z-50"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          role="tab"
          id={`tab-${index}`}
          aria-selected={activeTab === index}
          aria-controls={`panel-${index}`}
          tabIndex={activeTab === index ? 0 : -1}
          onClick={() => setActiveTab(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`px-4 py-2 rounded ${
            activeTab === index
              ? "bg-white text-black font-bold"
              : "text-white opacity-70"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AccessibleTabs;
