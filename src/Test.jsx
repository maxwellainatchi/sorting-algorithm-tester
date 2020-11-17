import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Label, Message } from "semantic-ui-react";
import _ from "lodash";

export const TestState = {
  NOT_RUN: "not_run",
  RUNNING: "running",
  SUCCESS: "success",
  FAILURE: "failure",
  ERRORED: "errored"
};

const Code = ({ label, children }) => (
  <div>
    <label>{label}</label>
    <div style={{ display: "block", overflow: "auto" }}>
      <code>{children}</code>
    </div>
  </div>
);

export default function Test({
  test,
  fn,
  index,
  autoRun,
  allCollapsed,
  onTestStateChange
}) {
  let {
    hidden: initiallyHidden,
    input,
    output: expectedOutput,
    description
  } = test;
  let [output, setOutput] = useState(undefined);
  let [error, setError] = useState(undefined);
  let [hidden, setHidden] = useState(initiallyHidden);
  let [state, setState] = useState(TestState.NOT_RUN);
  let [collapsed, setCollapsed] = useState(allCollapsed);
  const runTest = useCallback(async () => {
    const set = (state) => {
      setState(state);
      onTestStateChange(state);
    };
    set(TestState.NOT_RUN);
    setError(undefined);
    setOutput(undefined);
    let inputCopy = _.cloneDeep(input);
    try {
      const tempOutput = await fn(inputCopy);
      setOutput(tempOutput);
      const isSuccess = _.isEqual(tempOutput, expectedOutput);
      set(isSuccess ? TestState.SUCCESS : TestState.FAILURE);
    } catch (err) {
      setError(err);
      set(TestState.ERRORED);
    }
  }, [input, fn, expectedOutput, onTestStateChange]);
  useEffect(() => {
    if (autoRun !== undefined) {
      runTest();
    }
  }, [autoRun, runTest]);
  useEffect(() => {
    if (allCollapsed) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [allCollapsed]);

  const color = (() => {
    switch (state) {
      case TestState.SUCCESS:
        return "green";
      case TestState.FAILURE:
        return "red";
      default:
        return;
    }
  })();
  const icon = (() => {
    switch (state) {
      case TestState.SUCCESS:
        return "check circle";
      case TestState.FAILURE:
        return "exclamation circle";
      default:
        return "question circle";
    }
  })();

  const hiddenText = <Label>[hidden]</Label>;

  return (
    <Card fluid color={color}>
      <Card.Content>
        <Card.Header onClick={() => setCollapsed(!collapsed)}>
          <Button>{collapsed ? "+" : "-"}</Button> Test #{index + 1}
          <Label corner="right" icon={icon} color={color} />
          {hidden ? hiddenText : `: ${description}`}
        </Card.Header>
        <Card.Meta hidden={hidden || collapsed}>
          <Code label="Input: ">{JSON.stringify(input)}</Code>
          <Code label="Expected output: ">
            {JSON.stringify(expectedOutput)}
          </Code>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra hidden={collapsed}>
        <Button color="blue" onClick={runTest}>
          Run
        </Button>
        <span hidden={!initiallyHidden}>
          <Button onClick={() => setHidden(!hidden)}>
            {hidden ? "Reveal" : "Hide"}
          </Button>
        </span>
        <Message negative hidden={state !== TestState.FAILURE}>
          <Message.Header>Failed!</Message.Header>
          <span hidden={hidden}>
            <Code label="Your output:">{JSON.stringify(output)}</Code>
          </span>
        </Message>
        <Message negative hidden={state !== TestState.ERRORED}>
          <Message.Header>Error!</Message.Header>
          Error Message: {error?.message}
        </Message>
        <Message positive hidden={state !== TestState.SUCCESS}>
          <Message.Header>Success!</Message.Header>
        </Message>
      </Card.Content>
    </Card>
  );
}
