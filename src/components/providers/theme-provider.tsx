"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: any) {
  return (
    // src/components/providers/theme-provider.tsx
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      // JANGAN ADA disableTransitionOnChange di sini
      {...props}>
      {children}
    </NextThemesProvider>
  );
}
