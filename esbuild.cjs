const esbuild = require("esbuild");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * 🧩 Problem Matcher Plugin — keeps build feedback clean in terminal
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",
  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      if (result.errors.length > 0) {
        console.error(`✘ [ERROR] Found ${result.errors.length} build error(s):`);
        result.errors.forEach(({ text, location }) => {
          if (location) {
            console.error(`    ${location.file}:${location.line}:${location.column}: ${text}`);
          } else {
            console.error(`    ${text}`);
          }
        });
      } else {
        console.log("[watch] build finished ✅");
      }
    });
  },
};

/**
 * 🧠 Main build logic
 */
async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node18",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    outfile: "dist/extension.js",

    // 🧩 Fix: ensure esbuild doesn’t try to inline SDK or dotenv
    external: [
      "vscode",
      "dotenv",
      "@modelcontextprotocol/sdk",
      "@modelcontextprotocol/sdk/*",
      "@cfworker/json-schema"
    ],

    resolveExtensions: [".ts", ".js", ".json"],

    logLevel: "info",
    plugins: [esbuildProblemMatcherPlugin],
  });

  if (watch) {
    console.log("👀 Watching for changes...");
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error("❌ esbuild fatal error:", e);
  process.exit(1);
});
