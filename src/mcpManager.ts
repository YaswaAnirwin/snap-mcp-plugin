import * as vscode from 'vscode';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as dotenv from "dotenv";
dotenv.config();

// =======================================================
// 🔧 Interfaces
// =======================================================
export interface MCPServerConfig {
    command: string;
    args: string[];
    env?: Record<string, string>;
    type?: string;
}

export interface MCPServer {
    name: string;
    client: Client;
    transport: StdioClientTransport;
    isConnected: boolean;
}

// =======================================================
// 🧠 MCP Manager Class
// =======================================================
export class MCPManager {
    private servers: Map<string, MCPServer> = new Map();
    private statusBarItem: vscode.StatusBarItem;

    constructor(private context: vscode.ExtensionContext) {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'snap-code-plugin.showMCPStatus';
        this.updateStatusBar();
        this.context.subscriptions.push(this.statusBarItem);
    }

    // =======================================================
    // 🔌 Initialize a single MCP server
    // =======================================================
    async initializeServer(name: string, config: MCPServerConfig): Promise<void> {
        try {
            const transport = new StdioClientTransport({
                command: config.command,
                args: config.args,
                env: config.env // ✅ Include env vars here now
            });

            const client = new Client(
                {
                    name: `snap-code-plugin-${name}`,
                    version: '1.0.0'
                },
                {
                    capabilities: {}
                }
            );

            await client.connect(transport);

            this.servers.set(name, {
                name,
                client,
                transport,
                isConnected: true
            });

            this.updateStatusBar();
            vscode.window.showInformationMessage(`✅ MCP Server '${name}' connected successfully`);
        } catch (error) {
            vscode.window.showErrorMessage(`❌ Failed to connect to MCP server '${name}': ${error}`);
            throw error;
        }
    }

    // =======================================================
    // 🔌 Disconnect a single server
    // =======================================================
    async disconnectServer(name: string): Promise<void> {
        const server = this.servers.get(name);
        if (server) {
            try {
                await server.client.close();
                this.servers.delete(name);
                this.updateStatusBar();
                vscode.window.showInformationMessage(`🔌 MCP Server '${name}' disconnected`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to disconnect MCP server '${name}': ${error}`);
            }
        }
    }

    // =======================================================
    // 🧰 Call a tool on the MCP server
    // =======================================================
    async callTool(serverName: string, toolName: string, args: any): Promise<any> {
        const server = this.servers.get(serverName);
        if (!server || !server.isConnected) {
            throw new Error(`MCP Server '${serverName}' is not connected`);
        }

        try {
            const result = await server.client.callTool({
                name: toolName,
                arguments: args
            });
            return result;
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to call tool '${toolName}' on server '${serverName}': ${error}`);
            throw error;
        }
    }

    // =======================================================
    // 🧾 List available tools from the MCP server
    // =======================================================
    async listTools(serverName: string): Promise<any[]> {
        const server = this.servers.get(serverName);
        if (!server || !server.isConnected) {
            throw new Error(`MCP Server '${serverName}' is not connected`);
        }

        try {
            const tools = await server.client.listTools();
            return tools.tools;
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to list tools for server '${serverName}': ${error}`);
            throw error;
        }
    }

    // =======================================================
    // 🧩 Utility functions
    // =======================================================
    getConnectedServers(): string[] {
        return Array.from(this.servers.keys()).filter(name => this.servers.get(name)?.isConnected);
    }

    isServerConnected(name: string): boolean {
        return this.servers.get(name)?.isConnected ?? false;
    }

    private updateStatusBar(): void {
        const connectedCount = this.getConnectedServers().length;
        this.statusBarItem.text = `$(plug) MCP: ${connectedCount}`;
        this.statusBarItem.tooltip = `${connectedCount} MCP server(s) connected`;
        this.statusBarItem.show();
    }

    async disconnectAll(): Promise<void> {
        const serverNames = Array.from(this.servers.keys());
        for (const name of serverNames) {
            await this.disconnectServer(name);
        }
    }

    // =======================================================
    // ⚡ Auto Connect All Servers (NEW)
    // =======================================================
    async connectAllServers(): Promise<void> {
        const azurePat = process.env.AZURE_DEVOPS_PAT;
        const azureOrg = process.env.AZURE_ORG_URL;
        const figmaToken = process.env.FIGMA_ACCESS_TOKEN;

        console.log("🔍 [MCPManager] Checking creds:", {
            azurePat: !!azurePat,
            azureOrg,
            figmaToken: !!figmaToken
        });

        try {
            // ✅ Start Figma MCP (Framelink Figma MCP)
            if (figmaToken) {
                await this.initializeServer("Framelink Figma MCP", {
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
            }

            // ✅ Start Azure DevOps MCP (ADO)
            if (azurePat && azureOrg) {
                await this.initializeServer("ado", {
                    command: "npx",
                    args: ["-y", "@azure-devops/mcp", "SomnathRoy0600"],
                });
            }

            console.log("✅ All available MCP servers connected automatically");
        } catch (error) {
            console.error("⚠️ Auto MCP connection failed:", error);
            vscode.window.showWarningMessage("Some MCP servers could not auto-connect.");
        }
    }


}

// =======================================================
// 🧩 ADDITIONAL FUNCTION: runFigmaQuery()
// =======================================================

/**
 * Mock implementation of a Figma MCP query.
 * 
 * For now, this simulates fetching Figma design data until the real
 * MCP server for Figma is running.
 * 
 * Later, you can replace this with a real call using:
 * await mcpManager.callTool("figma", "getDesignData", { ... })
 */
export async function runFigmaQuery(query: string) {
    // Simple simulated logic for development/testing
    console.log("[runFigmaQuery] Simulating Figma design fetch for query:", query);

    // Example mock data structure similar to what a Figma API/MCP might return
    return {
        query,
        design_name: "Login Page",
        components: [
            { name: "Header", type: "text", properties: { fontSize: 24, color: "#333" } },
            { name: "UsernameInput", type: "input", properties: { placeholder: "Enter username" } },
            { name: "PasswordInput", type: "input", properties: { placeholder: "Enter password" } },
            { name: "SubmitButton", type: "button", properties: { label: "Login" } }
        ],
        metadata: {
            author: "Mock Figma API",
            timestamp: new Date().toISOString(),
            version: "0.1"
        }
    };
}
