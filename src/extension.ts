import * as vscode from 'vscode';
import { MCPManager } from './mcpManager';
import { registerCustomChatParticipant } from './chatParticipant';
import { setupMCPServers, showMCPStatus, configureMCPCredentials, configureNativeMCPIntegration } from './commands';

import * as path from "path";
import * as dotenv from "dotenv";
// Force load .env from your workspace root (one level above /src)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("🔍 Loaded .env from:", path.join(__dirname, "..", ".env"));

//dotenv.config(); // ✅ Load environment variables from .env
console.log("🔍 ENV DEBUG:", {
  AZURE_DEVOPS_PAT: !!process.env.AZURE_DEVOPS_PAT,
  AZURE_ORG_URL: process.env.AZURE_ORG_URL,
  FIGMA_ACCESS_TOKEN: !!process.env.FIGMA_ACCESS_TOKEN
});


let mcpManager: MCPManager;

// =======================================================
// 🧠 Auto Setup Helper Function
// =======================================================
async function autoSetupMCPServers(mcpManager: MCPManager, context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration("mcpManager");

	const azurePat = process.env.AZURE_DEVOPS_PAT;
	const azureOrg = process.env.AZURE_ORG_URL;
	const figmaToken = process.env.FIGMA_ACCESS_TOKEN;

	console.log("🔍 Checking creds:", { azurePat: !!azurePat, azureOrg, figmaToken: !!figmaToken });

	if (!azurePat || !azureOrg || !figmaToken) {
	console.warn("⚠️ Missing credentials for MCP setup. Skipping auto setup.");
	return;
	}


	try {
		console.log("🔄 Auto-configuring MCP servers...");

		// =======================================================
		// ✅ Corrected MCP Server Commands (from Team Lead 1)
		// =======================================================

		// Connect Figma MCP (Framelink Figma MCP)
		// Figma MCP
		await mcpManager.initializeServer("Framelink Figma MCP", {
		command: "cmd",
		args: [
			"/c",
			"npx",
			"-y",
			"figma-developer-mcp",
			`--figma-api-key=${figmaToken}`,
			"--stdio",
		],
		});

		// Azure DevOps MCP
		await mcpManager.initializeServer("ado", {
		command: "npx",
		args: ["-y", "@azure-devops/mcp", "SomnathRoy0600"],
		});



		console.log("✅ MCP servers auto-setup complete!");
		vscode.window.showInformationMessage("MCP servers configured automatically.");
	} catch (err) {
		console.error("❌ Auto MCP setup failed:", err);
		vscode.window.showErrorMessage("Failed to auto-setup MCP servers. Check console for details.");
	}
}

// =======================================================
// 🔌 Extension Activation
// =======================================================
export async function activate(context: vscode.ExtensionContext) {
	console.log("Snap Code Plugin (MCP Manager) is now active!");

	// Initialize MCP Manager
	mcpManager = new MCPManager(context);

	// Register Custom Chat Participant with context injection
	try {
		registerCustomChatParticipant(context, mcpManager);
		console.log("Custom chat participant @snap registered successfully");
	} catch (error) {
		console.error("Failed to register custom chat participant:", error);
		vscode.window.showWarningMessage(
			"Custom chat participant could not be registered. Make sure GitHub Copilot is installed."
		);
	}

	// =======================================================
	// 📦 Register Commands
	// =======================================================
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

	// =======================================================
	// ⚡ Auto-Setup MCP on Activation
	// =======================================================
	try {
		await autoSetupMCPServers(mcpManager, context);
	} catch (error) {
		console.error("Auto MCP setup failed:", error);
	}

	// =======================================================
	// 📝 (OLD LOGIC - Kept for reference)
	// =======================================================
	/*
	// Auto-connect if configured
	const config = vscode.workspace.getConfiguration('mcpManager');
	if (config.get<boolean>('autoConnect')) {
		const hasCredentials = 
			config.get<string>('azureDevOps.pat') || 
			config.get<string>('figma.accessToken');
		
		if (hasCredentials) {
			// Delay auto-connect to avoid startup slowdown
			setTimeout(() => {
				setupMCPServers(mcpManager).catch(err => {
					console.error('Auto-connect failed:', err);
				});
			}, 2000);
		} else {
			// Prompt user to setup on first activation
			const action = await vscode.window.showInformationMessage(
				'Welcome to MCP Manager! Would you like to setup MCP servers now?',
				'Setup Now',
				'Later'
			);
			
			if (action === 'Setup Now') {
				await setupMCPServers(mcpManager);
			}
		}
	}
	*/
}

// =======================================================
// 🧹 Extension Deactivation
// =======================================================
export async function deactivate() {
	if (mcpManager) {
		await mcpManager.disconnectAll();
	}
}
