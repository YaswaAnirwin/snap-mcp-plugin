#!/usr/bin/env node
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/* ---------------------------------------------------------
   📍 Base Paths & Setup
--------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_GITHUB_PATH = path.resolve(__dirname, "../.github");
const REMOTE_BASE =
  "https://raw.githubusercontent.com/YaswaAnirwin/snap-mcp-plugin/main/context";

/* ---------------------------------------------------------
   🧠 Initialize MCP Server
--------------------------------------------------------- */
const server = new Server(
  { name: "instructions-remote-mcp", version: "1.21.1" },
  { capabilities: {} }
);
const transport = new StdioServerTransport();

/* ---------------------------------------------------------
   🧾 Helper Functions
--------------------------------------------------------- */
function readLocal(file) {
  const filePath = path.join(LOCAL_GITHUB_PATH, file);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return `⚠️ File not found locally: ${file}`;
  }
}

async function fetchRemote(file) {
  const url = `${REMOTE_BASE}/${file}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    return `⚠️ Failed to fetch ${file}: ${err.message}`;
  }
}

function loadUIInstructions() {
  const folder = path.join(LOCAL_GITHUB_PATH, "instructions");
  if (!fs.existsSync(folder)) return "⚠️ UI instruction folder missing.";
  const files = fs.readdirSync(folder).filter((f) => f.endsWith(".md"));
  return files
    .map((f) => `# ${f}\n${fs.readFileSync(path.join(folder, f), "utf8")}`)
    .join("\n\n");
}

/* ---------------------------------------------------------
   🚀 Manual Request Handling for v1.21.1
--------------------------------------------------------- */
transport.onRequest = async (req) => {
  if (req.method === "tools/list") {
    return {
      tools: [
        { name: "getInstructions", description: "Fetch all context instruction files" },
        { name: "getFigmaInstructions", description: "Load Figma integration guide" },
        { name: "getAzureDevOpsInstructions", description: "Load Azure DevOps & PBI guide" },
        { name: "getUIComponentInstructions", description: "Load local Saffron UI component docs" },
        { name: "detectAndLoadInstructions", description: "Auto-detect context (Figma/ADO/UI)" },
      ],
    };
  }

  if (req.method === "tools/call") {
    const tool = req.params?.name;
    const args = req.params?.arguments || {};
    console.log(`📥 Tool called: ${tool}`);

    switch (tool) {
      case "getInstructions": {
        const mdFiles = [
          "copilot-instructions.md",
          "examples.md",
          "README.md",
          "extension-context.md",
          "QUICK_REFERENCE.md",
          "USAGE.md",
        ];
        const results = [];
        for (const f of mdFiles) {
          const text = await fetchRemote(f);
          results.push(`## ${f}\n${text}`);
        }
        return { content: [{ type: "text", text: results.join("\n\n") }] };
      }

      case "getFigmaInstructions": {
        return {
          content: [{ type: "text", text: readLocal("figma-instructions.md") }],
        };
      }

      case "getAzureDevOpsInstructions": {
        return {
          content: [
            { type: "text", text: readLocal("azure-devops.instructions.md") },
          ],
        };
      }

      case "getUIComponentInstructions": {
        return {
          content: [{ type: "text", text: loadUIInstructions() }],
        };
      }

      case "detectAndLoadInstructions": {
        const query = (args.query || "").toLowerCase();
        if (query.includes("figma.com")) {
          return {
            content: [{ type: "text", text: readLocal("figma-instructions.md") }],
          };
        }
        if (query.includes("dev.azure.com") || query.includes("pbi")) {
          return {
            content: [
              { type: "text", text: readLocal("azure-devops.instructions.md") },
            ],
          };
        }
        if (
          query.includes("react") ||
          query.includes("ui") ||
          query.includes("saffron") ||
          query.includes("component")
        ) {
          return {
            content: [{ type: "text", text: loadUIInstructions() }],
          };
        }
        return {
          content: [
            {
              type: "text",
              text:
                "⚠️ Could not detect context — include a Figma, ADO, or UI keyword.",
            },
          ],
        };
      }

      default:
        return {
          content: [
            { type: "text", text: `❌ Unknown tool: ${tool}` },
          ],
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
  console.log("✅ Sample (figma):", readLocal("figma-instructions.md").substring(0, 200));
}

/* ---------------------------------------------------------
   🚀 Start MCP Server
--------------------------------------------------------- */
await server.connect(transport);
console.log("✅ instructions-remote-mcp running — serving .github instruction files.");
