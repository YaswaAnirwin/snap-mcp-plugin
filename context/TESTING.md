# Testing the MCP Manager Extension

## Steps to Test

### 1. Reload the Extension Host Window
After compilation completes:
- In the Extension Development Host window, press `Ctrl+R` (or `Cmd+R` on Mac)
- This reloads the window with the updated extension code

### 2. Check Extension Activation
Open the Developer Console:
- Press `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac)
- Go to the **Console** tab
- Look for: `MCP Manager extension is now active!`

### 3. Test Commands
Press `Ctrl+Shift+P` and type "MCP" - you should see:
- `MCP: Setup Servers`
- `MCP: Show Status`  
- `MCP: Configure Credentials`
- `MCP: Disconnect All Servers`

Try running: **MCP: Setup Servers**

### 4. Check Chat Participant
**Important:** The Chat Participant (`@mcp`) will only work if:
- ✅ VS Code version is 1.105.0 or higher
- ✅ GitHub Copilot extension is installed and active
- ✅ You have GitHub Copilot access

To check:
1. Open Copilot Chat (icon in sidebar or `Ctrl+Shift+I`)
2. Type `@` and look for `@mcp` in the suggestions
3. If you don't see it, check the console for errors

### 5. Check Output Panel
- Press `Ctrl+Shift+U` to open Output panel
- Look in the dropdown for extension-related output
- Check for any error messages

## Expected Behavior

### On First Launch
You should see a popup asking:
```
Welcome to MCP Manager! Would you like to setup MCP servers now?
[Setup Now] [Later]
```

### When Running "MCP: Setup Servers"
You'll get a quick pick menu:
```
Select MCP servers to setup
- Setup All Servers
- Setup Azure DevOps Only
- Setup Figma Only
```

Then it will prompt for credentials:
- Azure DevOps Personal Access Token (password field)
- Azure DevOps Organization URL
- Figma Access Token (password field)

### Status Bar
Bottom right corner should show:
```
🔌 MCP: 0
```
(The number shows connected servers)

## Common Issues

### Issue: Commands don't appear
**Solution**: 
- Reload the window (`Ctrl+R` in Extension Development Host)
- Check the console for activation errors
- Verify `package.json` has the commands listed

### Issue: Chat participant doesn't work
**Check**:
1. VS Code version: Help → About (must be 1.105.0+)
2. GitHub Copilot installed: Extensions → Search "GitHub Copilot"
3. Console errors: Look for "Failed to register chat participant"

### Issue: "e is not iterable" error
This error was in the GitHub Copilot extension itself. The fixes we made should prevent our extension from causing it.

### Issue: Extension doesn't activate
**Check**:
1. Compilation succeeded (look for `dist/extension.js`)
2. No TypeScript errors in Problems panel
3. `activationEvents` in package.json is correct

## Debug Mode

To debug:
1. In your main VS Code window (not Extension Development Host)
2. Set breakpoints in your `.ts` files
3. Press F5 again
4. Breakpoints will hit when the code executes

## Quick Verification Checklist

- [ ] Extension Development Host window opened
- [ ] Console shows "MCP Manager extension is now active!"
- [ ] Commands appear in Command Palette
- [ ] Status bar shows MCP indicator
- [ ] No errors in console
- [ ] Can run "MCP: Setup Servers" command
- [ ] (Optional) `@mcp` appears in Copilot Chat

## Next Steps

Once basic commands work:
1. Run "MCP: Setup Servers"
2. Enter test credentials (or real ones)
3. Check if servers connect
4. Try `@mcp test query` in Copilot Chat

## Getting Help

If issues persist:
1. Check console errors (include full stack trace)
2. Check VS Code version
3. Verify GitHub Copilot is working separately
4. Review the compiled `dist/extension.js` for errors
