import React, { useState, useRef } from "react";
import Test from "./Test";
import "./styles.css";
import {
  Container,
  Card,
  Button,
  Header,
  Divider,
  Segment
} from "semantic-ui-react";
import Editor from "./Editor";
import { compileCode } from "./sandbox";
import ReactMarkdown from "react-markdown";
import DarkModeToggle from "./components/DarkModeToggle";
import Details from "./components/Details";

// NOTE: must be a require
const problemPath = "./data/sorting/";
const sortingProblem = require(`${problemPath}/tests.json`);
const description = require(`${problemPath}/problem.md`);
const howToUseText = require("./data/howToUse.md");

const compileEnteredCode = (fnName, code) => {
  const codeWithInjections = `${code}\n\nreturn ${fnName}(arg)`;
  return (array) =>
    new Promise((resolve, reject) => {
      try {
        const compiled = compileCode(codeWithInjections);
        resolve(compiled.apply(undefined, [{ arg: array, console }]));
      } catch (err) {
        reject(err);
      }
    });
};

const defaultCode = `
/** @param {Array<number>} array */
function sort(array) {
  // your code here
}
`.trim();

export default function App() {
  const { title, tests, key, hints } = sortingProblem;
  const [autoRun, setAutoRun] = useState(undefined);
  const [allCollapsed, setAllCollapsed] = useState(true);
  // const [didPass, setDidPass] = useState(false);
  const codeRef = useRef();

  return (
    <Container style={{ paddingTop: "10px" }}>
      <DarkModeToggle floated="right" />
      <Header dividing>{title}</Header>
      {/* <Message positive hidden={!didPass}>
        You did it, nice job!
      </Message> */}
      <Details summary="How To Use">{howToUseText}</Details>
      <Divider />
      <Segment attached>
        <ReactMarkdown hidden={description === undefined}>
          {description}
        </ReactMarkdown>
        <div hidden={description !== undefined}>No description.</div>
        {hints?.map((hint, i) => (
          <Details
            key={hint.name}
            summary={`Hint #${i + 1}: ${hint.name}`}
            hidden={!hint}
          >
            {require(`${problemPath}${hint.path}`)}
          </Details>
        ))}
      </Segment>
      <Button.Group attached="bottom">
        <Button color="blue" onClick={() => setAutoRun((autoRun || 0) + 1)}>
          Run All
        </Button>
        <Button
          basic
          color="blue"
          onClick={() => setAllCollapsed(!allCollapsed)}
        >
          {allCollapsed ? "[+] Expand All" : "[-] Collapse All"}
        </Button>
      </Button.Group>
      <Divider />
      <Editor keyPrefix={key} initialCode={defaultCode} valueGetter={codeRef} />
      <Divider />
      <Card.Group stackable doubling itemsPerRow={2}>
        {tests.map((test, i) => (
          <Test
            key={JSON.stringify(test)}
            test={test}
            fn={(arg) => compileEnteredCode("sort", codeRef.current())(arg)}
            index={i}
            autoRun={autoRun}
            allCollapsed={allCollapsed}
            onTestStateChange={(state) => {
              // let oldState = test.state;
              // test.state = state;
              // if (
              //   oldState === test.state ||
              //   !(
              //     oldState === TestState.SUCCESS ||
              //     test.state === TestState.SUCCESS
              //   )
              // ) {
              //   return;
              // }
              // setDidPass(
              //   tests.every((test) => test.state === TestState.SUCCESS)
              // );
            }}
          />
        ))}
      </Card.Group>
    </Container>
  );
}
