import React from "react";
import { useToggle } from "react-use";
import { Accordion, Icon, Segment } from "semantic-ui-react";
import MD from "./MD";

export default function Details({
  summary,
  children,
  icon = "dropdown",
  ...props
}) {
  const [isShown, toggleShown] = useToggle(false);

  return (
    <Accordion fluid styled onClick={toggleShown} {...props}>
      <Accordion.Title active={isShown}>
        <Icon name={icon} />
        {summary}
      </Accordion.Title>
      <Accordion.Content active={isShown}>
        <MD allowDangerousHtml>{children}</MD>
      </Accordion.Content>
    </Accordion>
  );
}
