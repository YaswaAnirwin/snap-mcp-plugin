# MCP Integration Best Practices

## What is MCP?
Model Context Protocol (MCP) is a standardized protocol for connecting AI assistants to external data sources and tools.

## How This Extension Uses MCP

### Server Configuration
MCP servers are spawned as child processes using:
- Command: `npx`
- Args: `['-y', '@modelcontextprotocol/server-{name}']`
- Environment variables for authentication

### Authentication
- **Azure DevOps**: Requires PAT (Personal Access Token) and Organization URL
- **Figma**: Requires Access Token from Figma settings

### Tool Execution Flow
1. User makes a query with @snap
2. Extension detects keywords (Azure DevOps, Figma)
3. Lists available tools from MCP server
4. Uses Copilot to interpret query → suggests tool + arguments
5. Executes MCP tool
6. Formats and displays results

## Common MCP Patterns

### Listing Resources
```json
{
  "toolName": "list-work-items",
  "arguments": {
    "project": "MyProject",
    "state": "Active"
  }
}
```

### Getting Details
```json
{
  "toolName": "get-work-item",
  "arguments": {
    "id": "12345"
  }
}
```

### Searching
```json
{
  "toolName": "search-designs",
  "arguments": {
    "query": "login button"
  }
}
```

## Error Handling
- Connection failures → Suggest running setup command
- Authentication errors → Prompt to update credentials
- Tool execution errors → Display error message with context
