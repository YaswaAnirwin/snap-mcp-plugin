#!/usr/bin/env node
/**
 * 🌍 Global Instructions MCP
 * ---------------------------------------------------------
 * Loads Figma / Azure DevOps / UI (Saffron) instruction files
 * dynamically from GitHub for all connected VS Code projects.
 * ---------------------------------------------------------
 * Author: Snap Automation Team
 * Version: 1.21.1
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/* ---------------------------------------------------------
   🌐 Global GitHub Repo Base URL
--------------------------------------------------------- */
const GITHUB_BASE =
  "https://raw.githubusercontent.com/YaswaAnirwin/snap-mcp-plugin/main/.github";

/* ---------------------------------------------------------
   🧠 Initialize MCP Server
--------------------------------------------------------- */
const server = new Server(
  { name: "instructions-remote-mcp", version: "1.21.1" },
  { capabilities: {} }
);
const transport = new StdioServerTransport();

/* ---------------------------------------------------------
   📄 Helper: Fetch Markdown from GitHub
--------------------------------------------------------- */
async function fetchMarkdown(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    return `⚠️ Failed to fetch ${url}: ${err.message}`;
  }
}

/* ---------------------------------------------------------
   📦 Helper: Load Instruction Set from GitHub
--------------------------------------------------------- */
async function fetchInstructions(folder) {
  let baseUrl = GITHUB_BASE;
  if (folder) baseUrl += `/${folder}`;

  console.log(`🌐 Fetching instruction files from ${baseUrl}`);

  const indexFiles = {
    main: [
      "copilot-instructions.md",
      "figma-instructions.md",
      "azure-devops.instructions.md"
    ],
    ui: [
      "accordion.md",
      "Button.md",
      "Dropdown.md",
      "TextInput.md",
      "Tooltip.md"
    ]
  };

  const selected = folder === "instructions" ? indexFiles.ui : indexFiles.main;

  const results = [];
  for (const file of selected) {
    const url = `${baseUrl}/${file}`;
    const text = await fetchMarkdown(url);
    results.push(`\n\n# ${file}\n${text}`);
    console.log(`✅ Loaded: ${file}`);
  }

  return results.join("\n\n");
}

/* ---------------------------------------------------------
   🧩 Helper: Detect if workspace uses Saffron UI
--------------------------------------------------------- */
async function isSaffronProject() {
  try {
    const workspace = process.cwd();
    const pkgPaths = [
      path.join(workspace, "package.json"),
      path.join(workspace, "package-lock.json")
    ];

    for (const p of pkgPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf8");
        if (content.includes("saffron") || content.includes("@epam/uui")) {
          console.log(`🧩 Detected Saffron UI project via ${p}`);
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
   🚀 Handle MCP Requests
--------------------------------------------------------- */
transport.onRequest = async (req) => {
  // --- List available tools ---
  if (req.method === "tools/list") {
    return {
      tools: [
        {
          name: "getAllInstructions",
          description: "Fetch all base instruction files from GitHub"
        },
        {
          name: "getFigmaInstructions",
          description: "Fetch figma-instructions.md from GitHub"
        },
        {
          name: "getAzureDevOpsInstructions",
          description: "Fetch azure-devops.instructions.md from GitHub"
        },
        {
          name: "getUIComponentInstructions",
          description: "Fetch all UI component docs from GitHub/.github/instructions/"
        },
        {
          name: "detectAndLoadInstructions",
          description:
            "Detects query type (Figma, ADO, UI/Saffron) and fetches appropriate files from GitHub"
        }
      ]
    };
  }

  // --- Tool calls ---
  if (req.method === "tools/call") {
    const tool = req.params?.name;
    const args = req.params?.arguments || {};
    console.log(`📥 Tool called: ${tool}`);

    switch (tool) {
      case "getAllInstructions": {
        const text = await fetchInstructions("");
        return { content: [{ type: "text", text }] };
      }

      case "getFigmaInstructions": {
        const text = await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`);
        return { content: [{ type: "text", text }] };
      }

      case "getAzureDevOpsInstructions": {
        const text = await fetchMarkdown(`${GITHUB_BASE}/azure-devops.instructions.md`);
        return { content: [{ type: "text", text }] };
      }

      case "getUIComponentInstructions": {
        const text = await fetchInstructions("instructions");
        return { content: [{ type: "text", text }] };
      }

      case "detectAndLoadInstructions": {
        const query = (args.query || "").toLowerCase();

        // 🧠 Detect Figma
        if (query.includes("figma.com")) {
          const text = await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`);
          return { content: [{ type: "text", text }] };
        }

        // 🧠 Detect Azure DevOps / PBI
        if (query.includes("dev.azure.com") || query.includes("pbi")) {
          const text = await fetchMarkdown(`${GITHUB_BASE}/azure-devops.instructions.md`);
          return { content: [{ type: "text", text }] };
        }

        // 🧠 Detect Saffron/React/UI Projects
        if (
          (await isSaffronProject()) ||
          query.includes("react") ||
          query.includes("ui") ||
          query.includes("saffron")
        ) {
          const text = await fetchInstructions("instructions");
          return { content: [{ type: "text", text }] };
        }

        // ⚠️ Default Fallback
        return {
          content: [
            {
              type: "text",
              text:
                "⚠️ Could not detect context — please include a Figma, ADO, or UI keyword."
            }
          ]
        };
      }

      default:
        return {
          content: [{ type: "text", text: `❌ Unknown tool: ${tool}` }]
        };
    }
  }

  return null;
};

/* ---------------------------------------------------------
   🧪 Standalone Mode
--------------------------------------------------------- */
const isMain =
  import.meta.url.replace("file:///", "").replace(/\//g, "\\") === process.argv[1];

if (isMain) {
  console.log("🧪 Running MCP standalone test...");
  const text = await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`);
  console.log("✅ Sample fetched from GitHub:");
  console.log(text.substring(0, 200));
}

/* ---------------------------------------------------------
   🚀 Start MCP Server
--------------------------------------------------------- */
await server.connect(transport);
console.log("✅ Global instructions-remote-mcp running — serving files from GitHub.");
