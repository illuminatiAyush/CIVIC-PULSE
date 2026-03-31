"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large" | "extra-large";

type AccessibilityContextType = {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [focusMode, setFocusModeState] = useState<boolean>(false);

  useEffect(() => {
    const savedSize = localStorage.getItem("civicpulse_fontsize") as FontSize;
    if (savedSize && ["normal", "large", "extra-large"].includes(savedSize)) {
      setFontSizeState(savedSize);
    }

    const savedContrast = localStorage.getItem("civicpulse_highcontrast");
    if (savedContrast === "true") {
      setHighContrastState(true);
    }
    
    const savedFocus = localStorage.getItem("civicpulse_focusmode");
    if (savedFocus === "true") {
      setFocusModeState(true);
    }
  }, []);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem("civicpulse_fontsize", size);
  };

  const setHighContrast = (contrast: boolean) => {
    setHighContrastState(contrast);
    localStorage.setItem("civicpulse_highcontrast", String(contrast));
  };

  const setFocusMode = (focus: boolean) => {
    setFocusModeState(focus);
    localStorage.setItem("civicpulse_focusmode", String(focus));
  };

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("text-normal", "text-large", "text-extra-large", "focus-mode");
    html.classList.add(`text-${fontSize}`);
    
    if (highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }

    if (focusMode) {
      html.classList.add("focus-mode");
    } else {
      html.classList.remove("focus-mode");
    }
  }, [fontSize, highContrast, focusMode]);

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, highContrast, setHighContrast, focusMode, setFocusMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
