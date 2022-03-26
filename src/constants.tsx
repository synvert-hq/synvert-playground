import dedent from 'ts-dedent';

interface Example {
  sourceCode: string
  snippet: string
}

export const GENERATE_AST_URL = process.env.REACT_APP_API_BASE_URL + "/generate-ast";
export const PARSE_SYNVERT_SNIPPET_URL = process.env.REACT_APP_API_BASE_URL + "/parse-synvert-snippet";
export const EXAMPLES: { [key: string]: Example } = {
  'jquery-deprecate-event-shorthand': {
    sourceCode: dedent`
      $('#test').click(function(e) {
        foo();
      });

      $this.keyup(() => {
        bar();
      });

      $form.submit();
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-event-shorthand", () => {
        const eventShorthandNames = [
          "click",
          "blur",
          "focus",
          "focusin",
          "focusout",
          "resize",
          "scroll",
          "dblclick",
          "mousedown",
          "mouseup",
          "mousemove",
          "mouseover",
          "mouseout",
          "mouseenter",
          "mouseleave",
          "change",
          "select",
          "submit",
          "keydown",
          "keypress",
          "keyup",
          "contextmenu",
        ];

        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\$/, /^jQuery/] }, property: { in: eventShorthandNames } },
              arguments: { length: 1, first: { type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } } },
            },
            () => {
              replace("callee.property", { with: "on" });
              insert("'{{callee.property}}', ", { to: "arguments.0", at: "beginning" });
            }
          );

          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\$/, /^jQuery/] }, property: { in: eventShorthandNames } },
              arguments: { length: 0 },
            },
            () => {
              replace(["callee.property", "arguments"], { with: "trigger('{{callee.property}}')" });
            }
          );
        });
      });
    `
  },
  'jquery-deprecate-ready-event': {
    sourceCode: dedent`
      $(document).on("ready", fn)
      $(document).ready(fn)
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-ready-event", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          // $(document).on("ready", fn)
          // =>
          // $(fn)
          withNode(
            {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "CallExpression",
                  callee: { in: ["$", "jQuery"] },
                  arguments: { length: 1, first: { type: "Identifier", name: "document" } },
                },
                property: "on",
              },
              arguments: { length: 2, first: { type: "Literal", value: "ready" } },
            },
            () => {
              deleteNode(["callee.object.arguments", "callee.property"]);
              deleteNode("arguments.0");
            }
          );

          // $(document).ready(fn)
          // =>
          // $(fn)
          withNode(
            {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "CallExpression",
                  callee: { in: ["$", "jQuery"] },
                  arguments: { length: 1, first: { type: "Identifier", name: "document" } },
                },
                property: "ready",
              },
              arguments: { length: 1 },
            },
            () => {
              deleteNode(["callee.object.arguments", "callee.property"]);
            }
          );
        });
      });
    `
  }
}