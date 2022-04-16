const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = function override(config, environment) {
  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ["javascript", "ruby"],
    })
  );
  return config;
};
