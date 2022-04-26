import dedent from "ts-dedent";

interface Examples {
  [language: string]: {
    [name: string]: {
      sourceCode: string;
      filePath?: string;
      snippet: string;
    };
  };
}

export const LANGUAGES = ["javascript", "ruby"];
export const REQUEST_BASE_URL: { [language: string]: string } = {
  javascript:
    process.env.REACT_APP_JAVASCRIPT_BASE_URL || "http://localhost:3000",
  ruby: process.env.REACT_APP_RUBY_BASE_URL || "http://localhost:9292",
};
export const DEFAULT_EXAMPLE: { [language: string]: string } = {
  javascript: "jquery/deprecate-event-shorthand",
  ruby: "rspec/be_close_to_be_within",
};
export const EXAMPLES: Examples = {
  javascript: {
    "jquery/deprecate-andself": {
      sourceCode: dedent`
        $(e.target).parents("#userMenu").andSelf()
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-bind-and-delegate": {
      sourceCode: dedent`
        $(this).bind("click", function () { console.log('bind') });
        $(this).unbind("click");

        $(this).delegate(selector, event, handler);
        $(this).undelegate(selector, event, handler);
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-error": {
      sourceCode: dedent`
        $(this).error(function () { console.log('error') });
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-event-shorthand": {
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
      `,
    },
    "jquery/deprecate-hover": {
      sourceCode: dedent`
        $this.hover(fn1, fn2)
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-isarray": {
      sourceCode: dedent`
        $.isArray(arr)
      `,
      snippet: dedent`
        withNode(
          {
            type: "CallExpression",
            callee: { type: "MemberExpression", object: { in: ["$", "jQuery"] }, property: "isArray" },
          },
          () => {
            replace("callee.object", { with: "Array" });
          }
        );
      `,
    },
    "jquery/deprecate-jqxhr-success-error-and-complete": {
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
      `,
    },
    "jquery/deprecate-load-unload": {
      sourceCode: dedent`
        $(this).load(function () { console.log('load') });
        $(this).unload(function () { console.log('unload') });
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-parsejson": {
      sourceCode: dedent`
        $.parseJSON(str)
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-ready-event": {
      sourceCode: dedent`
        $(document).on("ready", fn)
        $(document).ready(fn)
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-removeattr-boolean-properties": {
      sourceCode: dedent`
        $this.removeAttr('checked');
        $this.removeAttr('disabled');
        $this.removeAttr('readonly');
        $this.removeAttr('selected');
      `,
      snippet: dedent`
        const booleanProperties = ["checked", "disabled", "readonly", "selected"];

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
      `,
    },
    "jquery/deprecate-size": {
      sourceCode: dedent`
        $('.active').size()
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/deprecate-unique": {
      sourceCode: dedent`
        $.unique(array)
      `,
      snippet: dedent`
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
      `,
    },
    "jquery/use-camelcased-data-name": {
      sourceCode: dedent`
        $this.data('my-data');
        $this.data('my-data', 'value');
      `,
      snippet: dedent`
        const camelize = (str) => {
          return str
            .replace(/(?:^\\w|[A-Z]|\\b\\w)/g, function (word, index) {
              return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/-/g, "");
        };

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
      `,
    },
    "jquery/use-expr-pseudos": {
      sourceCode: dedent`
        $.expr[':']
        $.expr.filters
      `,
      snippet: dedent`
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
      `,
    },
  },
  ruby: {
    "rspec/be_close_to_be_within": {
      sourceCode: dedent`
        describe Post do
          it 'test' do
            expect(1.0 / 3.0).to be_close(0.333, 0.001)
          end
        end
      `,
      snippet: dedent`
        with_node type: 'send', message: 'to', arguments: { first: { type: 'send', message: 'be_close' } } do
          replace :arguments, with: "be_within({{arguments.first.arguments.last}}).of({{arguments.first.arguments.first}})"
        end
      `,
    },
    "rspec/block_to_expect": {
      sourceCode: dedent`
        describe Post do
          it 'test' do
            lambda { do_something }.should raise_error
            proc { do_something }.should raise_error
            -> { do_something }.should raise_error
          end
        end
      `,
      snippet: dedent`
        { should: 'to', should_not: 'not_to' }.each do |old_message, new_message|
          with_node type: 'send', receiver: { type: 'block' }, message: old_message do
            replace_with "expect { {{receiver.body}} }.#{new_message} {{arguments}}"
          end
        end
      `,
    },
    "rspec/boolean_matcher": {
      sourceCode: dedent`
        describe Post do
          it 'case' do
            expect(obj).to be_true
            expect(obj).to be_false
          end
        end
      `,
      snippet: dedent`
        { be_true: 'be_truthy', be_false: 'be_falsey' }.each do |old_matcher, new_matcher|
          with_node type: 'send', receiver: nil, message: old_matcher do
            replace_with new_matcher
          end
        end
      `,
    },
    "rspec/collection_matcher": {
      sourceCode: dedent`
        describe Post do
          it 'test' do
            expect(collection).to have(3).items
            expect(collection).to have_exactly(3).items
            expect(collection).to have_at_least(3).items
            expect(collection).to have_at_most(3).items

            expect(team).to have(3).players
          end
        end
      `,
      snippet: dedent`
        {
          have: 'eq',
          have_exactly: 'eq',
          have_at_least: 'be >=',
          have_at_most: 'be <='
        }.each do |old_matcher, new_matcher|
          with_node type: 'send',
                    message: 'to',
                    arguments: {
                      first: {
                        type: 'send',
                        receiver: {
                          type: 'send',
                          message: old_matcher
                        }
                      }
                    } do
            times = node.arguments.first.receiver.arguments.first.to_source
            items_name = node.arguments.first.message
            if :items == items_name
              replace_with "expect({{receiver.arguments}}.size).to #{new_matcher} #{times}"
            else
              replace_with "expect({{receiver.arguments}}.#{items_name}.size).to #{new_matcher} #{times}"
            end
          end
        end
      `,
    },
    "rspec/custom_matcher_new_syntax": {
      sourceCode: dedent`
        RSpec::Matchers.define :be_awesome do
          match_for_should { }
          match_for_should_not { }
          failure_message_for_should { }
          failure_message_for_should_not { }
        end
      `,
      snippet: dedent`
        {
          match_for_should: 'match',
          match_for_should_not: 'match_when_negated',
          failure_message_for_should: 'failure_message',
          failure_message_for_should_not: 'failure_message_when_negated'
        }.each do |old_message, new_message|
          with_node type: 'block', caller: { receiver: nil, message: old_message } do
            replace :caller, with: new_message
          end
        end
      `,
    },
    "rspec/explicit_spec_type": {
      sourceCode: dedent`
        describe Post do
          describe '#save' do
          end
        end
      `,
      filePath: "spec/models/post_spec.rb",
      snippet: dedent`
        Synvert::Rewriter.new('rspec', 'explicit_spec_type') do
          {
            models: 'model',
            controllers: 'controller',
            helpers: 'helper',
            mailers: 'mailer',
            requests: 'request',
            integration: 'request',
            api: 'request',
            routing: 'routing',
            views: 'view',
            features: 'feature'
          }.each do |directory, type|
            within_files ["spec/#{directory}/**/*_spec.rb", "engines/*/spec/#{directory}/**/*_spec.rb"] do
              with_node({ type: 'block', caller: { type: 'send', message: 'describe' } }, { stop_when_match: true }) do
                goto_node :caller do
                  unless_exist_node type: 'pair', key: :type do
                    insert ", type: :#{type}"
                  end
                end
              end
            end
          end
        end
      `,
    },
    "rspec/its_to_it": {
      sourceCode: dedent`
        describe Post do
          describe 'example' do
            subject { { foo: 1, bar: 2 } }
            its(:size) { should == 2 }
            its([:foo]) { should == 1 }
            its('keys.first') { should == :foo }
          end
        end
      `,
      snippet: dedent`
        with_node type: 'block', caller: { message: 'its' } do
          if node.body.length == 1
            its_arg = node.caller.arguments.first.to_source
            its_arg = its_arg[1...-1] if /^['"].*['"]$/.match?(its_arg)
            its_arg = its_arg[1..-1] if its_arg[0] == ':'
            rewritten_code = []
            args = its_arg.split('.')
            args.each_with_index do |arg, index|
              describe_name = /^[a-z]/.match?(arg[0]) ? '#' + arg : arg
              message_name = /^[a-z]/.match?(arg[0]) ? '.' + arg : arg
              rewritten_code << "#{'  ' * index}describe '#{describe_name}' do"
              rewritten_code << "#{'  ' * (index + 1)}subject { super()#{message_name} }"
              rewritten_code << "#{'  ' * (index + 1)}it { {{body}} }" if index + 1 == args.length
            end
            args.length.times do |i|
              rewritten_code << "#{'  ' * (args.length - 1 - i)}end"
            end
            replace_with rewritten_code.join("\\n")
          end
        end
      `,
    },
    "rspec/message_expectation": {
      sourceCode: dedent`
        describe Post do
          it 'test' do
            obj.should_receive(:message)
            Klass.any_instance.should_receive(:message)
            obj.should_not_receive(:message)
            Klass.any_instance.should_not_receive(:message)

            expect(obj).to receive(:message).and_return { 1 }

            expect(obj).to receive(:message).and_return
          end
        end
      `,
      snippet: dedent`
        # obj.should_receive(:message) => expect(obj).to receive(:message)
        # Klass.any_instance.should_receive(:message) => expect_any_instance_of(Klass).to receive(:message)
        with_node type: 'send', message: 'should_receive' do
          if_exist_node type: 'send', message: 'any_instance' do
            replace_with 'expect_any_instance_of({{receiver.receiver}}).to receive({{arguments}})'
          end
          unless_exist_node type: 'send', message: 'any_instance' do
            replace_with 'expect({{receiver}}).to receive({{arguments}})'
          end
        end

        # obj.should_not_receive(:message) => expect(obj).to receive(:message)
        # Klass.any_instance.should_not_receive(:message) => expect_any_instance_of(Klass).to receive(:message)
        with_node type: 'send', message: 'should_not_receive' do
          if_exist_node type: 'send', message: 'any_instance' do
            replace_with 'expect_any_instance_of({{receiver.receiver}}).not_to receive({{arguments}})'
          end
          unless_exist_node type: 'send', message: 'any_instance' do
            replace_with 'expect({{receiver}}).not_to receive({{arguments}})'
          end
        end

        # expect(obj).to receive(:message).and_return { 1 } => expect(obj).to receive(:message) { 1 }
        with_node type: 'send',
                  receiver: {
                    type: 'send',
                    message: 'expect'
                  },
                  arguments: {
                    first: {
                      type: 'block',
                      caller: {
                        type: 'send',
                        message: 'and_return',
                        arguments: []
                      }
                    }
                  } do
          replace_with '{{receiver}}.to {{arguments.first.caller.receiver}} { {{arguments.first.body}} }'
        end

        # expect(obj).to receive(:message).and_return => expect(obj).to receive(:message)
        with_node type: 'send',
                  receiver: {
                    type: 'send',
                    message: 'expect'
                  },
                  arguments: {
                    first: {
                      type: 'send',
                      message: 'and_return',
                      arguments: []
                    }
                  } do
          replace_with '{{receiver}}.to {{arguments.first.receiver}}'
        end
      `,
    },
    "rspec/method_stub": {
      sourceCode: dedent`
        describe Post do
          it 'case' do
            obj.stub(:message)
            obj.stub!(:message)
            obj.stub_chain(:foo, :bar, :baz)
            Klass.any_instance.stub(:message)

            obj.stub(:foo => 1, :bar => 2)

            obj.unstub!(:message)

            obj.stub(:message).any_number_of_times
            obj.stub(:message).at_least(0)

            allow(obj).to receive(:message).and_return { 1 }

            allow(obj).to receive(:message).and_return
          end
        end
      `,
      snippet: dedent`
        # obj.stub!(:message) => obj.stub(:message)
        # obj.unstub!(:message) => obj.unstub(:message)
        { stub!: 'stub', unstub!: 'unstub' }.each do |old_message, new_message|
          with_node type: 'send', message: old_message do
            replace :message, with: new_message
          end
        end

        # obj.stub(:message).any_number_of_times => allow(obj).to receive(:message)
        # obj.stub(:message).at_least(0) => allow(obj).to receive(:message)
        with_node type: 'send', message: 'any_number_of_times' do
          replace_with '{{receiver}}'
        end

        with_node type: 'send', message: 'at_least', arguments: [0] do
          replace_with '{{receiver}}'
        end

        # obj.stub(:message) => allow(obj).to receive(:message)
        # Klass.any_instance.stub(:message) => allow_any_instance_of(Klass).to receive(:message)
        with_node type: 'send', message: 'stub', arguments: { first: { type: { not: 'hash' } } } do
          if_exist_node type: 'send', message: 'any_instance' do
            replace_with 'allow_any_instance_of({{receiver.receiver}}).to receive({{arguments}})'
          end
          unless_exist_node type: 'send', message: 'any_instance' do
            replace_with 'allow({{receiver}}).to receive({{arguments}})'
          end
        end

        with_node type: 'send', message: 'stub_chain' do
          if_exist_node type: 'send', message: 'any_instance' do
            replace_with 'allow_any_instance_of({{receiver.receiver}}).to receive_message_chain({{arguments}})'
          end
          unless_exist_node type: 'send', message: 'any_instance' do
            replace_with 'allow({{receiver}}).to receive_message_chain({{arguments}})'
          end
        end

        # obj.stub(:foo => 1, :bar => 2) => allow(obj).to receive_messages(:foo => 1, :bar => 2)
        with_node type: 'send', message: 'stub', arguments: { first: { type: 'hash' } } do
          replace_with 'allow({{receiver}}).to receive_messages({{arguments}})'
        end

        # allow(obj).to receive(:message).and_return { 1 } => allow(obj).to receive(:message) { 1 }
        with_node type: 'send',
                  receiver: {
                    type: 'send',
                    message: 'allow'
                  },
                  arguments: {
                    first: {
                      type: 'block',
                      caller: {
                        type: 'send',
                        message: 'and_return',
                        arguments: []
                      }
                    }
                  } do
          replace_with '{{receiver}}.to {{arguments.first.caller.receiver}} { {{arguments.first.body}} }'
        end

        # allow(obj).to receive(:message).and_return => allow(obj).to receive(:message)
        with_node type: 'send',
                  receiver: {
                    type: 'send',
                    message: 'allow'
                  },
                  arguments: {
                    first: {
                      type: 'send',
                      message: 'and_return',
                      arguments: []
                    }
                  } do
          replace_with '{{receiver}}.to {{arguments.first.receiver}}'
        end
      `,
    },
    "rspec/negative_error_expectation": {
      sourceCode: dedent`
        describe Post do
          it 'test' do
            expect { do_something }.not_to raise_error(SomeErrorClass)
            expect { do_something }.not_to raise_error('message')
            expect { do_something }.not_to raise_error(SomeErrorClass, 'message')
          end
        end
      `,
      snippet: dedent`
        within_node type: 'send', receiver: { type: 'block' }, message: 'not_to' do
          with_node type: 'send', message: 'raise_error' do
            replace_with 'raise_error'
          end
        end
      `,
    },
    "rspec/new_hook_scope": {
      sourceCode: dedent`
        describe 'example' do
          before { do_something }
          before(:each) { do_something }
          before(:all) { do_something }
        end
      `,
      snippet: dedent`
        %w[before after around].each do |scope|
          with_node type: 'send', message: scope, arguments: [:all] do
            replace :arguments, with: ':context'
          end

          with_node type: 'send', message: scope, arguments: [:each] do
            replace :arguments, with: ':example'
          end
        end
      `,
    },
    "rspec/one_liner_expectation": {
      sourceCode: dedent`
        describe Post do
          it { should matcher }
          it { should_not matcher }

          it { should have(3).items }
          it { should have_at_least(3).players }
        end
      `,
      snippet: dedent`
        matcher_converters = { have: 'eq', have_exactly: 'eq', have_at_least: 'be >=', have_at_most: 'be <=' }
        { should: 'to', should_not: 'not_to' }.each do |old_message, new_message|
          # it { should matcher } => it { is_expected.to matcher }
          # it { should_not matcher } => it { is_expected.not_to matcher }
          with_node type: 'block', caller: { message: 'it' } do
            if_only_exist_node type: 'send', receiver: nil, message: old_message do
              receiver = node.body.first.arguments.first.receiver
              unless receiver && matcher_converters.include?(receiver.message)
                matcher = node.body.first.arguments.first.to_source
                replace_with "it { is_expected.#{new_message} #{matcher} }"
              end
            end
          end

          # it { should have(3).items }
          # =>
          # it 'has 3 items' do
          #   expect(subject.size).to eq(3)
          # end
          #
          # it { should have_at_least(3).players }
          # =>
          # it 'has at least 3 players' do
          #   expect(subject.players.size).to be >= 3
          # end
          matcher_converters.each do |old_matcher, new_matcher|
            with_node type: 'block', caller: { message: 'it' } do
              if_only_exist_node type: 'send',
                                receiver: nil,
                                message: old_message,
                                arguments: {
                                  first: {
                                    type: 'send',
                                    receiver: {
                                      type: 'send',
                                      message: old_matcher
                                    }
                                  }
                                } do
                times = node.body.first.arguments.first.receiver.arguments.first.to_source
                items_name = node.body.first.arguments.first.message
                if :items == items_name
                  replace_with <<~EOS
                    it 'has #{times} items' do
                      expect(subject.size).#{new_message} #{new_matcher}(#{times})
                    end
                  EOS
                else
                  replace_with <<~EOS
                    it '#{old_matcher.to_s.sub('have', 'has').tr('_', ' ')} #{times} #{items_name}' do
                      expect(subject.#{items_name}.size).#{new_message} #{new_matcher} #{times}
                    end
                  EOS
                end
              end
            end
          end
        end
      `,
    },
    "rspec/pending_to_skip": {
      sourceCode: dedent`
        describe 'example' do
          it 'is skipped', :pending => true do
            do_something_possibly_fail
          end

          pending 'is skipped' do
            do_something_possibly_fail
          end

          it 'is skipped' do
            pending
            do_something_possibly_fail
          end

          it 'is run and expected to fail' do
            pending do
              do_something_surely_fail
            end
          end
        end
      `,
      snippet: dedent`
        # it 'is run and expected to fail' do
        #   pending do
        #     do_something_surely_fail
        #   end
        # end
        # =>
        # it 'is run and expected to fail' do
        #   skip
        #   do_something_surely_fail
        # end
        with_node type: 'block', caller: { type: 'send', receiver: nil, message: 'pending', arguments: { size: 0 } } do
          replace_with "skip\\n{{body}}"
        end

        # it 'is skipped' do
        #   pending
        #   do_something_possibly_fail
        # end
        # =>
        # it 'is skipped' do
        #   skip
        #   do_something_possibly_fail
        # end
        with_node type: 'send', receiver: nil, message: 'pending', arguments: { size: 0 } do
          replace_with 'skip'
        end

        # pending 'is skipped' do
        #   do_something_possibly_fail
        # end
        # =>
        # skip 'is skipped' do
        #   do_something_possibly_fail
        # end
        with_node type: 'send', receiver: nil, message: 'pending', arguments: { size: 1, first: { type: 'str' } } do
          replace :message, with: 'skip'
        end

        %w[it describe context].each do |message|
          # it 'is skipped', :pending => true do
          #   do_something_possibly_fail
          # end
          # =>
          # it 'is skipped', :skip => true do
          #   do_something_possibly_fail
          # end
          with_node type: 'send', message: message, arguments: { size: 2, last: { type: 'hash' } } do
            replace 'arguments.last', with: node.arguments.last.to_source.sub('pending', 'skip')
          end
        end
      `,
    },
    "rspec/remove_monkey_patches": {
      sourceCode: dedent`
        describe Post do
          describe '.active' do
          end
        end
      `,
      snippet: dedent`
        monkey_patches_methods = %w[describe shared_examples shared_examples_for shared_context]
        monkey_patches_methods.each do |message|
          with_direct_node type: 'block', caller: { type: 'send', receiver: nil, message: message } do
            insert 'RSpec.', at: 'beginning'
          end
        end
      `,
    },
    "rspec/should_to_expect": {
      sourceCode: dedent`
        describe Post do
          it 'test' do
            obj.should matcher
            obj.should_not matcher

            1.should == 1
            1.should < 2
            Integer.should === 1
            'string'.should =~ /^str/
            [1, 2, 3].should =~ [2, 1, 3]
          end
        end
      `,
      snippet: dedent`
        # obj.should matcher => expect(obj).to matcher
        # obj.should_not matcher => expect(obj).not_to matcher
        { should: 'to', should_not: 'not_to' }.each do |old_message, new_message|
          with_node type: 'send', receiver: { type: { not: 'block' } }, message: old_message do
            if node.receiver && node.arguments.size > 0
              replace_with "expect({{receiver}}).#{new_message} {{arguments}}"
            end
          end

          # 1.should == 1 => expect(1).to eq 1
          # 1.should < 1 => expect(1).to be < 2
          # Integer.should === 1 => expect(Integer).to be === 1
          {
            '==' => 'eq',
            '<' => 'be <',
            '>' => 'be >',
            '<=' => 'be <=',
            '>=' => 'be >=',
            '===' => 'be ==='
          }.each do |old_matcher, new_matcher|
            with_node type: 'send', receiver: { type: 'send', message: old_message }, message: old_matcher do
              if node.receiver.receiver
                replace_with "expect({{receiver.receiver}}).#{new_message} #{new_matcher} {{arguments}}"
              end
            end
          end

          # 'string'.should =~ /^str/ => expect('string').to match /^str/
          # [1, 2, 3].should =~ [2, 1, 3] => expect([1, 2, 3]).to match_array [2, 1, 3]
          with_node type: 'send', receiver: { type: 'send', message: old_message }, message: '=~' do
            if :regexp == node.arguments.first.type
              replace_with "expect({{receiver.receiver}}).#{new_message} match {{arguments}}"
            else
              replace_with "expect({{receiver.receiver}}).#{new_message} match_array {{arguments}}"
            end
          end
        end
      `,
    },
    "rspec/stub_and_mock_to_double": {
      sourceCode: dedent`
        describe Post do
          it 'test' do
            stub('something')
            mock('something')
          end
        end
      `,
      snippet: dedent`
        with_node type: 'send', receiver: nil, message: { in: ['stub', 'mock'] } do
          replace :message, with: 'double'
        end
      `,
    },
  },
};
