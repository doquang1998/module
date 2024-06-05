import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
      },
      {
        file: packageJson.module,
        format: "esm",
      },
    ],
    plugins: [
      peerDepsExternal({ includeDependencies: true }),
      nodeResolve({
        preferBuiltins: true,
        browser: true,
        extensions: [".ts", ".tsx"],
      }),
      resolve(),
      json(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      image(),
      terser(),
      postcss({
        plugins: [],
      }),
    ],
    external: [
      "react",
      "react-dom",
      "styled-components",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/styled-engine-sc",
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
