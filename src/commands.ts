import * as vscode from 'vscode';
import { MCPManager, MCPServerConfig } from './mcpManager.js';
import * as path from 'path';
import * as os from 'os';

export async function setupMCPServers(mcpManager: MCPManager): Promise<void> {
    const config = vscode.workspace.getConfiguration('mcpManager');
    
    // Show setup wizard
    const selection = await vscode.window.showQuickPick(
        ['Setup All Servers', 'Setup Azure DevOps Only', 'Setup Figma Only'],
        {
            placeHolder: 'Select MCP servers to setup'
        }
    );

    if (!selection) {
        return;
    }

    const shouldSetupAzure = selection.includes('All') || selection.includes('Azure');
    const shouldSetupFigma = selection.includes('All') || selection.includes('Figma');

    if (shouldSetupAzure) {
        await setupAzureDevOpsMCP(mcpManager, config);
    }

    if (shouldSetupFigma) {
        await setupFigmaMCP(mcpManager, config);
    }

    vscode.window.showInformationMessage('MCP servers setup completed!');
}

async function setupAzureDevOpsMCP(mcpManager: MCPManager, config: vscode.WorkspaceConfiguration): Promise<void> {
    let pat = config.get<string>('azureDevOps.pat');
    let organization = config.get<string>('azureDevOps.organization');

    if (!pat) {
        pat = await vscode.window.showInputBox({
            prompt: 'Enter Azure DevOps Personal Access Token (PAT)',
            password: true,
            ignoreFocusOut: true
        });

        if (!pat) {
            vscode.window.showWarningMessage('Azure DevOps PAT is required');
            return;
        }

        await config.update('azureDevOps.pat', pat, vscode.ConfigurationTarget.Global);
    }

    if (!organization) {
        organization = await vscode.window.showInputBox({
            prompt: 'Enter Azure DevOps Organization URL (e.g., https://dev.azure.com/yourorg)',
            ignoreFocusOut: true
        });

        if (!organization) {
            vscode.window.showWarningMessage('Azure DevOps Organization URL is required');
            return;
        }

        await config.update('azureDevOps.organization', organization, vscode.ConfigurationTarget.Global);
    }

    // Install Azure DevOps MCP server if not already installed
    await installMCPServer('azure-devops', '@azure-devops/mcp@next');

    // Configure and connect
    const serverConfig: MCPServerConfig = {
        command: 'npx',
        args: ['-y', '@azure-devops/mcp@next', organization],
        // env: {
        //     AZURE_DEVOPS_PAT: pat,
        //     AZURE_DEVOPS_ORGANIZATION: organization
        // }
    };

    await mcpManager.initializeServer('azure-devops', serverConfig);
}

async function setupFigmaMCP(mcpManager: MCPManager, config: vscode.WorkspaceConfiguration): Promise<void> {
    let accessToken = config.get<string>('figma.accessToken');

    if (!accessToken) {
        accessToken = await vscode.window.showInputBox({
            prompt: 'Enter Figma Access Token',
            password: true,
            ignoreFocusOut: true
        });

        if (!accessToken) {
            vscode.window.showWarningMessage('Figma Access Token is required');
            return;
        }

        await config.update('figma.accessToken', accessToken, vscode.ConfigurationTarget.Global);
    }

    // Install Figma MCP server if not already installed
    await installMCPServer('figma', '@modelcontextprotocol/server-figma');

    // Configure and connect
    const serverConfig: MCPServerConfig = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-figma'],
        env: {
            FIGMA_ACCESS_TOKEN: accessToken
        }
    };

    await mcpManager.initializeServer('figma', serverConfig);
}

async function installMCPServer(name: string, packageName: string): Promise<void> {
    const installing = vscode.window.setStatusBarMessage(`$(sync~spin) Installing ${name} MCP server...`);
    
    try {
        // The npx command will automatically download and cache the package
        // No explicit installation needed
        installing.dispose();
        vscode.window.setStatusBarMessage(`$(check) ${name} MCP server ready`, 3000);
    } catch (error) {
        installing.dispose();
        vscode.window.showErrorMessage(`Failed to prepare ${name} MCP server: ${error}`);
        throw error;
    }
}

export async function showMCPStatus(mcpManager: MCPManager): Promise<void> {
    const connectedServers = mcpManager.getConnectedServers();
    
    if (connectedServers.length === 0) {
        const action = await vscode.window.showInformationMessage(
            'No MCP servers are connected',
            'Setup Now'
        );
        
        if (action === 'Setup Now') {
            await setupMCPServers(mcpManager);
        }
        return;
    }

    const items = connectedServers.map(name => ({
        label: `$(plug) ${name}`,
        description: 'Connected',
        detail: 'Click to view available tools',
        serverName: name
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Connected MCP Servers'
    });

    if (selected) {
        await showServerTools(mcpManager, selected.serverName);
    }
}

async function showServerTools(mcpManager: MCPManager, serverName: string): Promise<void> {
    try {
        const tools = await mcpManager.listTools(serverName);
        
        const items = tools.map(tool => ({
            label: tool.name,
            description: tool.description || '',
            detail: JSON.stringify(tool.inputSchema, null, 2)
        }));

        await vscode.window.showQuickPick(items, {
            placeHolder: `Available tools in ${serverName}`
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to list tools: ${error}`);
    }
}

export async function configureMCPCredentials(): Promise<void> {
    const options = [
        { label: '$(key) Azure DevOps PAT', action: 'azure-pat' },
        { label: '$(link) Azure DevOps Organization', action: 'azure-org' },
        { label: '$(key) Figma Access Token', action: 'figma-token' }
    ];

    const selected = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select credential to configure'
    });

    if (!selected) {
        return;
    }

    const config = vscode.workspace.getConfiguration('mcpManager');

    switch (selected.action) {
        case 'azure-pat':
            const pat = await vscode.window.showInputBox({
                prompt: 'Enter Azure DevOps Personal Access Token',
                password: true,
                value: config.get<string>('azureDevOps.pat')
            });
            if (pat) {
                await config.update('azureDevOps.pat', pat, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage('Azure DevOps PAT updated');
            }
            break;

        case 'azure-org':
            const org = await vscode.window.showInputBox({
                prompt: 'Enter Azure DevOps Organization URL',
                value: config.get<string>('azureDevOps.organization')
            });
            if (org) {
                await config.update('azureDevOps.organization', org, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage('Azure DevOps Organization updated');
            }
            break;

        case 'figma-token':
            const token = await vscode.window.showInputBox({
                prompt: 'Enter Figma Access Token',
                password: true,
                value: config.get<string>('figma.accessToken')
            });
            if (token) {
                await config.update('figma.accessToken', token, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage('Figma Access Token updated');
            }
            break;
    }
}

export async function configureNativeMCPIntegration(): Promise<void> {
    const enable = await vscode.window.showQuickPick(
        ['Enable Native Copilot MCP Integration', 'View Current Configuration', 'Create MCP Config File', 'Disable'],
        {
            placeHolder: 'Configure how Copilot accesses MCP servers'
        }
    );

    if (!enable) {
        return;
    }

    const config = vscode.workspace.getConfiguration('mcpManager');

    if (enable === 'Enable Native Copilot MCP Integration') {
        const pat = config.get<string>('azureDevOps.pat');
        const org = config.get<string>('azureDevOps.organization');
        const figmaToken = config.get<string>('figma.accessToken');

        if (!pat && !figmaToken) {
            const setup = await vscode.window.showInformationMessage(
                'No credentials configured. Would you like to setup MCP servers first?',
                'Setup Now',
                'Cancel'
            );
            
            if (setup === 'Setup Now') {
                vscode.commands.executeCommand('snap-code-plugin.setupMCP');
                return;
            }
            return;
        }

        // Configure MCP servers in Copilot's settings
        const mcpServers: any = {};

        if (pat && org) {
            mcpServers['azure-devops'] = {
                command: 'npx',
                args: ['-y', '@modelcontextprotocol/server-azure-devops'],
                env: {
                    AZURE_DEVOPS_PAT: pat,
                    AZURE_DEVOPS_ORGANIZATION: org
                }
            };
        }

        if (figmaToken) {
            mcpServers['figma'] = {
                command: 'npx',
                args: ['-y', '@modelcontextprotocol/server-figma'],
                env: {
                    FIGMA_ACCESS_TOKEN: figmaToken
                }
            };
        }

        try {
            // Try to write to VS Code settings using the Copilot configuration namespace
            const vsConfig = vscode.workspace.getConfiguration('github.copilot.chat');
            
            // Check if the configuration exists first
            const inspectResult = vsConfig.inspect('mcp.servers');
            
            if (inspectResult === undefined) {
                // Configuration doesn't exist, show alternative options
                const choice = await vscode.window.showWarningMessage(
                    'The native Copilot MCP integration setting is not available in your VS Code version. This feature may require:\n\n' +
                    '• GitHub Copilot Chat extension v0.22.0 or later\n• VS Code Insiders\n• Preview features enabled\n\n' +
                    'Would you like to create a manual MCP configuration file instead?',
                    'Create Config File',
                    'Open Documentation',
                    'Cancel'
                );

                if (choice === 'Create Config File') {
                    await createMCPConfigFile(mcpServers);
                } else if (choice === 'Open Documentation') {
                    vscode.env.openExternal(vscode.Uri.parse('https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview'));
                }
                return;
            }

            // Try to update the configuration
            await vsConfig.update('mcp.servers', mcpServers, vscode.ConfigurationTarget.Global);

            vscode.window.showInformationMessage(
                '✅ Native Copilot MCP integration configured! Copilot can now use your MCP servers directly.',
                'Open Settings'
            ).then(action => {
                if (action === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'github.copilot.chat.mcp');
                }
            });

        } catch (error: any) {
            // Handle configuration errors
            const choice = await vscode.window.showErrorMessage(
                `Unable to write to Copilot settings: ${error.message}\n\n` +
                'This may be because:\n' +
                '• The setting is not supported in your VS Code version\n' +
                '• GitHub Copilot Chat extension needs to be updated\n\n' +
                'Would you like to create a manual MCP configuration file instead?',
                'Create Config File',
                'View Error',
                'Cancel'
            );

            if (choice === 'Create Config File') {
                await createMCPConfigFile(mcpServers);
            } else if (choice === 'View Error') {
                vscode.window.showErrorMessage(`Full error: ${JSON.stringify(error, null, 2)}`);
            }
        }

    } else if (enable === 'Create MCP Config File') {
        const pat = config.get<string>('azureDevOps.pat');
        const org = config.get<string>('azureDevOps.organization');
        const figmaToken = config.get<string>('figma.accessToken');

        const mcpServers: any = {};

        if (pat && org) {
            mcpServers['azure-devops'] = {
                command: 'npx',
                args: ['-y', '@modelcontextprotocol/server-azure-devops'],
                env: {
                    AZURE_DEVOPS_PAT: pat,
                    AZURE_DEVOPS_ORGANIZATION: org
                }
            };
        }

        if (figmaToken) {
            mcpServers['figma'] = {
                command: 'npx',
                args: ['-y', '@modelcontextprotocol/server-figma'],
                env: {
                    FIGMA_ACCESS_TOKEN: figmaToken
                }
            };
        }

        await createMCPConfigFile(mcpServers);

    } else if (enable === 'View Current Configuration') {
        try {
            const vsConfig = vscode.workspace.getConfiguration('github.copilot.chat');
            const mcpServers = vsConfig.get('mcp.servers');
            
            if (mcpServers) {
                const doc = await vscode.workspace.openTextDocument({
                    content: JSON.stringify({ 'github.copilot.chat.mcp.servers': mcpServers }, null, 2),
                    language: 'json'
                });
                await vscode.window.showTextDocument(doc);
            } else {
                vscode.window.showInformationMessage('No native MCP configuration found.');
            }
        } catch (error: any) {
            vscode.window.showWarningMessage(`Unable to read Copilot settings: ${error.message}`);
        }

    } else if (enable === 'Disable') {
        try {
            const vsConfig = vscode.workspace.getConfiguration('github.copilot.chat');
            await vsConfig.update('mcp.servers', undefined, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Native Copilot MCP integration disabled');
        } catch (error: any) {
            vscode.window.showErrorMessage(`Unable to disable: ${error.message}`);
        }
    }
}

async function createMCPConfigFile(mcpServers: any): Promise<void> {
    const configContent = {
        'mcpServers': mcpServers
    };

    const configJson = JSON.stringify(configContent, null, 2);

    // Show the configuration in a new document
    const doc = await vscode.workspace.openTextDocument({
        content: configJson,
        language: 'json'
    });

    await vscode.window.showTextDocument(doc);

    const choice = await vscode.window.showInformationMessage(
        '📋 MCP configuration created!\n\n' +
        'To enable native Copilot integration:\n\n' +
        '1. Copy this configuration\n' +
        '2. Open VS Code Settings (JSON)\n' +
        '3. Add it under "github.copilot.chat.mcp.servers"\n\n' +
        'Note: This requires GitHub Copilot Chat extension with MCP support.',
        'Open Settings JSON',
        'Copy to Clipboard',
        'Save as File'
    );

    if (choice === 'Open Settings JSON') {
        vscode.commands.executeCommand('workbench.action.openSettingsJson');
        await vscode.env.clipboard.writeText(configJson);
        vscode.window.showInformationMessage('Configuration copied to clipboard!');
    } else if (choice === 'Copy to Clipboard') {
        await vscode.env.clipboard.writeText(configJson);
        vscode.window.showInformationMessage('Configuration copied to clipboard!');
    } else if (choice === 'Save as File') {
        const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file('mcp-config.json'),
            filters: { 'JSON': ['json'] }
        });
        
        if (uri) {
            const fs = require('fs');
            fs.writeFileSync(uri.fsPath, configJson);
            vscode.window.showInformationMessage(`Configuration saved to ${uri.fsPath}`);
        }
    }
}
