import React from "react";
import ReactMarkdown from "react-markdown";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark as theme } from "react-syntax-highlighter/dist/esm/styles/hljs";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

SyntaxHighlighter.registerLanguage("javascript", js);

const renderers = {
  code: ({ language, value }) => {
    return (
      <SyntaxHighlighter
        showLineNumbers
        style={theme}
        language={language}
        children={value}
      />
    );
  }
};

export default function MD(props) {
  return <ReactMarkdown renderers={renderers} {...props} />;
}
