"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AccessibilityProvider } from "../contexts/AccessibilityContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
