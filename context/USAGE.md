# MCP Manager - Usage Guide

## Quick Start

1. **Install the Extension**
   - Open VS Code
   - Press F5 to launch in Extension Development Host (for development)
   - Or install the packaged .vsix file

2. **Setup MCP Servers**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type: `MCP: Setup Servers`
   - Choose which servers to setup
   - Enter your credentials when prompted

3. **Start Using**
   - Open GitHub Copilot Chat
   - Type `@mcp` followed by your query
   - Example: `@mcp Show my Azure DevOps work items`

## Chat Participant Commands

The `@mcp` chat participant automatically routes queries to the appropriate MCP server based on keywords:

### Azure DevOps Keywords
- "azure", "devops", "work item", "pull request", "PR", "sprint", "board"

### Figma Keywords  
- "figma", "design", "component", "frame", "prototype"

### Example Queries

**Azure DevOps:**
```
@mcp List all work items assigned to me
@mcp Show pull requests for project MyProject
@mcp Get details for work item 12345
@mcp Show my team's sprint status
```

**Figma:**
```
@mcp List design files in my workspace
@mcp Get components from LoginPage design
@mcp Show comments on Dashboard design
@mcp Export assets from MyProject
```

## VS Code Commands

Access these via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

### MCP: Setup Servers
Configure and connect to MCP servers. You can choose:
- Setup All Servers
- Setup Azure DevOps Only
- Setup Figma Only

### MCP: Show Status
View connected servers and their available tools. Click on a server to see:
- Tool names
- Tool descriptions
- Input schemas

### MCP: Configure Credentials
Update stored credentials:
- Azure DevOps PAT
- Azure DevOps Organization URL
- Figma Access Token

### MCP: Disconnect All Servers
Disconnect all active MCP server connections.

## Configuration

### Via Settings UI
1. Open Settings (`Ctrl+,` / `Cmd+,`)
2. Search for "MCP Manager"
3. Configure:
   - Azure DevOps PAT
   - Azure DevOps Organization
   - Figma Access Token
   - Auto-connect on startup

### Via settings.json
```json
{
  "mcpManager.azureDevOps.pat": "your-pat-token",
  "mcpManager.azureDevOps.organization": "https://dev.azure.com/yourorg",
  "mcpManager.figma.accessToken": "your-figma-token",
  "mcpManager.autoConnect": true
}
```

## Getting API Tokens

### Azure DevOps Personal Access Token (PAT)

1. Go to https://dev.azure.com
2. Click on User Settings (top right) → Personal Access Tokens
3. Click "New Token"
4. Give it a name (e.g., "MCP Manager")
5. Set expiration and scope:
   - **Work Items**: Read & Write
   - **Code**: Read
   - **Project and Team**: Read
6. Copy the token immediately (you won't see it again!)

### Figma Access Token

1. Go to https://www.figma.com
2. Click on your profile → Settings
3. Scroll to "Personal Access Tokens"
4. Click "Generate new token"
5. Give it a description (e.g., "MCP Manager")
6. Copy the token immediately

## Status Bar

The status bar shows: `$(plug) MCP: N`

- **N** = Number of connected servers
- **Click** to view status and available tools
- **Green icon** = Servers connected
- **Gray icon** = No servers connected

## Troubleshooting

### Connection Issues

**Problem**: "MCP Server connection failed"

**Solutions**:
1. Verify credentials are correct
2. Check Node.js is installed: `node --version`
3. Check internet connectivity
4. Try manual reconnect: `MCP: Disconnect All Servers` → `MCP: Setup Servers`

### Chat Participant Not Responding

**Problem**: `@mcp` doesn't show up or respond

**Solutions**:
1. Ensure GitHub Copilot extension is installed
2. Check extension is activated (status bar icon visible)
3. Restart VS Code
4. Check Output panel: View → Output → Select "MCP Manager"

### Permission Errors

**Problem**: "Access denied" or "Unauthorized"

**Solutions**:
1. Verify PAT/token has required permissions
2. Check token hasn't expired
3. For Azure DevOps: Ensure organization URL is correct
4. Regenerate tokens if needed

### No Tools Available

**Problem**: Server connected but no tools listed

**Solutions**:
1. Check MCP server is properly installed: `npx -y @modelcontextprotocol/server-azure-devops`
2. Verify environment variables are set
3. Check console for errors: Help → Toggle Developer Tools

## Advanced Usage

### Manual MCP Server Configuration

If you need custom MCP server configuration, you can modify the code in `src/commands.ts`:

```typescript
const serverConfig: MCPServerConfig = {
    command: 'node',
    args: ['path/to/your/mcp-server.js'],
    env: {
        API_KEY: 'your-key',
        CUSTOM_ENV: 'value'
    }
};
```

### Adding Custom MCP Servers

To add support for additional MCP servers:

1. Update `src/commands.ts` with a new setup function
2. Update `src/chatParticipant.ts` to detect keywords
3. Add configuration properties in `package.json`
4. Rebuild: `npm run compile`

### Debugging

1. Press `F5` to launch Extension Development Host
2. Set breakpoints in TypeScript files
3. Use Debug Console to inspect variables
4. Check Debug Output panel for logs

## Best Practices

### Security
- Store tokens in VS Code settings (encrypted)
- Never commit tokens to version control
- Use tokens with minimal required permissions
- Rotate tokens periodically

### Performance
- Enable auto-connect only if you use MCP regularly
- Disconnect unused servers
- Keep queries specific to reduce processing time

### Chat Queries
- Be specific in your requests
- Include relevant identifiers (work item IDs, file names)
- Use natural language - the AI will interpret it

## Examples by Use Case

### Daily Standup
```
@mcp Show work items I completed yesterday
@mcp List my active pull requests
@mcp Show sprint burndown chart
```

### Design Review
```
@mcp Get latest designs from Sprint-23 file
@mcp Show comments on Dashboard component
@mcp List all prototypes in project
```

### Project Planning
```
@mcp Show all open bugs in MyProject
@mcp List features in current sprint
@mcp Get work item dependencies for #1234
```

## FAQ

**Q: Does this work offline?**
A: No, MCP servers need internet connectivity to access Azure DevOps and Figma APIs.

**Q: Can I use this with multiple Azure DevOps organizations?**
A: Currently supports one organization at a time. You can reconfigure via `MCP: Configure Credentials`.

**Q: Is my data secure?**
A: Yes, credentials are stored securely in VS Code settings. Communication is encrypted (HTTPS).

**Q: Can I contribute custom MCP servers?**
A: Yes! The extension is extensible. See "Adding Custom MCP Servers" above.

**Q: What VS Code version is required?**
A: VS Code 1.105.0 or higher for Chat Participant API support.

## Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: See README.md and this guide
- **Discussions**: Join community discussions on GitHub

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Azure DevOps REST API](https://docs.microsoft.com/rest/api/azure/devops/)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [GitHub Copilot Chat API](https://code.visualstudio.com/api/extension-guides/chat)
