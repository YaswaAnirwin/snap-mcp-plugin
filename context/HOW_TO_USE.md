# 🚀 Snap Code Plugin - Complete Usage Guide

## What This Extension Does

**Snap Code Plugin** enhances GitHub Copilot by:
1. ✅ **Injecting custom context** from your workspace files/folders into Copilot requests
2. ✅ **Configuring native MCP integration** so Copilot can use Azure DevOps & Figma APIs directly
3. ✅ **Providing @snap chat participant** with enhanced context awareness

## 🎯 Two Ways to Use This Extension

### Mode 1: **Custom @snap Participant** (With Context Injection)
Use `@snap` in Copilot Chat to get responses with your workspace context automatically included.

### Mode 2: **Native Copilot Integration** (Seamless)
Configure MCP servers so Copilot uses them natively without any @ prefix needed.

---

## 📖 Quick Start Guide

### Step 1: Install and Activate

1. Press `F5` to launch Extension Development Host
2. In the new window, you'll see a welcome message
3. Check the status bar (bottom right) for: `🔌 MCP: 0`

### Step 2: Setup Credentials

Press `Ctrl+Shift+P` and run:
```
MCP: Setup Servers
```

Enter your credentials:
- **Azure DevOps PAT**: Your Personal Access Token
- **Azure DevOps Organization**: `https://dev.azure.com/yourorg`
- **Figma Access Token**: Your Figma API token

### Step 3: Choose Your Integration Mode

#### Option A: Use @snap Chat Participant (Recommended)

Just use it! Open Copilot Chat and type:
```
@snap explain this code
@snap refactor the login function
@snap check for bugs in src/app.ts
```

**@snap automatically includes**:
- Current workspace name & path
- Active file & selected code
- Content from `.github/copilot-instructions.md`
- Content from `package.json` (project context)
- Any files you mention (e.g., "check src/app.ts")

#### Option B: Configure Native Integration

Press `Ctrl+Shift+P` and run:
```
Snap: Configure Native Copilot Integration
```

Choose: **Enable Native Copilot MCP Integration**

Now Copilot can use MCP servers in ANY conversation without @snap!

---

## 🎨 How Custom Context Injection Works

### What Gets Included Automatically

When you use `@snap`, the extension gathers:

1. **Workspace Info**
   ```
   Workspace: my-project (C:\Users\...\my-project)
   ```

2. **Active File**
   ```
   Active File: app.ts
   Language: typescript
   ```

3. **Selected Code** (if any)
   ````
   Selected Code:
   ```typescript
   function login(user: string) {
       // your selected code
   }
   ```
   ````

4. **Custom Instructions**
   - Reads from `.github/copilot-instructions.md`
   - Or `.copilot-instructions.md`
   - Or `INSTRUCTIONS.md`
   - Or `.ai-instructions.md`

5. **Project Metadata**
   ```
   Project: my-app
   Description: An awesome application
   ```

6. **Mentioned Files**
   If you say: `@snap explain src/utils/helper.ts`
   It automatically reads and includes that file!

### Example Flow

**You type:**
```
@snap how do I implement authentication based on the project structure?
```

**What @snap sends to Copilot:**
````
how do I implement authentication based on the project structure?

---
Context:
Workspace: my-auth-app (C:\Users\me\my-auth-app)

Active File: login.tsx
Language: typescriptreact

Custom Instructions from .github/copilot-instructions.md:
- Always use TypeScript strict mode
- Follow React best practices
- Use JWT for authentication

Project: my-auth-app
Description: Authentication demo application

Content of package.json shows we're using:
- react: ^18.0.0
- jsonwebtoken: ^9.0.0
- express: ^4.18.0
````

**Result:** Copilot gives you a highly contextualized answer!

---

## 💡 Usage Examples

### Example 1: Code Review with Context

**Step 1:** Open a file (e.g., `src/components/Login.tsx`)
**Step 2:** Select the code you want reviewed
**Step 3:** In Copilot Chat:
```
@snap review this code for security issues
```

**What happens:**
- @snap includes your selected code
- Adds project context (dependencies, etc.)
- Adds custom instructions if you have them
- Copilot reviews with full context

### Example 2: Cross-File Analysis

```
@snap compare src/old-auth.ts and src/new-auth.ts
```

**What happens:**
- @snap reads both files (up to 5000 chars each)
- Includes them in the context
- Copilot can compare them accurately

### Example 3: Azure DevOps Query

```
@snap show my work items in Azure DevOps
```

**What happens:**
- @snap detects "Azure DevOps" keyword
- Routes to Azure DevOps MCP server
- Includes workspace context
- Returns your work items

### Example 4: Design Integration

```
@snap get the button styles from our Figma design system
```

**What happens:**
- @snap detects "Figma" keyword  
- Routes to Figma MCP server
- Retrieves design tokens/styles
- Returns them formatted for code

---

## 🎛️ Configuration Options

### VS Code Settings

Open Settings (`Ctrl+,`) and search for "MCP Manager":

```json
{
  // Credentials (securely stored)
  "mcpManager.azureDevOps.pat": "your-pat",
  "mcpManager.azureDevOps.organization": "https://dev.azure.com/yourorg",
  "mcpManager.figma.accessToken": "your-token",
  
  // Behavior
  "mcpManager.autoConnect": true  // Auto-connect on startup
}
```

### Custom Instructions File

Create `.github/copilot-instructions.md` in your workspace:

````markdown
# Project Instructions for AI

## Architecture
- This is a microservices project
- We use TypeScript and Node.js
- API Gateway pattern with Express

## Coding Standards
- Always use async/await, never callbacks
- All functions must have JSDoc comments
- Use strict TypeScript mode

## Project-Specific Context
- Authentication: JWT stored in httpOnly cookies
- Database: PostgreSQL with Prisma ORM
- Deployment: Azure Container Apps
````

**@snap will automatically include this in every request!**

---

## 🔧 Available Commands

Press `Ctrl+Shift+P` to access:

| Command | Description |
|---------|-------------|
| `MCP: Setup Servers` | Configure Azure DevOps & Figma credentials |
| `MCP: Show Status` | View connected servers & available tools |
| `MCP: Configure Credentials` | Update API tokens |
| `MCP: Disconnect All Servers` | Disconnect MCP servers |
| `Snap: Configure Native Copilot Integration` | Enable/disable native MCP in Copilot |

---

## 🆚 @snap vs Regular Copilot

### Using Regular Copilot
```
User: explain this function
Copilot: [gives generic explanation]
```

### Using @snap
```
User: @snap explain this function
Snap: [includes: file name, language, project context, custom instructions]
Copilot: [gives explanation specific to YOUR project and coding standards]
```

---

## 🐛 Troubleshooting

### Issue: @snap doesn't appear in chat

**Check:**
1. VS Code version 1.105.0+ (Help → About)
2. GitHub Copilot extension installed
3. Extension activated (look for status bar icon)
4. Reload window: `Ctrl+R`

**Console check:**
- Press `Ctrl+Shift+I` (Developer Tools)
- Look for: "Chat participant created with ID: snap-code-plugin.snap (@snap)"

### Issue: Context not being included

**Check:**
1. Make sure you're using `@snap`, not just Copilot
2. Check if `.github/copilot-instructions.md` exists
3. Open Developer Tools and look for errors
4. Verify workspace has files

### Issue: MCP servers not connecting

**Check:**
1. Run: `node --version` (need Node.js 18+)
2. Verify credentials are correct
3. Check Output panel for errors
4. Try: `MCP: Disconnect All Servers` then `MCP: Setup Servers`

### Issue: Native integration not working

**Check:**
1. Settings → Search "github.copilot.chat.mcp"
2. Verify servers are configured there
3. Restart VS Code
4. Check Copilot extension is up to date

---

## 🎯 Best Practices

### 1. Use Custom Instructions
Create `.github/copilot-instructions.md` with:
- Project architecture
- Coding standards
- Common patterns
- Security requirements

### 2. Be Specific in Prompts
```
❌ @snap fix the bug
✅ @snap fix the authentication bug in src/auth/login.ts
```

### 3. Select Code for Context
Before asking about specific code:
1. Select it in the editor
2. Then use @snap
3. It will automatically include the selection

### 4. Mention Files Explicitly
```
@snap compare src/old.ts and src/new.ts
```
Both files will be read and included!

### 5. Use Native Integration for Seamless Experience
If you want Copilot to use MCP everywhere without @snap:
```
Snap: Configure Native Copilot Integration → Enable
```

---

## 📚 Advanced Usage

### Custom Context Files

The extension looks for these files (in order):
1. `.github/copilot-instructions.md`
2. `.copilot-instructions.md`  
3. `INSTRUCTIONS.md`
4. `.ai-instructions.md`

### File Mention Patterns

You can reference files in your prompts:
- `src/app.ts` - automatically detected and read
- `file:src/utils.ts` - explicit file reference
- `folder:src/components` - (not yet implemented, coming soon)

### Token Limits

Context is limited to prevent token overflow:
- Custom instructions: 5000 characters
- Each mentioned file: 5000 characters
- Selected code: Unlimited (you control it)

---

## 🚀 What's Next?

### Current Features
- ✅ Custom context injection
- ✅ @snap chat participant
- ✅ Native Copilot MCP configuration
- ✅ Azure DevOps integration
- ✅ Figma integration
- ✅ File/folder context
- ✅ Custom instructions support

### Potential Future Features
- [ ] Folder content summarization
- [ ] Multi-file batch operations
- [ ] Context caching for performance
- [ ] Additional MCP servers (GitHub, Jira, etc.)
- [ ] Context size configuration
- [ ] Smart context ranking (most relevant files first)

---

## 💬 Real-World Examples

### Scenario 1: New Developer Onboarding
```
@snap explain the project structure and how to add a new API endpoint
```
→ Gets full context from package.json, custom instructions, and workspace structure

### Scenario 2: Bug Fix with Context
1. Open buggy file
2. Select the problematic function
3. `@snap why is this throwing an error?`
→ Includes selected code + project dependencies + instructions

### Scenario 3: Design Implementation
```
@snap implement the login button from our Figma design system
```
→ Fetches Figma design tokens + includes project's UI framework from package.json

### Scenario 4: Work Item Context
```
@snap show me work item #1234 and generate tasks for implementation
```
→ Fetches from Azure DevOps + includes project structure for context

---

## ✨ Key Takeaways

1. **Use @snap for enhanced context** - It's like giving Copilot a project briefing before every question
2. **Create custom instructions** - One-time setup for consistent, project-aware responses
3. **Select code before asking** - @snap will automatically include it
4. **Enable native integration** - For seamless MCP without @ prefixes
5. **Be specific** - Mention file paths to include them in context

---

**Ready to try it?** Press `F5`, open Copilot Chat, and type `@snap hello` to get started! 🎉
