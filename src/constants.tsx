import dedent from 'ts-dedent';

interface Example {
  sourceCode: string
  snippet: string
}

export const GENERATE_AST_URL = process.env.REACT_APP_API_BASE_URL + "/generate-ast";
export const PARSE_SYNVERT_SNIPPET_URL = process.env.REACT_APP_API_BASE_URL + "/parse-synvert-snippet";
export const EXAMPLES: { [key: string]: Example } = {
  'jquery/deprecate-andself': {
    sourceCode: dedent`
      $(e.target).parents("#userMenu").andSelf()
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-andself", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "andSelf" },
              arguments: { length: 0 },
            },
            () => {
              replace("callee.property", { with: "addBack" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-bind-and-delegate': {
    sourceCode: dedent`
      $(this).bind("click", function () { console.log('bind') });
      $(this).unbind("click");

      $(this).delegate(selector, event, handler);
      $(this).undelegate(selector, event, handler);
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-bind-and-delegate", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          // $(this).bind("click", function () { console.log('bind') });
          // =>
          // $(this).on("click", function () { console.log('bind') });
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "bind" },
              arguments: { length: { gte: 2 } },
            },
            () => {
              replace("callee.property", { with: "on" });
            }
          );

          // $(this).unbind("click");
          // =>
          // $(this).off("click");
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "unbind" },
              arguments: { length: { gte: 1 } },
            },
            () => {
              replace("callee.property", { with: "off" });
            }
          );

          // $(this).delegate(selector, event, handler);
          // =>
          // $(this).on(event, selector, handler);
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "delegate" },
              arguments: { length: { gte: 3 } },
            },
            () => {
              replace("callee.property", { with: "on" });
              replace("arguments.0", { with: "{{arguments.1}}" });
              replace("arguments.1", { with: "{{arguments.0}}" });
            }
          );

          // $(this).undelegate();
          // =>
          // $(this).off();
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "undelegate" },
              arguments: { length: { lt: 2 } },
            },
            () => {
              replace("callee.property", { with: "off" });
            }
          );

          // $(this).undelegate(selector, event, handler);
          // =>
          // $(this).off(event, selector, handler);
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "undelegate" },
              arguments: { length: { gte: 2 } },
            },
            () => {
              replace("callee.property", { with: "off" });
              replace("arguments.0", { with: "{{arguments.1}}" });
              replace("arguments.1", { with: "{{arguments.0}}" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-error': {
    sourceCode: dedent`
      $(this).error(function () { console.log('error') });
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-error", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "error" },
              arguments: { length: 1, first: { type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } } },
            },
            () => {
              replace("callee.property", { with: "on" });
              insert("'{{callee.property}}', ", { to: "arguments.0", at: "beginning" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-event-shorthand': {
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
          // $('#test').click(function(e) { });
          // =>
          // $('#test').on('click', function(e) { });
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: { in: eventShorthandNames } },
              arguments: { length: 1, first: { type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } } },
            },
            () => {
              replace("callee.property", { with: "on" });
              insert("'{{callee.property}}', ", { to: "arguments.0", at: "beginning" });
            }
          );

          // $form.submit();
          // =>
          // $form.trigger('submit');
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: { in: eventShorthandNames } },
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
  'jquery/deprecate-hover': {
    sourceCode: dedent`
      $this.hover(fn1, fn2)
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-hover", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "hover" },
              arguments: { length: 2 },
            },
            () => {
              replaceWith(\`{{callee.object}}.on("mouseenter", {{arguments.0}}).on("mouseover", {{arguments.1}})\`);
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-isarray': {
    sourceCode: dedent`
      $.isArray(arr)
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-isarray", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "isArray" },
            },
            () => {
              replace("callee.object", { with: "Array" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-jqxhr-success-error-and-complete': {
    sourceCode: dedent`
      $.ajax({
        url: 'URL',
        type: 'POST',
        data: yourData,
        datatype: 'json',
      })
      .success(function (data) {
        successFunction(data);
      })
      .error(function (jqXHR, textStatus, errorThrown) { errorFunction(); });
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-jqxhr-success-error-and-complete", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          const functionMap = { success: "done", error: "fail", complete: "always" };
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", property: { in: Object.keys(functionMap) } },
              arguments: { length: 1 },
            },
            function () {
              ifExistNode(
                { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "ajax" },
                { in: "callee" },
                () => {
                  replace("callee.property", { with: functionMap[this.currentNode.callee.property.name] });
                }
              );
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-load-unload': {
    sourceCode: dedent`
      $(this).load(function () { console.log('load') });
      $(this).unload(function () { console.log('unload') });
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-load-unload", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: { in: ["load", "unload"] } },
              arguments: { length: 1, first: { type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } } },
            },
            () => {
              replace("callee.property", { with: "on" });
              insert("'{{callee.property}}', ", { to: "arguments.0", at: "beginning" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-parsejson': {
    sourceCode: dedent`
      $.parseJSON(str)
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-parsejson", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "parseJSON" },
            },
            () => {
              replace("callee.object", { with: "JSON" });
              replace("callee.property", { with: "parse" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-ready-event': {
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
  },
  'jquery/deprecate-removeattr-boolean-properties': {
    sourceCode: dedent`
      $this.removeAttr('checked');
      $this.removeAttr('disabled');
      $this.removeAttr('readonly');
      $this.removeAttr('selected');
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-removeattr-boolean-properties", () => {
        const booleanProperties = ["checked", "disabled", "readonly", "selected"];

        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "removeAttr" },
              arguments: { length: 1, first: { value: { in: booleanProperties } } },
            },
            () => {
              replace("callee.property", { with: "prop" });
              insert(", false", { to: "arguments.0", at: "end" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-size': {
    sourceCode: dedent`
      $('.active').size()
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-size", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "size" },
              arguments: { length: 0 },
            },
            () => {
              replace(["callee.property", "arguments"], { with: "length" });
            }
          );
        });
      });
    `
  },
  'jquery/deprecate-unique': {
    sourceCode: dedent`
      $.unique(array)
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "deprecate-unique", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "unique" },
              arguments: { length: 1 },
            },
            () => {
              replace("callee.property", { with: "uniqueSort" });
            }
          );
        });
      });
    `
  },
  'jquery/use-camelcased-data-name': {
    sourceCode: dedent`
      $this.data('my-data');
      $this.data('my-data', 'value');
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "use-camelcased-data-name", () => {
        const camelize = (str) => {
          return str
            .replace(/(?:^\\w|[A-Z]|\\b\\w)/g, function (word, index) {
              return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/-/g, "");
        };

        withinFiles(Synvert.ALL_FILES, function () {
          withNode(
            {
              type: "CallExpression",
              callee: { type: "MemberExpression", object: { in: [/^\\$/, /^jQuery/] }, property: "data" },
              arguments: { length: { in: [1, 2] }, first: { type: "Literal" } },
            },
            () => {
              const dataKey = this.currentNode.arguments[0].value;
              const quote = this.currentNode.arguments[0].raw[0];
              if (dataKey.includes("-")) {
                replace("arguments.0", { with: quote + camelize(dataKey) + quote });
              }
            }
          );
        });
      });
    `
  },
  'jquery/use-expr-pseudos': {
    sourceCode: dedent`
      $.expr[':']
      $.expr.filters
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("jquery", "use-expr-pseudos", () => {
        withinFiles(Synvert.ALL_FILES, function () {
          // $.expr[':']
          // =>
          // $.expr.pseudos
          withNode(
            {
              type: "MemberExpression",
              object: { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "expr" },
              property: { value: ":" },
            },
            () => {
              replaceWith("{{object}}.pseudos");
            }
          );

          // $.expr.filters
          // =>
          // $.expr.pseudos
          withNode(
            {
              type: "MemberExpression",
              object: { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "expr" },
              property: "filters",
            },
            () => {
              replace("property", { with: "pseudos" });
            }
          );
        });
      });
    `
  }
}