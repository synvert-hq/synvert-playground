import dedent from "dedent";

interface Extensions {
  [language: string]: {
    [name: string]: string;
  };
}

interface ParseSnippets {
  [language: string]: {
    input: string;
    output: string;
    snippet: string;
  };
}

export const LANGUAGES = ["typescript", "javascript", "ruby"];

export const REQUEST_BASE_URL: { [language: string]: string } = {
  typescript:
    process.env.REACT_APP_JAVASCRIPT_BASE_URL || "http://localhost:4000",
  javascript:
    process.env.REACT_APP_JAVASCRIPT_BASE_URL || "http://localhost:4000",
  ruby: process.env.REACT_APP_RUBY_BASE_URL || "http://localhost:9292",
};

export const CODE_EXTENSIONS: Extensions = {
  typescript: {
    ts: "Typescript",
    tsx: "Typescript + JSX",
  },
  javascript: {
    js: "Javascript",
    jsx: "Javascript + JSX",
  },
  ruby: {
    rb: "Ruby",
    erb: "Ruby + ERB",
  },
};

export const DEFAULT_PARSE_SNIPPETS: ParseSnippets = {
  javascript: {
    input: dedent`
      foo.substr(start, length);
      foo.substring(indexStart, indexEnd);
    `,
    output: dedent`
      foo.slice(start, start + length);
      foo.slice(indexStart, indexEnd);
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("javascript", "prefer-string-slice", () => {
        description(\`
          foo.substr(start, length);
          foo.substring(indexStart, indexEnd);
          =>
          foo.slice(start, start + length);
          foo.slice(indexStart, indexEnd);
        \`);

        configure({ parser: "typescript" });
        withinFiles(Synvert.ALL_FILES, () => {
          findNode(\`.CallExpression[expression=.PropertyAccessExpression[name=substr]][arguments.length=2]\`, () => {
            replace("arguments.1", { with: "{{arguments.0}} + {{arguments.1}}" });
            replace("expression.name", { with: "slice" });
          });
          findNode(\`.CallExpression[expression=.PropertyAccessExpression[name=substring]][arguments.length=2]\`, () => {
            replace("expression.name", { with: "slice" });
          });
        });
      });
    `,
  },
  typescript: {
    input: dedent`
      const x: Array<string> = ['a', 'b'];
      const y: ReadonlyArray<string> = ['a', 'b'];
      const z: Array<string | number> = ['a', 'b'];
    `,
    output: dedent`
      const x: string[] = ['a', 'b'];
      const y: readonly string[] = ['a', 'b'];
      const z: (string | number)[] = ['a', 'b'];
    `,
    snippet: dedent`
      const Synvert = require("synvert-core");

      new Synvert.Rewriter("typescript", "array-type", () => {
        configure({ parser: "typescript" });

        description(\`
          Convert typescript array type from Array<string> to string[]

          const x: Array<string> = ['a', 'b'];
          const y: ReadonlyArray<string> = ['a', 'b'];
          const z: Array<string | number> = ['a', 'b'];
          =>
          const x: string[] = ['a', 'b'];
          const y: readonly string[] = ['a', 'b'];
          const z: (string | number)[] = ['a', 'b'];
        \`);

        withinFiles(Synvert.ALL_TS_FILES, function () {
          findNode(".TypeReference[typeName.escapedText=Array][typeArguments.0=.UnionType]", () => {
            replaceWith("({{typeArguments}})[]");
          });

          findNode(".TypeReference[typeName.escapedText=Array][typeArguments.0!=.UnionType]", () => {
            replaceWith("{{typeArguments}}[]");
          });

          findNode(".TypeReference[typeName.escapedText=ReadonlyArray][typeArguments.0=.UnionType]", () => {
            replaceWith("readonly ({{typeArguments}})[]");
          });

          findNode(".TypeReference[typeName.escapedText=ReadonlyArray][typeArguments.0!=.UnionType]", () => {
            replaceWith("readonly {{typeArguments}}[]");
          });
        });
      });
    `,
  },
  ruby: {
    input: "[1, 2, 3, 4].map { |e| [e, e] }.flatten",
    output: "[1, 2, 3, 4].flat_map { |e| [e, e] }",
    snippet: dedent`
      # frozen_string_literal: true

      Synvert::Rewriter.new 'ruby', 'map_and_flatten_to_flat_map' do
        description <<~EOS
          It converts \`map\` and \`flatten\` to \`flat_map\`

          \`\`\`ruby
          enum.map do
            # do something
          end.flatten
          \`\`\`

          =>

          \`\`\`ruby
          enum.flat_map do
            # do something
          end
          \`\`\`
        EOS

        within_files Synvert::ALL_RUBY_FILES do
          # enum.map do
          #   # do something
          # end.flatten
          # =>
          # enum.flat_map do
          #   # do something
          # end
          find_node '.send
                      [receiver=.block
                        [caller=.send[message=map]]]
                      [message=flatten]
                      [arguments.size=0]' do
            delete :message, :dot
            replace 'receiver.caller.message', with: 'flat_map'
          end
        end
      end
    `,
  },
};
