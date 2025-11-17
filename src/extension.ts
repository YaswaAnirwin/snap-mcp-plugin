import * as vscode from "vscode";
import { MCPManager } from "./mcpManager.js";
import { registerCustomChatParticipant } from "./chatParticipant.js";
import {
  setupMCPServers,
  showMCPStatus,
  configureMCPCredentials,
  configureNativeMCPIntegration,
} from "./commands.js";

import * as path from "path";
import * as dotenv from "dotenv";

// =======================================================
// ⚙️ Load .env from workspace root
// =======================================================
dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("🔍 Loaded .env from:", path.join(__dirname, "..", ".env"));
console.log("🔍 ENV DEBUG:", {
  AZURE_DEVOPS_PAT: !!process.env.AZURE_DEVOPS_PAT,
  AZURE_ORG_URL: process.env.AZURE_ORG_URL,
  FIGMA_ACCESS_TOKEN: !!process.env.FIGMA_ACCESS_TOKEN,
});

let mcpManager: MCPManager;

/* ---------------------------------------------------------
   🔌 Extension Activation
--------------------------------------------------------- */
export async function activate(context: vscode.ExtensionContext) {
  console.log("Snap Code Plugin (MCP Manager) is now active!");

  // ✅ Initialize MCP Manager (auto-connect handled internally)
  mcpManager = new MCPManager(context);

  // ✅ Register Custom Chat Participant (core logic)
  try {
    registerCustomChatParticipant(context, mcpManager);
    console.log("✅ @snap chat participant registered successfully");
  } catch (error) {
    console.error("❌ Failed to register custom chat participant:", error);
    vscode.window.showWarningMessage(
      "Custom chat participant could not be registered. Make sure GitHub Copilot is installed."
    );
  }

  /* ---------------------------------------------------------
     🧩 Register Commands
  --------------------------------------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("snap-code-plugin.setupMCP", async () => {
      await setupMCPServers(mcpManager);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("snap-code-plugin.showMCPStatus", async () => {
      await showMCPStatus(mcpManager);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("snap-code-plugin.disconnectMCP", async () => {
      await mcpManager.disconnectAll();
      vscode.window.showInformationMessage("All MCP servers disconnected");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("snap-code-plugin.configureMCP", async () => {
      await configureMCPCredentials();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("snap-code-plugin.configureNativeIntegration", async () => {
      await configureNativeMCPIntegration();
    })
  );

  /* ---------------------------------------------------------
     ⚡ Auto-Setup MCP (Only Once)
     — handled by MCPManager constructor now
  --------------------------------------------------------- */
  console.log("⚡ MCP auto-connect handled inside MCPManager constructor");
}

/* ---------------------------------------------------------
   🧹 Deactivation
--------------------------------------------------------- */
export async function deactivate() {
  if (mcpManager) {
    await mcpManager.disconnectAll();
  }
}
