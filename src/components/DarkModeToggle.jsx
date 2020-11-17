import React from "react";
import { Button, Icon } from "semantic-ui-react";
import useDarkReader from "../hooks/useDarkReader";

export default function DarkModeToggle(props) {
  const [isDarkModeEnabled, toggleDarkMode] = useDarkReader();
  return (
    <Button {...props} onClick={toggleDarkMode}>
      <Icon name={isDarkModeEnabled ? "sun" : "moon"} />
      {isDarkModeEnabled ? "Disable" : "Enable"} Dark Mode
    </Button>
  );
}
