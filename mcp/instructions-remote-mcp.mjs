#!/usr/bin/env node
/**
 * 🌍 Global Instructions MCP (SDK 1.21.1 Compatible)
 * Loads Figma / Azure DevOps / UI Instructions dynamically from GitHub.
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/* ---------------------------------------------------------
   ESM FIX FOR __dirname
--------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------------
   GitHub Repo URLs
--------------------------------------------------------- */
const OWNER = "YaswaAnirwin";
const REPO = "snap-mcp-plugin";
const GITHUB_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/.github`;
const GITHUB_API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/.github`;

/* ---------------------------------------------------------
   Initialize MCP Server (SDK 1.21.1 → singular "tool")
--------------------------------------------------------- */
const server = new Server(
  { name: "instructions-remote-mcp", version: "1.21.1" },
  {
    capabilities: {
      tool: {},     // MUST be singular for SDK 1.21.1
      sampling: {}
    }
  }
);

const transport = new StdioServerTransport();

/* ---------------------------------------------------------
   Fetch Helpers
--------------------------------------------------------- */
async function fetchMarkdown(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } catch (err) {
    console.warn(`⚠️ Failed to fetch ${url}: ${err.message}`);
    return "";
  }
}

async function fetchAllMarkdownFromFolder(apiUrl) {
  try {
    const r = await fetch(apiUrl, { headers: { "User-Agent": "instructions-mcp" } });
    if (!r.ok) throw new Error(`GitHub API ${r.status}`);

    const files = await r.json();
    const mdFiles = files.filter((f) => f.name.endsWith(".md"));

    const results = [];
    for (const file of mdFiles) {
      console.log(`✅ Loaded: ${file.name}`);
      const txt = await fetchMarkdown(file.download_url);
      results.push(`\n\n# ${file.name}\n${txt}`);
    }

    return results.join("\n\n");
  } catch (err) {
    console.error("❌ Folder fetch error:", err.message);
    return "";
  }
}

async function fetchInstructions(folder = "") {
  if (!folder) {
    const root = await fetchAllMarkdownFromFolder(GITHUB_API);
    const ui = await fetchAllMarkdownFromFolder(`${GITHUB_API}/instructions`);
    return root + "\n\n" + ui;
  }
  return await fetchAllMarkdownFromFolder(`${GITHUB_API}/${folder}`);
}

/* ---------------------------------------------------------
   Detect Saffron / EPAM UUI Projects
--------------------------------------------------------- */
async function isSaffronProject() {
  try {
    const workspace = process.cwd();
    const pkgFiles = [
      path.join(workspace, "package.json"),
      path.join(workspace, "package-lock.json")
    ];

    for (const f of pkgFiles) {
      if (fs.existsSync(f)) {
        const txt = fs.readFileSync(f, "utf8");
        if (txt.includes("saffron") || txt.includes("@epam/uui")) {
          console.log("🧩 Saffron UI detected");
          return true;
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ Saffron detection failed:", err.message);
  }
  return false;
}

/* ---------------------------------------------------------
   Define Tools List
--------------------------------------------------------- */
const toolList = [
  {
    name: "getAllInstructions",
    description: "Fetch all instruction files.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "getFigmaInstructions",
    description: "Fetch figma-instructions.md",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "getAzureDevOpsInstructions",
    description: "Fetch azure-devops.instructions.md",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "getUIComponentInstructions",
    description: "Fetch UI component docs",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "detectAndLoadInstructions",
    description: "Auto-detect & load instructions",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } }
    }
  }
];

/* ---------------------------------------------------------
   Main Request Handler
--------------------------------------------------------- */
transport.onRequest = async (req) => {
  try {
    /* 1) initialize */
    if (req.method === "initialize") {
      console.log("⚙️ initialize received");

      return {
        protocolVersion: "1.0",
        capabilities: {
          tool: {},    // must match constructor
          sampling: {}
        }
      };
    }

    /* 2) initialized */
    if (req.method === "initialized") {
      console.log("🔄 initialized acknowledged");
      return {};
    }

    /* 3) tools/list */
    if (req.method === "tools/list") {
      console.log("🧰 tools/list received");
      return { tools: toolList };
    }

    /* 4) tools/call */
    if (req.method === "tools/call") {
      const tool = req.params?.name;
      const args = req.params?.arguments || {};

      console.log(`📥 tools/call → ${tool}`);

      switch (tool) {
        case "getAllInstructions":
          return { content: [{ type: "text", text: await fetchInstructions("") }] };

        case "getFigmaInstructions":
          return {
            content: [
              { type: "text", text: await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`) }
            ]
          };

        case "getAzureDevOpsInstructions":
          return {
            content: [
              { type: "text", text: await fetchMarkdown(`${GITHUB_BASE}/azure-devops.instructions.md`) }
            ]
          };

        case "getUIComponentInstructions":
          return { content: [{ type: "text", text: await fetchInstructions("instructions") }] };

        case "detectAndLoadInstructions":
          const query = (args.query || "").toLowerCase();

          if (query.includes("figma.com"))
            return { content: [{ type: "text", text: await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`) }] };

          if (query.includes("dev.azure.com") || query.includes("pbi"))
            return { content: [{ type: "text", text: await fetchMarkdown(`${GITHUB_BASE}/azure-devops.instructions.md`) }] };

          if (
            (await isSaffronProject()) ||
            query.includes("react") ||
            query.includes("ui") ||
            query.includes("saffron")
          )
            return { content: [{ type: "text", text: await fetchInstructions("instructions") }] };

          return { content: [{ type: "text", text: "⚠️ Could not detect context." }] };

        default:
          return {
            content: [{ type: "text", text: `❌ Unknown tool: ${tool}` }]
          };
      }
    }

    return null;
  } catch (err) {
    console.error("❌ MCP handler error:", err);
    return {
      content: [{ type: "text", text: `❌ Internal MCP error: ${err.message}` }]
    };
  }
};

/* ---------------------------------------------------------
   Standalone Debug Mode
--------------------------------------------------------- */
const isMain = process.argv[1]?.includes("instructions-remote-mcp.mjs");
if (isMain && !process.env.VSCODE_PID) {
  console.log("🧪 Standalone test...");
  const txt = await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`);
  console.log(txt.substring(0, 200));
}

/* ---------------------------------------------------------
   Start MCP Server
--------------------------------------------------------- */
await server.connect(transport);
console.error("✅ Global instructions-remote-mcp running — ready with 5 tools.");
