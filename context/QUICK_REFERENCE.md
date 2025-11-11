# ⚡ Snap Code Plugin - Quick Reference

## 🎯 What It Does
Enhances GitHub Copilot with:
- 📁 Custom context from your workspace files
- 🔧 Native MCP server integration (Azure DevOps, Figma)
- 🎨 Enhanced @snap chat participant

## 🚀 Quick Start

### 1. Setup (One Time)
```
Ctrl+Shift+P → MCP: Setup Servers
```
Enter: Azure DevOps PAT, Organization URL, Figma Token

### 2. Use @snap in Copilot Chat
```
@snap explain this code
@snap review src/app.ts for bugs
@snap show my Azure DevOps work items
```

### 3. Enable Native Integration (Optional)
```
Ctrl+Shift+P → Snap: Configure Native Copilot Integration
```

## 💡 What @snap Includes Automatically

| Context | Example |
|---------|---------|
| Workspace | `my-project (C:\Users\me\project)` |
| Active File | `app.ts` (TypeScript) |
| Selected Code | Your highlighted code |
| Custom Instructions | From `.github/copilot-instructions.md` |
| Project Info | From `package.json` |
| Mentioned Files | `src/utils.ts` in your prompt |

## 📝 Commands

| Command | Use Case |
|---------|----------|
| `MCP: Setup Servers` | First time setup |
| `MCP: Show Status` | Check connections |
| `MCP: Configure Credentials` | Update tokens |
| `Snap: Configure Native Integration` | Enable native MCP |

## 🎨 Usage Patterns

### Code Review
```
@snap review this function for performance issues
```

### Cross-File Analysis
```
@snap compare src/old.ts and src/new.ts
```

### Azure DevOps
```
@snap show my assigned work items
```

### Figma
```
@snap get button styles from our design system
```

### General with Context
```
@snap how do I add authentication?
```
*(Includes project structure, dependencies, instructions)*

## 🎛️ Custom Instructions

Create `.github/copilot-instructions.md`:
```markdown
# Project Instructions
- Use TypeScript strict mode
- Follow React best practices
- API: RESTful with Express
```

@snap will include this in every request!

## 🆚 Quick Comparison

### Without @snap
```
You: explain this function
Copilot: [generic explanation]
```

### With @snap
```
You: @snap explain this function
Snap: [adds workspace, file, instructions, project context]
Copilot: [project-specific explanation]
```

## 🔧 Settings

```jsonc
{
  "mcpManager.autoConnect": true,
  "mcpManager.azureDevOps.pat": "***",
  "mcpManager.azureDevOps.organization": "https://dev.azure.com/org",
  "mcpManager.figma.accessToken": "***"
}
```

## 🐛 Troubleshooting

### @snap not appearing?
1. Check VS Code 1.105.0+ (Help → About)
2. GitHub Copilot installed?
3. Reload window: `Ctrl+R`

### No context included?
1. Using `@snap` (not just Copilot)?
2. Check Developer Console (`Ctrl+Shift+I`)
3. Verify `.github/copilot-instructions.md` exists

### MCP not connecting?
1. Check Node.js: `node --version`
2. Verify credentials
3. Run: `MCP: Disconnect All` → `MCP: Setup Servers`

## 💎 Pro Tips

1. **Select Before Asking** - Select code, then use @snap
2. **Mention Files** - `@snap check src/app.ts` reads the file
3. **Use Instructions** - Create `.github/copilot-instructions.md`
4. **Be Specific** - `@snap fix auth bug in login.ts` > `@snap fix bug`
5. **Native Mode** - Enable for seamless MCP everywhere

## 📱 Status Bar

Bottom right: `🔌 MCP: 2`
- Click to view connections
- Number = connected servers

## ⌨️ Shortcuts

| Action | Shortcut |
|--------|----------|
| Command Palette | `Ctrl+Shift+P` |
| Copilot Chat | `Ctrl+Shift+I` |
| Developer Console | `F12` |
| Reload Window | `Ctrl+R` |

## 📚 Learn More

- Full Guide: [HOW_TO_USE.md](HOW_TO_USE.md)
- Testing: [TESTING.md](TESTING.md)
- Project Info: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

**Start using:** `@snap hello` in Copilot Chat! 🎉
