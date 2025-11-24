#!/usr/bin/env node
/**
 * 🌍 Global Instructions MCP (Figma-Style, No SDK)
 * ✔ Fully compatible with VS Code (any version)
 * ✔ Tools WILL be discovered
 * ✔ JSON-RPC over stdio only
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ---------------------------------------------------------
   ESM FIXES
--------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------------
   GitHub Locations
--------------------------------------------------------- */
const OWNER = "YaswaAnirwin";
const REPO = "snap-mcp-plugin";
const GITHUB_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/.github`;
const GITHUB_API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/.github`;

/* ---------------------------------------------------------
   JSON-RPC Helpers
--------------------------------------------------------- */
function send(result, id) {
  const payload = JSON.stringify({ jsonrpc: "2.0", id, ...result });
  process.stdout.write(payload + "\n");
}

function error(id, message) {
  send({ error: { code: -32000, message } }, id);
}

/* ---------------------------------------------------------
   GitHub Fetch Helpers
--------------------------------------------------------- */
async function fetchMarkdown(url) {
  try {
    const r = await fetch(url);
    return await r.text();
  } catch (err) {
    return `⚠️ Failed to fetch: ${err.message}`;
  }
}

async function fetchAllMarkdownFromFolder(apiUrl) {
  try {
    const r = await fetch(apiUrl, { headers: { "User-Agent": "instructions-mcp" } });
    const files = await r.json();

    const mdFiles = files.filter(f => f.name.endsWith(".md"));

    let out = "";
    for (const f of mdFiles) {
      const text = await fetchMarkdown(f.download_url);
      out += `\n\n# ${f.name}\n${text}`;
    }
    return out;
  } catch (err) {
    return `⚠️ GitHub folder fetch error: ${err.message}`;
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
   Tool definitions (Figma MCP style)
--------------------------------------------------------- */
const TOOL_LIST = [
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
   MAIN REQUEST HANDLER (Figma style)
--------------------------------------------------------- */
process.stdin.on("data", async (chunk) => {
  let msg;
  try {
    msg = JSON.parse(chunk.toString());
  } catch {
    return;
  }

  const { id, method, params } = msg;

  // VS Code handshake
  if (method === "initialize") {
    return send(
      {
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} }
        }
      },
      id
    );
  }

  if (method === "initialized") {
    return send({ result: {} }, id);
  }

  // tools/list
  if (method === "tools/list") {
    return send({ result: { tools: TOOL_LIST } }, id);
  }

  // tools/call
  if (method === "tools/call") {
    const tool = params?.name;
    const args = params?.arguments || {};

    switch (tool) {
      case "getAllInstructions":
        return send(
          { result: { content: [{ type: "text", text: await fetchInstructions("") }] } },
          id
        );

      case "getFigmaInstructions":
        return send(
          {
            result: {
              content: [
                { type: "text", text: await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`) }
              ]
            }
          },
          id
        );

      case "getAzureDevOpsInstructions":
        return send(
          {
            result: {
              content: [
                {
                  type: "text",
                  text: await fetchMarkdown(`${GITHUB_BASE}/azure-devops.instructions.md`)
                }
              ]
            }
          },
          id
        );

      case "getUIComponentInstructions":
        return send(
          { result: { content: [{ type: "text", text: await fetchInstructions("instructions") }] } },
          id
        );

      case "detectAndLoadInstructions":
        const query = (args.query || "").toLowerCase();

        if (query.includes("figma.com"))
          return send(
            {
              result: {
                content: [
                  { type: "text", text: await fetchMarkdown(`${GITHUB_BASE}/figma-instructions.md`) }
                ]
              }
            },
            id
          );

        if (query.includes("dev.azure.com") || query.includes("pbi"))
          return send(
            {
              result: {
                content: [
                  {
                    type: "text",
                    text: await fetchMarkdown(`${GITHUB_BASE}/azure-devops.instructions.md`)
                  }
                ]
              }
            },
            id
          );

        return send(
          {
            result: {
              content: [
                { type: "text", text: await fetchInstructions("instructions") }
              ]
            }
          },
          id
        );

      default:
        return error(id, `Unknown tool: ${tool}`);
    }
  }
});

/* ---------------------------------------------------------
   BOOT MESSAGE
--------------------------------------------------------- */
console.error("✅ Global instructions-remote-mcp — READY & DISCOVERABLE");
