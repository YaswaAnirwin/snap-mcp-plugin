#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";

/* ---------------------------------------------------------
   🧠 Initialize the MCP Server (no built-in handler bug)
--------------------------------------------------------- */
const server = new Server(
  { name: "instructions-mcp", version: "1.21.1" },
  { capabilities: {} }
);

/* ---------------------------------------------------------
   📄 Utility: Load all markdown instruction files
--------------------------------------------------------- */
function loadInstructionFiles() {
  const contextDir = path.join(process.cwd(), "context");
  const result = { files_loaded: [], combined_text: "", timestamp: new Date().toISOString() };

  if (!fs.existsSync(contextDir)) {
    console.warn("⚠️ context folder not found:", contextDir);
    return result;
  }

  const mdFiles = fs.readdirSync(contextDir).filter((f) => f.endsWith(".md"));
  let combined = "";

  for (const file of mdFiles) {
    try {
      const fullPath = path.join(contextDir, file);
      const content = fs.readFileSync(fullPath, "utf8");
      combined += `\n\n# ${file}\n${content}`;
      result.files_loaded.push(file);
    } catch (err) {
      console.error(`❌ Failed to read ${file}:`, err.message);
    }
  }

  // Inline “Include: other.md” support
  const includeRegex = /Include:\s*([^\n]+)/gi;
  let resolved = combined;
  let match;
  while ((match = includeRegex.exec(combined)) !== null) {
    const includePath = path.join(contextDir, match[1].trim());
    if (fs.existsSync(includePath)) {
      const inc = fs.readFileSync(includePath, "utf8");
      resolved = resolved.replace(match[0], `\n\n${inc}`);
    }
  }

  result.combined_text = resolved.trim();
  result.timestamp = new Date().toISOString();
  return result;
}

/* ---------------------------------------------------------
   🚀 Manual request handling (bypasses SDK bug)
--------------------------------------------------------- */
const transport = new StdioServerTransport();

// manually handle "tools/call"
transport.onRequest = async (req) => {
  if (req.method === "tools/call" && req.params?.name === "getInstructions") {
    console.log("📦 Loading Copilot instruction markdown files...");
    const data = loadInstructionFiles();
    return { content: [{ type: "json", data }] };
  }

  // ignore all other calls
  return null;
};

/* ---------------------------------------------------------
   🧩 Start the server
--------------------------------------------------------- */
await server.connect(transport);
console.log("✅ instructions-mcp running — serving local context markdown files.");
