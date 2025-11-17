#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { stdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// 🧠 Create the server instance
const server = new Server(
  { name: "figma-instructions-mcp", version: "1.2.0" },
  {
    capabilities: {
      tools: {
        processFigmaPBI: {
          name: "processFigmaPBI",
          description:
            "Processes Figma PBIs — loads copilot-instructions.md, fetches Figma preview, and returns merged prompt text.",
          inputSchema: {
            type: "object",
            properties: {
              figmaUrl: { type: "string" },
              pbiText: { type: "string" },
            },
            required: ["figmaUrl", "pbiText"],
          },
          outputSchema: { type: "object" },
        },
      },
    },
  }
);

// 🧩 Register handler
server.setRequestHandler("tools/call", async (req) => {
  const { name, arguments: args } = req.params;
  if (name !== "processFigmaPBI") throw new Error(`Unknown tool: ${name}`);

  const { figmaUrl, pbiText } = args;

  // Load copilot-instructions.md
  const mdPath = path.join(process.cwd(), "context", "copilot-instructions.md");
  const copilotInstructions = fs.existsSync(mdPath)
    ? fs.readFileSync(mdPath, "utf-8")
    : "(copilot-instructions.md not found)";

  // Attempt to fetch Figma preview
  let figmaPreview = "(Unable to fetch Figma image)";
  try {
    const res = await fetch(figmaUrl);
    if (res.ok && res.headers.get("content-type")?.includes("image")) {
      const buf = Buffer.from(await res.arrayBuffer());
      figmaPreview = buf.toString("base64").slice(0, 200) + "...";
    } else {
      console.warn("⚠️ Figma URL returned non-image content:", res.status);
    }
  } catch (err) {
    console.warn("⚠️ Failed to fetch Figma preview:", err.message);
  }

  // Create merged prompt
  const mergedPrompt = `
🎨 **Figma-based PBI Detected**
🔹 Figma Link: ${figmaUrl}

🧠 **copilot-instructions.md**
${copilotInstructions}

🧾 **Acceptance Criteria + PBI Text**
${pbiText}

🖼️ **Figma Preview (Base64 snippet)**
${figmaPreview}

💡 Generate full production-ready code using React + TailwindCSS based on this design and Acceptance Criteria.
  `;

  return {
    content: [
      {
        type: "json",
        data: { output: mergedPrompt, success: true, figmaUrl, includedInstructions: true },
      },
    ],
  };
});

await server.connect(stdioServerTransport());
console.log("✅ figma-instructions-mcp is running (context enhancer for UI PBIs)");
