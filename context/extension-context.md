# Snap Code Plugin - Extension Context

## Purpose
This extension enhances GitHub Copilot by providing native MCP server integration for Azure DevOps and Figma.

## Architecture
- **MCPManager**: Manages MCP server lifecycle, connections, and tool execution
- **ChatParticipant**: Custom @snap participant that routes queries to MCP servers
- **Commands**: VS Code commands for setup, configuration, and status

## MCP Servers Supported
1. **Azure DevOps**: Work items, pull requests, boards, sprints
2. **Figma**: Design files, components, prototypes, comments

## Key Capabilities
- Automatic credential management
- Status bar integration showing active connections
- Native Copilot integration (configures github.copilot.chat.mcp.servers)
- Custom @snap participant for enhanced queries

## Usage Patterns
When users mention:
- "Azure DevOps", "work item", "pull request" → Route to Azure DevOps MCP
- "Figma", "design", "component" → Route to Figma MCP
- General queries → Use standard Copilot with context

## Example Queries
- "Show my Azure DevOps work items"
- "Get the button component from Figma"
- "List all pull requests in my project"
