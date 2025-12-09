#!/usr/bin/env node
/**
 * SNAP GLOBAL MCP SERVER (FINAL + STABLE)
 * -------------------------------------------------
 * ✔ Auto-detects: figma / azure devops / ui tasks
 * ✔ ALWAYS loads copilot-instructions.md
 * ✔ Keyword-based UI detection (NO LLM used)
 * ✔ Loads only relevant UI component instruction files
 * ✔ Returns hidden instructions to Copilot (copilot_context)
 * ✔ Shows ONLY filenames to the user
 * ✔ Keeps your existing tools unchanged
 * ✔ Fully JSON-RPC safe (stdout only)
 */

import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

/* ---------------------------------------------------------
   ESM SETUP
--------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------------
   GITHUB PATHS
--------------------------------------------------------- */
const OWNER = "YaswaAnirwin";
const REPO = "snap-mcp-plugin";

const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/.github`;
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/.github`;

/* ---------------------------------------------------------
   JSON-RPC HELPER FUNCTIONS
--------------------------------------------------------- */
function send(result, id) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, ...result }) + "\n");
}

function error(id, message) {
  send({ error: { code: -32000, message } }, id);
}

/* ---------------------------------------------------------
   FETCH HELPERS
--------------------------------------------------------- */
async function fetchText(url) {
  try {
    const r = await fetch(url);
    return await r.text();
  } catch {
    return "";
  }
}

async function fetchMarkdownFolder(apiUrl) {
  try {
    const r = await fetch(apiUrl, { headers: { "User-Agent": "snap-mcp" } });
    const json = await r.json();

    const mdFiles = json.filter((f) => f.name.endsWith(".md"));
    const result = [];

    for (const file of mdFiles) {
      const text = await fetchText(file.download_url);
      result.push({ name: file.name, content: text });
    }

    return result;
  } catch {
    return [];
  }
}

/* ---------------------------------------------------------
   UI COMPONENT KEYWORD MAP (Option B: No LLM)
--------------------------------------------------------- */
const UI_KEYWORD_MAP = {
  button: "Button.md",
  card: "Card.md",
  table: "Table.md",
  pagination: "Pagination.md",
  modal: "Modal.md",
  drawer: "Drawer.md",
  accordion: "Accordion.md",
  grid: "Grid.md",
  dropdown: "Dropdown.md",
  flex: "Flex.md",
  sidebar: "Sidebar.md",
  list: "VirtualList.md",
  "virtual list": "VirtualList.md",
  tabs: "Tabs.md",
  "vertical tabs": "VerticalTabs.md",
  input: "Input.md",
  textarea: "TextArea.md",
  slider: "Slider.md",
  toggle: "ToggleSwitch.md",
  alert: "Alert.md",
  snackbar: "Snackbar.md",
  form: "Form.md",
  skeleton: "Skeleton.md"
};

/* ---------------------------------------------------------
   MAIN SMART INSTRUCTION LOADER
--------------------------------------------------------- */
async function loadMergedInstructions(query) {
  const q = (query || "").toLowerCase();

  let used = [];
  let merged = "";

  /* ALWAYS load copilot-instructions.md */
  const base = await fetchText(`${RAW}/copilot-instructions.md`);
  merged += base + "\n\n";
  used.push("copilot-instructions.md");

  /* ---------------- FIGMA ---------------- */
  if (q.includes("figma.com") || q.includes("figma")) {
    const figma = await fetchText(`${RAW}/figma-instructions.md`);
    merged += figma + "\n\n";
    used.push("figma-instructions.md");
  }

  /* ---------------- AZURE DEVOPS ---------------- */
  if (q.includes("dev.azure.com") || q.includes("pbi")) {
    const ado = await fetchText(`${RAW}/azure-devops.instructions.md`);
    merged += ado + "\n\n";
    used.push("azure-devops.instructions.md");
  }

  /* ---------------- UI / FRONTEND / SAFFRON ---------------- */
  if (
    q.includes("ui") ||
    q.includes("frontend") ||
    q.includes("component") ||
    q.includes("saffron")
  ) {
    const allUiFiles = await fetchMarkdownFolder(`${API}/instructions`);

    for (const key in UI_KEYWORD_MAP) {
      if (q.includes(key)) {
        const fname = UI_KEYWORD_MAP[key];
        const file = allUiFiles.find((f) => f.name.toLowerCase() === fname.toLowerCase());
        if (file) {
          used.push(file.name);
          merged += `# ${file.name}\n${file.content}\n\n`;
        }
      }
    }
  }

  return { usedFiles: used, mergedContent: merged };
}

/* ---------------------------------------------------------
   MCP TOOL DEFINITIONS (UNCHANGED)
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
    description: "Auto-detect & load instructions (hidden to Copilot)",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } }
    }
  }
];

/* ---------------------------------------------------------
   MAIN JSON-RPC HANDLER
--------------------------------------------------------- */
process.stdin.on("data", async (chunk) => {
  let msg;
  try {
    msg = JSON.parse(chunk.toString());
  } catch {
    return;
  }

  const { id, method, params } = msg;

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

  if (method === "tools/list") {
    return send({ result: { tools: TOOL_LIST } }, id);
  }

  /* ---------------------------------------------------------
     tools/call
  --------------------------------------------------------- */
  if (method === "tools/call") {
    const tool = params?.name;
    const args = params?.arguments || {};

    /* -----------------------------------------------------
       EXISTING TOOLS (UNCHANGED — KEEP AS IS)
    ----------------------------------------------------- */

    if (tool === "getFigmaInstructions") {
      return send(
        {
          result: {
            content: [
              { type: "text", text: await fetchText(`${RAW}/figma-instructions.md`) }
            ]
          }
        },
        id
      );
    }

    if (tool === "getAzureDevOpsInstructions") {
      return send(
        {
          result: {
            content: [
              {
                type: "text",
                text: await fetchText(`${RAW}/azure-devops.instructions.md`)
              }
            ]
          }
        },
        id
      );
    }

    if (tool === "getAllInstructions") {
      const all = await fetchMarkdownFolder(API);
      const ui = await fetchMarkdownFolder(`${API}/instructions`);
      return send(
        {
          result: {
            content: [{ type: "text", text: JSON.stringify([...all, ...ui]) }]
          }
        },
        id
      );
    }

    if (tool === "getUIComponentInstructions") {
      const ui = await fetchMarkdownFolder(`${API}/instructions`);
      return send(
        {
          result: { content: [{ type: "text", text: JSON.stringify(ui) }] }
        },
        id
      );
    }

    /* -----------------------------------------------------
       NEW: detectAndLoadInstructions (main logic)
    ----------------------------------------------------- */
    if (tool === "detectAndLoadInstructions") {
      const query = args.query || "";
      const { usedFiles, mergedContent } = await loadMergedInstructions(query);

      return send(
        {
          result: {
            content: [
              /* ----------- Hidden Context for Copilot ----------- */
              {
                type: "copilot_context",
                name: "snap-hidden-instructions",
                data: mergedContent
              },
              /* ------------ Visible to the User ----------------- */
              {
                type: "text",
                text:
                  "### Instruction files used:\n" +
                  usedFiles.map((f) => "- " + f).join("\n")
              }
            ]
          }
        },
        id
      );
    }

    return error(id, `Unknown tool: ${tool}`);
  }
});

/* ---------------------------------------------------------
   STDERR ONLY (DO NOT TOUCH)
--------------------------------------------------------- */
console.error("✔ SNAP MCP SERVER READY");
