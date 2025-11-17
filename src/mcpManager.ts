import * as vscode from "vscode";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";  // ✅ Added import for file system module

dotenv.config();

/* ---------------------------------------------------------
   🔧 Interfaces
--------------------------------------------------------- */
export interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  type?: string;
}

export interface MCPServer {
  name: string;
  client: any;
  transport: any;
  isConnected: boolean;
}

/* ---------------------------------------------------------
   🧠 MCP Manager Class
--------------------------------------------------------- */
export class MCPManager {
  private servers: Map<string, MCPServer> = new Map();
  private statusBarItem: vscode.StatusBarItem;

  constructor(private context: vscode.ExtensionContext) {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = "snap-code-plugin.showMCPStatus";
    this.updateStatusBar();
    this.context.subscriptions.push(this.statusBarItem);

    // 🟢 Auto connect all servers when extension starts
    this.autoConnectOnStartup();
  }

  /* ---------------------------------------------------------
     ⚙️ Auto-connect wrapper
  --------------------------------------------------------- */
  private async autoConnectOnStartup() {
    vscode.window.setStatusBarMessage("$(sync~spin) Connecting MCP servers...", 3000);
    try {
      await this.connectAllServers();
      vscode.window.showInformationMessage("✅ MCP servers auto-connected.");
    } catch (err) {
      console.error("⚠️ MCP auto-connect failed:", err);
      vscode.window.showWarningMessage("⚠️ MCP auto-connect failed. Check console for details.");
    } finally {
      this.updateStatusBar();
    }
  }

  /* ---------------------------------------------------------
     🔌 Initialize a single MCP server
  --------------------------------------------------------- */
  async initializeServer(name: string, config: MCPServerConfig): Promise<void> {
    try {
      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: config.env,
      });

      const client = new Client(
        { name: `snap-code-plugin-${name}`, version: "1.0.0" },
        { capabilities: {} }
      );

      await client.connect(transport);

      this.servers.set(name, { name, client, transport, isConnected: true });
      this.updateStatusBar();
      console.log(`✅ [MCP] Server '${name}' connected`);
    } catch (error) {
      console.error(`❌ Failed to connect to MCP server '${name}':`, error);
      vscode.window.showErrorMessage(`Failed to connect MCP server '${name}'`);
    }
  }

  /* ---------------------------------------------------------
     🔌 Disconnect / Utility
  --------------------------------------------------------- */
  async disconnectServer(name: string): Promise<void> {
    const server = this.servers.get(name);
    if (server) {
      try {
        await server.client.close();
        this.servers.delete(name);
        this.updateStatusBar();
        console.log(`🔌 Disconnected MCP server '${name}'`);
      } catch (error) {
        console.error(`Failed to disconnect MCP server '${name}':`, error);
      }
    }
  }

  async disconnectAll(): Promise<void> {
    for (const name of this.servers.keys()) {
      await this.disconnectServer(name);
    }
  }

  /* ---------------------------------------------------------
     🧰 Call a tool on a specific MCP
  --------------------------------------------------------- */
  async callTool(serverName: string, toolName: string, args: any): Promise<any> {
    const server = this.servers.get(serverName);
    if (!server || !server.isConnected)
      {throw new Error(`MCP Server '${serverName}' is not connected`);}

    try {
      const result = await server.client.callTool({ name: toolName, arguments: args });
      return result;
    } catch (error) {
      console.error(`Failed to call tool '${toolName}' on server '${serverName}':`, error);
      throw error;
    }
  }

  /* ---------------------------------------------------------
     🧾 List tools
  --------------------------------------------------------- */
  async listTools(serverName: string): Promise<any[]> {
    const server = this.servers.get(serverName);
    if (!server || !server.isConnected)
      {throw new Error(`MCP Server '${serverName}' is not connected`);}
    const tools = await server.client.listTools();
    return tools.tools;
  }

  /* ---------------------------------------------------------
     🔍 Helpers
  --------------------------------------------------------- */
  getConnectedServers(): string[] {
    return Array.from(this.servers.keys()).filter(
      (name) => this.servers.get(name)?.isConnected
    );
  }

  isServerConnected(name: string): boolean {
    return this.servers.get(name)?.isConnected ?? false;
  }

  private updateStatusBar(): void {
    const count = this.getConnectedServers().length;
    this.statusBarItem.text = `$(plug) MCP: ${count}`;
    this.statusBarItem.tooltip = `${count} MCP server(s) connected`;
    this.statusBarItem.show();
  }

  /* ---------------------------------------------------------
     ⚡ Auto Connect All Servers (with dependency order)
  --------------------------------------------------------- */
  async connectAllServers(): Promise<void> {
    const azurePat = process.env.AZURE_DEVOPS_PAT;
    const azureOrg = process.env.AZURE_ORG_URL;
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    const workspaceRoot = vscode.workspace.rootPath || process.cwd();

    console.log("🔍 [MCPManager] Checking creds:", {
      azurePat: !!azurePat,
      azureOrg,
      figmaToken: !!figmaToken,
    });

    try {
      // 🧩 STEP 1 — Connect Instructions MCP FIRST
      await this.initializeServer("instructions-mcp", {
        command: "node",
        args: [path.join(workspaceRoot, "mcp", "instructions-mcp.js")],
        type: "stdio",
      });

      // 🧠 Verify copilot-instructions.md exists before proceeding
      const verify = await this.callTool("instructions-mcp", "verifyInstructions", {});
      const result = verify?.content?.[0]?.data;
      if (!result?.loaded) {
        vscode.window.showErrorMessage("❌ Missing copilot-instructions.md — cannot start other MCPs.");
        return;
      }

      vscode.window.showInformationMessage("✅ Instructions MCP verified, loading other MCPs...");

      // 🧩 STEP 2 — Connect Figma Developer MCP
      if (figmaToken) {
        await this.initializeServer("Framelink Figma MCP", {
          command: "npx",
          args: ["-y", "figma-developer-mcp", `--figma-api-key=${figmaToken}`, "--stdio"],
          type: "stdio",
        });
      }

      // 🧩 STEP 3 — Connect Azure DevOps MCP
      if (azurePat && azureOrg) {
        await this.initializeServer("ado", {
          command: "npx",
          args: ["-y", "@azure-devops/mcp", "SomnathRoy0600"],
          type: "stdio",
        });
      }

      // 🧩 STEP 4 — Connect optional local instruction MCPs
      const figmaMCP = path.join(workspaceRoot, "mcp", "figma-instructions-mcp.js");
      const nonFigmaMCP = path.join(workspaceRoot, "mcp", "nonfigma-instructions-mcp.js");

      if (fs.existsSync(figmaMCP)) {
        await this.initializeServer("figma-instructions-mcp", {
          command: "node",
          args: [figmaMCP],
          type: "stdio",
        });
      }

      if (fs.existsSync(nonFigmaMCP)) {
        await this.initializeServer("nonfigma-instructions-mcp", {
          command: "node",
          args: [nonFigmaMCP],
          type: "stdio",
        });
      }

      console.log("✅ [MCP] All servers connected successfully.");
    } catch (error) {
      console.error("⚠️ MCP auto-connect failed:", error);
      vscode.window.showWarningMessage("⚠️ Some MCP servers could not auto-connect.");
    }
  }
}

/* ---------------------------------------------------------
   🧩 Mock Figma Query (for local testing)
--------------------------------------------------------- */
export async function runFigmaQuery(query: string) {
  console.log("[runFigmaQuery] Simulating Figma design fetch for:", query);
  return {
    query,
    design_name: "Login Page",
    components: [
      { name: "Header", type: "text", properties: { fontSize: 24, color: "#333" } },
      { name: "UsernameInput", type: "input", properties: { placeholder: "Enter username" } },
      { name: "PasswordInput", type: "input", properties: { placeholder: "Enter password" } },
      { name: "SubmitButton", type: "button", properties: { label: "Login" } },
    ],
    metadata: { author: "Mock Figma API", timestamp: new Date().toISOString(), version: "0.1" },
  };
}
