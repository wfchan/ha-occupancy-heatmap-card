import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import esbuild from "rollup-plugin-esbuild";

export default {
  input: "src/ha-occupancy-heatmap-card.ts",
  output: {
    file: "dist/ha-occupancy-heatmap-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    esbuild({ target: "es2022" }),
    terser({ format: { comments: false } }),
  ],
};
