# MCP Manager

Simplifies MCP (Model Context Protocol) server management with Azure DevOps and Figma integration via GitHub Copilot Chat.

## Features

- **Zero Configuration MCP Setup**: Automatically install and configure MCP servers with a single command
- **GitHub Copilot Chat Integration**: Use `@mcp` in GitHub Copilot Chat to query Azure DevOps and Figma
- **Unified Interface**: Manage multiple MCP servers from one place
- **Status Bar Integration**: See connected MCP servers at a glance
- **Secure Credential Management**: Store API keys and tokens securely in VS Code settings

## Getting Started

### Prerequisites

- Visual Studio Code 1.105.0 or higher
- Node.js 18 or higher
- GitHub Copilot extension installed
- Azure DevOps Personal Access Token (PAT) - [Create one here](https://dev.azure.com/)
- Figma Access Token - [Create one here](https://www.figma.com/developers/api#access-tokens)

### Installation

1. Install the extension from the VS Code Marketplace (or install from VSIX)
2. Run the command: **MCP: Setup Servers** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Enter your credentials when prompted:
   - Azure DevOps PAT
   - Azure DevOps Organization URL
   - Figma Access Token

### Usage

#### Using the Chat Participant

Open GitHub Copilot Chat and use `@mcp` to interact with your MCP servers:

```
@mcp Show me my recent Azure DevOps work items
@mcp List pull requests in my Azure DevOps project
@mcp Get Figma designs for the login component
```

The extension automatically routes your query to the appropriate MCP server based on keywords.

#### Commands

- **MCP: Setup Servers** - Configure and connect to MCP servers
- **MCP: Show Status** - View connected servers and available tools
- **MCP: Configure Credentials** - Update API keys and tokens
- **MCP: Disconnect All Servers** - Disconnect all MCP servers

#### Status Bar

Click the status bar item `$(plug) MCP: N` to quickly view connected servers.

## Configuration

Configure the extension via VS Code settings:

```json
{
  "mcpManager.azureDevOps.pat": "your-pat-here",
  "mcpManager.azureDevOps.organization": "https://dev.azure.com/yourorg",
  "mcpManager.figma.accessToken": "your-figma-token",
  "mcpManager.autoConnect": true
}
```

## Extension Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `mcpManager.azureDevOps.pat` | string | "" | Azure DevOps Personal Access Token |
| `mcpManager.azureDevOps.organization` | string | "" | Azure DevOps Organization URL |
| `mcpManager.figma.accessToken` | string | "" | Figma Access Token |
| `mcpManager.autoConnect` | boolean | true | Auto-connect to servers on startup |

## Examples

### Azure DevOps Queries

- "Show my assigned work items"
- "List recent pull requests"
- "Get details for work item #1234"

### Figma Queries

- "List all design files in my team"
- "Get components from [file-name]"
- "Show recent comments on [design]"

## Troubleshooting

### MCP Server Connection Failed

- Verify your credentials are correct
- Check that Node.js is installed and available in PATH
- Try disconnecting and reconnecting: **MCP: Disconnect All Servers** then **MCP: Setup Servers**

### Chat Participant Not Working

- Ensure GitHub Copilot extension is installed and active
- Restart VS Code
- Check that the extension is activated (look for status bar item)

## Development

### Building from Source

```bash
git clone https://github.com/yourusername/snap-code-plugin
cd snap-code-plugin
npm install
npm run compile
```

### Running in Development

1. Open the project in VS Code
2. Press `F5` to launch Extension Development Host
3. Test the extension in the new window

### Project Structure

```
├── src/
│   ├── extension.ts         # Main extension entry point
│   ├── mcpManager.ts        # MCP server management
│   ├── chatParticipant.ts   # GitHub Copilot Chat integration
│   ├── commands.ts          # VS Code commands
│   └── test/                # Test files
├── media/                   # Icons and assets
├── package.json             # Extension manifest
└── README.md
```

## Release Notes

### 0.0.1

Initial release:
- MCP server management for Azure DevOps and Figma
- GitHub Copilot Chat integration with @mcp participant
- Configuration UI for credentials
- Status bar integration
- Auto-connect on startup

## 📚 Documentation

For detailed documentation, see the [`documentation`](./documentation) folder:

- **[Quick Reference](./documentation/QUICK_REFERENCE.md)** - Quick command reference and tips
- **[Usage Guide](./documentation/USAGE.md)** - Detailed usage instructions
- **[How to Use](./documentation/HOW_TO_USE.md)** - Step-by-step guide
- **[Testing Guide](./documentation/TESTING.md)** - How to test the extension
- **[Project Summary](./documentation/PROJECT_SUMMARY.md)** - Project overview and architecture
- **[Implementation Details](./documentation/IMPLEMENTATION_COMPLETE.md)** - Complete implementation details
- **[Recent Fixes](./documentation/FIXES_APPLIED.md)** - Latest fixes and improvements
- **[VS Code Quick Start](./documentation/vsc-extension-quickstart.md)** - VS Code extension development guide

## License

MIT

## Credits

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Uses [VS Code Extension API](https://code.visualstudio.com/api)
- Integrates with [GitHub Copilot](https://github.com/features/copilot)

---

**Enjoy using MCP Manager!** 🚀
