import * as vscode from "vscode";
import { MCPManager } from "./mcpManager";
import * as path from "path";
import { spawn } from "child_process";
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
   🧠 Load All Markdown Files from /context
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
   🔧 Helper: Safe Copilot Model Selection
--------------------------------------------------------- */
async function getCopilotModel(): Promise<vscode.LanguageModelChat | null> {
  try {
    if (!vscode.lm) {
      console.warn("⚠️ vscode.lm is undefined — Copilot Chat not initialized");
      return null;
    }

    try {
      const gpt4 = await vscode.lm.selectChatModels({
        vendor: "github",
        family: "copilot-gpt4",
      });
      if (gpt4.length > 0) {
        console.log("🧠 Using GitHub Copilot GPT-4 model.");
        return gpt4[0];
      }
    } catch (err) {
      console.warn("⚠️ Copilot GPT-4 unavailable:", err);
    }

    const copilot = await vscode.lm.selectChatModels({
      vendor: "github",
      family: "copilot",
    });
    if (copilot.length > 0) {
      console.log("💡 Using standard GitHub Copilot model.");
      return copilot[0];
    }

    console.error("❌ No supported Copilot model found.");
    return null;
  } catch (err) {
    console.error("❌ Model selection failed:", err);
    return null;
  }
}

/* ---------------------------------------------------------
   🧩 Helper: Azure DevOps API Client
--------------------------------------------------------- */
async function fetchAzureDevOpsData(endpoint: string) {
  const orgUrl = process.env.AZURE_ORG_URL;
  const pat = process.env.AZURE_DEVOPS_PAT;
  if (!orgUrl || !pat) throw new Error("Missing AZURE_ORG_URL or AZURE_DEVOPS_PAT in .env");

  const url = `${orgUrl}/${endpoint}?api-version=7.0`;
  const headers = {
    Authorization: `Basic ${Buffer.from(":" + pat).toString("base64")}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { headers });
  if (!response.ok)
    throw new Error(`Azure DevOps API Error: ${response.status} ${response.statusText}`);
  return await response.json();
}

/* ---------------------------------------------------------
   🧠 Helpers for new PBI-based logic
--------------------------------------------------------- */
function hasFigmaLink(text: string): boolean {
  const figmaRegex = /https?:\/\/(?:www\.)?figma\.com\/(?:file|proto)\/[^\s)]+/gi;
  return figmaRegex.test(text);
}

async function readCopilotInstructions(): Promise<string> {
  try {
    const filePath = path.join(__dirname, "../context/copilot-instructions.md");
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "(No copilot-instructions.md found)";
  }
}

/* ---------------------------------------------------------
   🧩 Safe MCP Tool Invocation Helper
--------------------------------------------------------- */
async function invokeMCP(tool: string, args: any): Promise<any> {
  try {
    const lm: any = vscode.lm; // cast to any to avoid type restriction
    const result = await lm.invokeTool(tool, args);
    return result;
  } catch (err) {
    console.error(`❌ MCP tool ${tool} failed:`, err);
    return {};
  }
}

/* ---------------------------------------------------------
   🧠 State Memory
--------------------------------------------------------- */
let lastFetchedImage: string | null = null;
let lastFetchedComponent: string | null = null;

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
         🔍 NEW FEATURE — PBI LINK DETECTION AND HANDLING
      ======================================================= */
      if (prompt.includes("pbi link") || prompt.match(/https?:\/\/dev\.azure\.com\/[^\s)]+/i)) {
        stream.progress("🔗 Processing PBI link...");

        const pbiUrlMatch = request.prompt.match(/https?:\/\/dev\.azure\.com\/[^\s)]+/i);
        const pbiUrl = pbiUrlMatch ? pbiUrlMatch[0] : null;
        if (!pbiUrl) {
          stream.markdown("⚠️ No valid PBI URL detected.");
          return;
        }

        const model = await getCopilotModel();
        if (!model) {
          stream.markdown("⚠️ Copilot model unavailable.");
          return;
        }

        // 1️⃣ Use ADO MCP to fetch PBI data
        stream.progress("🧾 Fetching PBI details from Azure DevOps...");
        const adoResult: any = await invokeMCP("ado.getPBIInfo", { url: pbiUrl });
        const { description, acceptanceCriteria, instructions } = adoResult ?? {};

        const pbiText = [description, acceptanceCriteria, instructions]
          .filter(Boolean)
          .join("\n\n");

        // 2️⃣ Detect Figma link
        const isFigma = hasFigmaLink(pbiText);
        stream.markdown(isFigma ? "🎨 Figma link detected!" : "🧾 Non-Figma PBI detected.");

        let finalPrompt = "";

        if (isFigma) {
          const figmaUrl = pbiText.match(/https?:\/\/(?:www\.)?figma\.com\/[^\s)]+/i)?.[0] ?? "";
          const figmaResponse: any = await invokeMCP("Framelink Figma MCP.getImage", {
            url: figmaUrl,
          });
          const figmaImage = figmaResponse?.image || "(No image found)";
          const copilotInstructions = await readCopilotInstructions();

          finalPrompt = `
The following PBI includes a Figma design link. Analyze the design and Acceptance Criteria to generate code.

🔹 **PBI Details:**
${pbiText}

🔹 **Figma Preview:**
${figmaImage}

🔹 **Guidelines (copilot-instructions.md):**
${copilotInstructions}
`;
        } else {
          finalPrompt = `
This PBI does not include any Figma link.
Use only the Acceptance Criteria and Description to generate the code.

🔹 **PBI Details:**
${pbiText}
`;
        }

        const response = await model.sendRequest(
          [vscode.LanguageModelChatMessage.User(finalPrompt)],
          {},
          token
        );

        let generated = "";
        for await (const part of response.text) generated += part;
        stream.markdown("### 🧩 Generated Code\n```ts\n" + generated.trim() + "\n```");
        return;
      }

      /* =======================================================
         🧱 STEP 0 — AZURE DEVOPS INTEGRATION
      ======================================================= */
      if (prompt.includes("azure devops") || prompt.includes("ado")) {
        stream.progress("🔄 Connecting to Azure DevOps API...");
        try {
          if (prompt.includes("repository") || prompt.includes("repositories")) {
            const data = await fetchAzureDevOpsData("_apis/git/repositories");
            stream.markdown(
              "### 📦 Repositories\n```json\n" + JSON.stringify(data, null, 2) + "\n```"
            );
          } else if (prompt.includes("project") || prompt.includes("projects")) {
            const data = await fetchAzureDevOpsData("_apis/projects");
            stream.markdown(
              "### 🏗️ Projects\n```json\n" + JSON.stringify(data, null, 2) + "\n```"
            );
          } else if (prompt.includes("work item")) {
            const match = prompt.match(/work item (\d+)/);
            if (match) {
              const id = match[1];
              const data = await fetchAzureDevOpsData(`_apis/wit/workitems/${id}`);
              stream.markdown(
                "### 🧾 Work Item Details\n```json\n" + JSON.stringify(data, null, 2) + "\n```"
              );
            } else {
              stream.markdown(
                "⚠️ Please specify a work item ID (e.g., 'get work item 12345')."
              );
            }
          } else {
            stream.markdown(
              "⚠️ Supported Azure DevOps commands:\n- list repositories\n- list projects\n- get work item <id>"
            );
          }
        } catch (err) {
          stream.markdown(`❌ Error fetching from Azure DevOps API:\n\n\`\`\`\n${err}\n\`\`\``);
        }
        return;
      }

      /* =======================================================
         🎨 STEP 1 — FETCH FIGMA DESIGN IMAGE
      ======================================================= */
      if (prompt.includes("fetch figma design")) {
        stream.progress("🎨 Fetching design preview from Figma...");
        const fileKey =
          process.env.FIGMA_FILE_KEY ||
          prompt.match(/figma\.com\/file\/([a-zA-Z0-9]+)/)?.[1];
        if (!fileKey) {
          stream.markdown("⚠️ FIGMA_FILE_KEY missing in .env or command.");
          return;
        }

        const scriptPath = path.join(context.extensionPath, "scripts", "figma_to_react.py");
        const designData = { file_key: fileKey, query: request.prompt };
        const py = spawn("python", [scriptPath], {
          cwd: context.extensionPath,
          env: { ...process.env },
        });

        let output = "",
          errorOutput = "";
        py.stdin.write(JSON.stringify(designData));
        py.stdin.end();
        py.stdout.on("data", (d: Buffer) => (output += d.toString()));
        py.stderr.on("data", (d: Buffer) => (errorOutput += d.toString()));
        await new Promise<void>((r) => py.on("close", () => r()));

        if (errorOutput) {
          stream.markdown(`❌ Python Error:\n\n\`\`\`\n${errorOutput}\n\`\`\``);
          return;
        }
        if (!output.trim()) {
          stream.markdown("⚠️ No output received from Figma script.");
          return;
        }

        let parsed: any;
        try {
          parsed = JSON.parse(output.trim());
        } catch {
          stream.markdown("⚠️ Failed to parse Python output.");
          return;
        }

        if (!parsed.found) {
          const available = parsed.available
            ? parsed.available.map((n: string) => `- ${n}`).join("\n")
            : "No components found.";
          stream.markdown(`⚠️ ${parsed.message}\n\n**Available components:**\n${available}`);
          return;
        }

        const imageUrl = parsed.image_url;
        const componentName = parsed.component;
        if (!imageUrl) {
          stream.markdown(`⚠️ No image found for ${componentName}`);
          return;
        }

        lastFetchedImage = imageUrl;
        lastFetchedComponent = componentName;

        try {
          const res = await fetch(imageUrl);
          const arrayBuffer = await res.arrayBuffer();
          const imgDir = path.join(context.extensionPath, "preview_images");
          if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir);
          const localPath = path.join(
            imgDir,
            `${componentName.replace(/\s+/g, "_")}.png`
          );
          fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
          stream.markdown(
            `🧩 **Figma Component:** ${componentName}\n![Preview](${imageUrl})\n\n✅ Image saved at:\n\`${localPath}\`\n\nRun:\n\`@snap generate react code for that image\``
          );
        } catch {
          stream.markdown(
            `🧩 **Figma Component:** ${componentName}\n![Preview](${imageUrl})\n\n⚠️ Could not save image locally.`
          );
        }
        return;
      }

      /* =======================================================
         ⚙️ STEP 2 — GENERATE REACT CODE FROM IMAGE
      ======================================================= */
      if (
        prompt.includes("generate react code") &&
        (lastFetchedImage || prompt.includes(".png") || prompt.includes("http"))
      ) {
        stream.progress("🤖 Generating React code from image...");
        const urlMatch = request.prompt.match(/https?:\/\/\S+\.png/);
        const localMatch = request.prompt.match(/([A-Za-z0-9_:\\\/.-]+\.png)/);
        const imageSource =
          urlMatch?.[0] || localMatch?.[0] || lastFetchedImage || "";
        if (!imageSource) {
          stream.markdown("⚠️ No image provided or fetched previously.");
          return;
        }

        const componentName = lastFetchedComponent || "GeneratedComponent";
        const model = await getCopilotModel();
        if (!model) {
          stream.markdown("⚠️ No Copilot model available.");
          return;
        }

        const promptMsg = `
${combinedContext}

You are a professional React developer.
Below is a UI screenshot: ${imageSource}
Describe and infer its structure, then generate production-ready React (JSX + TailwindCSS).
Use functional components, semantic HTML, and realistic placeholder text.
`;
        const messages = [vscode.LanguageModelChatMessage.User(promptMsg)];
        const response = await model.sendRequest(messages, {}, token);
        let generated = "";
        for await (const part of response.text) generated += part;

        stream.markdown(
          `### 🧩 Generated React Code for ${componentName}\n\`\`\`jsx\n${generated.trim()}\n\`\`\`\n✅ Code generation complete!`
        );
        try {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (workspaceFolders && workspaceFolders.length > 0) {
            const savePath = vscode.Uri.joinPath(
              workspaceFolders[0].uri,
              `${componentName.replace(/\s+/g, "_")}.jsx`
            );
            await vscode.workspace.fs.writeFile(
              savePath,
              Buffer.from(generated.trim(), "utf8")
            );
            stream.markdown(`💾 Saved at: **${savePath.fsPath}**`);
          }
        } catch (err) {
          console.warn("⚠️ Could not save JSX file:", err);
        }
        return;
      }

      /* =======================================================
         🪄 FALLBACK — NORMAL COPILOT TEXT HANDLING
      ======================================================= */
      stream.progress("Processing with Copilot fallback...");
      await processWithCopilot(request, request.prompt, stream, token, chatContext);
    } catch (error) {
      console.error("❌ Chat participant error:", error);
      stream.markdown(`Error: ${error}`);
    }
  };

  const chat = vscode.chat;
  const participant = chat.createChatParticipant("snap-code-plugin.snap", handler);
  participant.iconPath = vscode.Uri.joinPath(context.extensionUri, "media", "free-logo.svg");
  context.subscriptions.push(participant);
  console.log("✅ @snap chat participant registered successfully.");
  return participant;
}

/* ---------------------------------------------------------
   🧩 Copilot Fallback Logic
--------------------------------------------------------- */
async function processWithCopilot(
  request: vscode.ChatRequest,
  enhancedPrompt: string,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
  chatContext: vscode.ChatContext
) {
  try {
    const model = await getCopilotModel();
    if (!model) {
      stream.markdown("⚠️ No language model found. Please ensure GitHub Copilot Chat is installed.");
      return;
    }
    const messages = [vscode.LanguageModelChatMessage.User(`${combinedContext}\n\n${enhancedPrompt}`)];
    const response = await model.sendRequest(messages, {}, token);
    for await (const fragment of response.text) stream.markdown(fragment);
  } catch (err) {
    stream.markdown(`⚠️ Error during fallback: ${err}`);
  }
}
