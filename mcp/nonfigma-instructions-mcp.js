#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { stdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";

// 🧠 Create server
const server = new Server(
  { name: "nonfigma-instructions-mcp", version: "1.2.0" },
  {
    capabilities: {
      tools: {
        processNonFigmaPBI: {
          name: "processNonFigmaPBI",
          description:
            "Processes Non-Figma PBIs — returns prompt built from Description + Acceptance Criteria.",
          inputSchema: {
            type: "object",
            properties: { pbiText: { type: "string" } },
            required: ["pbiText"],
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
  if (name !== "processNonFigmaPBI") throw new Error(`Unknown tool: ${name}`);

  const { pbiText } = args;

  // Try loading copilot-instructions.md (for shared rules)
  const mdPath = path.join(process.cwd(), "context", "copilot-instructions.md");
  const copilotInstructions = fs.existsSync(mdPath)
    ? fs.readFileSync(mdPath, "utf-8")
    : "(copilot-instructions.md missing)";

  const mergedPrompt = `
🧾 **Non-Figma PBI**
Use the Description and Acceptance Criteria below to generate backend or logic-related code.

📄 **copilot-instructions.md**
${copilotInstructions}

🧱 **PBI Text**
${pbiText}

💡 Generate code according to context:
- If mentions API → use FastAPI (Python)
- If mentions DB → use SQLAlchemy or PostgreSQL schema
- Else → use clean modular Python utilities.
  `;

  return {
    content: [
      {
        type: "json",
        data: { output: mergedPrompt, success: true, includedInstructions: true },
      },
    ],
  };
});

await server.connect(stdioServerTransport());
console.log("✅ nonfigma-instructions-mcp is running (context enhancer for backend PBIs)");
