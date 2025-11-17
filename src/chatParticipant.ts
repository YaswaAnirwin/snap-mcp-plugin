import * as vscode from "vscode";
import { MCPManager } from "./mcpManager.js";
import * as path from "path";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("✅ Loaded env:", {
  figmaFileKey: !!process.env.FIGMA_FILE_KEY,
  figmaAccessToken: !!process.env.FIGMA_ACCESS_TOKEN,
  azureOrg: process.env.AZURE_ORG_URL,
  azurePAT: !!process.env.AZURE_DEVOPS_PAT,
});

/* ---------------------------------------------------------
   🧠 Load Markdown Context
--------------------------------------------------------- */
const contextDir = path.join(__dirname, "../context");
let combinedContext = "";
try {
  const contextFiles = fs.readdirSync(contextDir).filter((f) => f.endsWith(".md"));
  for (const file of contextFiles) {
    const content = fs.readFileSync(path.join(contextDir, file), "utf8");
    combinedContext += `\n\n### ${file}\n${content}`;
    console.log(`📄 Loaded context file: ${file}`);
  }
  console.log("✅ Context files loaded successfully!");
} catch (err) {
  console.warn("⚠️ Failed to load context files:", err);
}

/* ---------------------------------------------------------
   🧠 Copilot Model Helper
--------------------------------------------------------- */
async function getCopilotModel(): Promise<vscode.LanguageModelChat | null> {
  try {
    if (!vscode.lm) {
      vscode.window.showErrorMessage("❌ Copilot Chat API not available.");
      return null;
    }

    const gpt4 = await vscode.lm.selectChatModels({ vendor: "github", family: "copilot-gpt4" });
    if (gpt4.length > 0) {return gpt4[0];}

    const fallback = await vscode.lm.selectChatModels({ vendor: "github", family: "copilot" });
    if (fallback.length > 0) {return fallback[0];}

    vscode.window.showErrorMessage("❌ No Copilot model found.");
    return null;
  } catch (err) {
    console.error("❌ Error selecting Copilot model:", err);
    return null;
  }
}

/* ---------------------------------------------------------
   🧩 Azure DevOps Fetch
--------------------------------------------------------- */
async function fetchAzureDevOpsDataFromUrl(pbiUrl: string) {
  const pat = process.env.AZURE_DEVOPS_PAT;
  if (!pat) {throw new Error("Missing Azure DevOps PAT");}
  const headers = {
    Authorization: `Basic ${Buffer.from(":" + pat).toString("base64")}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(pbiUrl + "?api-version=7.0", { headers });
  if (!response.ok) {throw new Error(`Azure DevOps Error: ${response.status} ${response.statusText}`);}
  return await response.json();
}

/* ---------------------------------------------------------
   🧩 Helper
--------------------------------------------------------- */
function hasFigmaLink(text: string): boolean {
  return /https?:\/\/(?:www\.)?figma\.com\/(?:file|proto)\/[^\s)]+/i.test(text);
}

/* ---------------------------------------------------------
   🧩 Safe MCP Invocation
--------------------------------------------------------- */
async function callMCP(manager: MCPManager, name: string, tool: string, args: any) {
  try {
    return await manager.callTool(name, tool, args);
  } catch (err) {
    console.error(`❌ MCP tool ${name}.${tool} failed:`, err);
    return null;
  }
}

/* ---------------------------------------------------------
   🧩 Main Chat Participant
--------------------------------------------------------- */
export function registerCustomChatParticipant(
  context: vscode.ExtensionContext,
  mcpManager: MCPManager
) {
  const handler: vscode.ChatRequestHandler = async (request, chatContext, stream, token) => {
    try {
      const prompt = request.prompt.toLowerCase();

      /* =======================================================
         🔍 1️⃣ PBI LINK DETECTION
      ======================================================= */
      if (prompt.match(/https?:\/\/dev\.azure\.com\/[^\s)]+/i)) {
        stream.progress("🔗 Processing PBI link...");

        const match = request.prompt.match(/https?:\/\/dev\.azure\.com\/[^\s)]+/i);
        if (!match) {
          stream.markdown("⚠️ No valid PBI URL detected.");
          return;
        }

        let apiUrl = match[0];
        const idMatch = apiUrl.match(/_workitems\/edit\/(\d+)/);
        if (idMatch) {
          apiUrl = `${process.env.AZURE_ORG_URL}/SnapCode/_apis/wit/workitems/${idMatch[1]}`;
        }

        const adoData: any = await fetchAzureDevOpsDataFromUrl(apiUrl);
        const desc = adoData?.fields?.["System.Description"] ?? "";
        const ac = adoData?.fields?.["Microsoft.VSTS.Common.AcceptanceCriteria"] ?? "";
        const pbiText = [desc, ac].filter(Boolean).join("\n\n");

        // 🧠 2️⃣ Run instructions-mcp to decide plan
        stream.progress("🧠 Analyzing PBI type via instructions-mcp...");
        const planRes = await callMCP(mcpManager, "instructions-mcp", "prepareExecutionPlan", {
          pbiText,
        });
        const plan = planRes?.content?.[0]?.data;

        if (!plan?.instructionsLoaded) {
          stream.markdown("❌ Could not load copilot instructions. Please fix context folder.");
          return;
        }

        const { runFigmaMCP, runNonFigmaMCP, mergedPrompt } = plan;

        // 🧩 3️⃣ Optionally enrich via figma/non-figma MCPs
        let enrichedPrompt = mergedPrompt;
        if (runFigmaMCP) {
          stream.progress("🎨 Loading Figma MCP context...");
          const figmaUrl = pbiText.match(/https?:\/\/(?:www\.)?figma\.com\/[^\s)]+/i)?.[0] ?? "";
          const res = await callMCP(mcpManager, "figma-instructions-mcp", "processFigmaPBI", {
            figmaUrl,
            pbiText,
          });
          enrichedPrompt += "\n\n" + (res?.output ?? "");
        } else if (runNonFigmaMCP) {
          stream.progress("📄 Loading Non-Figma MCP context...");
          const res = await callMCP(mcpManager, "nonfigma-instructions-mcp", "processNonFigmaPBI", {
            pbiText,
          });
          enrichedPrompt += "\n\n" + (res?.output ?? "");
        }

        // 🧩 4️⃣ Send merged plan to Copilot
        const model = await getCopilotModel();
        if (!model) {
          stream.markdown("⚠️ No Copilot model available.");
          return;
        }

        stream.progress("🤖 Generating code via Copilot...");
        const response = await model.sendRequest(
          [vscode.LanguageModelChatMessage.User(enrichedPrompt)],
          {},
          token
        );

        let generated = "";
        for await (const part of response.text) {generated += part;}

        if (generated.trim()) {
          stream.markdown("### 🧩 Generated Code\n```tsx\n" + generated.trim() + "\n```");
        } else {
          stream.markdown("⚠️ No code generated. Try refining the PBI or context.");
        }

        return;
      }

      /* =======================================================
         🧱 5️⃣ MANUAL ADO COMMANDS
      ======================================================= */
      if (prompt.includes("azure devops") || prompt.includes("ado")) {
        stream.progress("🔄 Fetching Azure DevOps data...");
        const data = await fetchAzureDevOpsDataFromUrl(process.env.AZURE_ORG_URL + "/_apis/projects");
        stream.markdown("### 🏗️ Projects\n```json\n" + JSON.stringify(data, null, 2) + "\n```");
        return;
      }

      /* =======================================================
         🪄 6️⃣ FALLBACK NORMAL COPILOT CHAT
      ======================================================= */
      stream.progress("Processing via fallback Copilot...");
      const model = await getCopilotModel();
      if (!model) {
        stream.markdown("⚠️ No Copilot model available.");
        return;
      }
      const response = await model.sendRequest(
        [vscode.LanguageModelChatMessage.User(`${combinedContext}\n\n${request.prompt}`)],
        {},
        token
      );
      let text = "";
      for await (const part of response.text) {text += part;}
      stream.markdown(text);
    } catch (err) {
      console.error("❌ Chat participant error:", err);
      stream.markdown(`Error: ${err}`);
    }
  };

  const chat = vscode.chat;
  const participant = chat.createChatParticipant("snap-code-plugin.snap", handler);
  participant.iconPath = vscode.Uri.joinPath(context.extensionUri, "media", "free-logo.svg");
  context.subscriptions.push(participant);
  console.log("✅ @snap chat participant registered successfully.");
  return participant;
}
