"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

const Provider = ({ children }, props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider defaultTheme="light" enableSystem={true} attribute="class">
      {children}
    </ThemeProvider>
  );
};

export default Provider;
