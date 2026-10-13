import { useCallback, useEffect, useState } from "react";

export type OmTheme = "light" | "dark";
const KEY = "om-theme";

function readTheme(): OmTheme {
     try {
          const saved = localStorage.getItem(KEY);
          if (saved === "light" || saved === "dark") return saved;
     } catch {
          /* storage blocked — fall through to system preference */
     }
     return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Dashboard theme, applied on <html> so portaled dialogs/selects inherit the tokens. */
export function useOmTheme() {
     const [theme, setTheme] = useState<OmTheme>(readTheme);

     useEffect(() => {
          document.documentElement.setAttribute("data-om-theme", theme);
          try {
               localStorage.setItem(KEY, theme);
          } catch {
               /* ignore */
          }
     }, [theme]);

     const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
     return { theme, setTheme, toggle };
}
