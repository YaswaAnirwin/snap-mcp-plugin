# Example Interactions

## Azure DevOps Examples

### User Query: "Show my work items"
**Context Provided:**
- Extension supports Azure DevOps MCP
- Available tools: list-work-items, get-work-item, create-work-item
- User has configured Azure DevOps credentials

**Expected Response:**
Call list-work-items tool with assignedTo: @me

### User Query: "Get details for work item 1234"
**Context Provided:**
- work-item-id: 1234
- Tools available

**Expected Response:**
Call get-work-item with id: 1234

## Figma Examples

### User Query: "Get button styles from design system"
**Context Provided:**
- Extension supports Figma MCP
- Available tools: list-files, get-file, get-components

**Expected Response:**
1. Search for "design system" file
2. Get components from that file
3. Filter for button styles

### User Query: "Show all design files"
**Context Provided:**
- User has Figma token configured

**Expected Response:**
Call list-files tool

## Setup and Configuration

### User Query: "How do I connect to Azure DevOps?"
**Context Provided:**
- Command: MCP: Setup Servers
- Required: PAT and Organization URL

**Expected Response:**
Guide user to run the setup command and explain where to get PAT

### User Query: "Enable native Copilot integration"
**Context Provided:**
- Command: Snap: Configure Native Copilot Integration
- This configures github.copilot.chat.mcp.servers

**Expected Response:**
Explain the command and what it does
