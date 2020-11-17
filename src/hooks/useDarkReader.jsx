import { useEffect } from "react";
import { useToggle } from "react-use";
import * as DarkReader from "darkreader";

export default function useDarkReader(initial = true) {
  const [isDarkModeEnabled, toggleDarkMode] = useToggle(initial);
  useEffect(() => {
    try {
      if (isDarkModeEnabled) {
        DarkReader.enable(
          {},
          {
            css: `
            .monaco-editor .view-overlays .current-line {
              border-color: #424242;
            }
            .ui.accordion {
              box-shadow: 0 1px 2px 0 rgba(212, 212, 213, 0.15),0 0 0 1px rgba(212, 212, 213, 0.15) !important;
            }
            `
          }
        );
      } else {
        DarkReader.disable();
      }
    } catch {}
  }, [isDarkModeEnabled]);
  return [isDarkModeEnabled, toggleDarkMode];
}
