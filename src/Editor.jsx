import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useKey, useToggle } from "react-use";
import { Button, Container, Icon, Menu, Modal } from "semantic-ui-react";
import { saveAs } from "file-saver";

const isMac = navigator.appVersion.indexOf("Mac") !== -1;

function saveToFile(data, fileName) {
  if (!saveAs) {
    return false;
  }
  var blob = new Blob([data], { type: "application/javascript;charset=utf-8" });
  saveAs(blob, fileName);
  return true;
}

export default ({ initialCode, keyPrefix, valueGetter }) => {
  const key = `${keyPrefix}-save-data`;
  const code = localStorage.getItem(key) || initialCode;
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [text, setText] = useState(code);
  const [isDirty, setIsDirty] = useState(false);
  const editorRef = useRef();
  const [isWarningModalOpen, toggleIsWarningModalOpen] = useToggle(false);

  useKey(
    (event) => event.key === "s" && (isMac ? event.metaKey : event.ctrlKey),
    (event) => {
      event.preventDefault();
      setText(editorRef.current.getValue());
    }
  );

  useEffect(() => {
    localStorage.setItem(key, text);
    setIsDirty(false);
  }, [key, text]);

  function handleEditorDidMount(_valueGetter, editor) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setIsDirty(text !== _valueGetter());
    });
  }

  return (
    <>
      <Modal
        open={isWarningModalOpen}
        onClose={() => toggleIsWarningModalOpen(false)}
        size="small"
      >
        <Modal.Content>
          You can't save files from here. Please open in a new browser tab.
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => toggleIsWarningModalOpen(false)}>
            <Icon name="remove" />
            Close
          </Button>
        </Modal.Actions>
      </Modal>
      <Menu attached>
        <Menu.Item>
          {isDirty ? (
            <Button onClick={() => setText(editorRef.current.getValue())}>
              <Icon name="save" />
              Save ({isMac ? "Cmd" : "Ctrl"} + S)
            </Button>
          ) : (
            <>
              <Icon color={"green"} name={"check circle"} />
              Saved!
            </>
          )}
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button
              onClick={() => {
                if (!saveToFile(text, `${key}.js`)) {
                  toggleIsWarningModalOpen();
                }
              }}
            >
              Export to File
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              negative
              onClick={() => {
                setText(initialCode);
                localStorage.setItem(key, initialCode);
                editorRef.current.setValue(initialCode);
              }}
            >
              Reset to Default
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Container attached>
        <Editor
          wrapperClassName="editor"
          height="50vh"
          language="javascript"
          value={code}
          theme="dark"
          editorDidMount={handleEditorDidMount}
        />
      </Container>
    </>
  );
};
