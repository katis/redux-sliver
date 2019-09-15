const typescript = require("rollup-plugin-typescript2");

const isCommonJs = process.env.MODULE === "commonjs";

const format = isCommonJs ? "commonjs" : "esm";

module.exports = {
  input: "src/index.ts",
  output: {
    file: `dist/redux-sliver.${format}.js`,
    format
  },
  plugins: [typescript()]
};
