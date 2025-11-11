# Testing Guide - Chat Participant Enhancements

## 🚀 Quick Start Testing

### Step 1: Compile and Launch
```powershell
# Compile the extension
npm run compile

# Or watch mode (auto-recompile on changes)
npm run watch
```

Then press **F5** in VS Code to launch the Extension Development Host.

---

## ✅ Test Scenarios

### Test 1: Basic Chat Participant Registration

**Objective**: Verify `@snap` is registered correctly

**Steps**:
1. Press F5 to launch Extension Development Host
2. Open GitHub Copilot Chat (Ctrl+Alt+I or Cmd+Alt+I)
3. Type `@snap` - you should see "Snap Code Assistant" appear

**Expected Result**: 
- ✅ `@snap` appears in autocomplete
- ✅ Shows description: "Enhanced Copilot with custom context..."
- ✅ Shows icon if configured

---

### Test 2: Message History (Tutorial Step 7 Fix)

**Objective**: Verify conversational context is maintained

**Steps**:
1. Open Copilot Chat
2. Send: `@snap What is MCP?`
3. Wait for response
4. Send: `@snap Can you explain more about that?` (notice no context in 2nd message)

**Expected Result**: 
- ✅ Second response should understand "that" refers to MCP from first message
- ✅ Maintains conversational context
- ✅ Doesn't ask "what is 'that'?"

**Before Fix**: Would not understand context from previous messages
**After Fix**: Should maintain full conversation history

---

### Test 3: Slash Commands (Tutorial Step 8 Addition)

**Objective**: Verify `/azure`, `/figma`, `/status` commands work

#### Test 3a: /status Command
```
@snap /status
```

**Expected Result**:
```
## MCP Server Status

✅ azure-devops: Connected
❌ figma: Disconnected

💡 Tip: Run the MCP: Setup Servers command...
```

#### Test 3b: /azure Command
```
@snap /azure show work items
```

**Expected Result**: 
- ✅ Routes to Azure DevOps MCP server
- ✅ If not connected, shows helpful error with setup instructions

#### Test 3c: /figma Command
```
@snap /figma list designs
```

**Expected Result**: 
- ✅ Routes to Figma MCP server
- ✅ If not connected, shows helpful error

---

### Test 4: Type Safety Fix

**Objective**: Verify proper TypeScript types are used

**Steps**:
1. Open `src/chatParticipant.ts`
2. Check line 10 - should show `vscode.ChatRequestHandler` type
3. Hover over `request`, `chatContext`, `stream` parameters

**Expected Result**: 
- ✅ No `any` types used
- ✅ IntelliSense shows proper VS Code types
- ✅ No TypeScript errors

**Check in code**:
```typescript
const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,          // ✅ Not 'any'
    chatContext: vscode.ChatContext,      // ✅ Not 'any'
    stream: vscode.ChatResponseStream,    // ✅ Not 'any'
    token: vscode.CancellationToken
) => {
```

---

### Test 5: Enhanced Context Collection

**Objective**: Verify extension context is collected and used

**Steps**:
1. Ensure `context/extension-context.md` exists
2. Ensure `context/mcp-patterns.md` exists
3. Ensure `context/examples.md` exists
4. Send: `@snap How do I use this extension?`

**Expected Result**: 
- ✅ Response includes information from extension context files
- ✅ Shows understanding of extension capabilities
- ✅ Progress indicator shows "Gathering context..."

---

### Test 6: MCP Server Detection

**Objective**: Verify automatic server detection works

**Test Cases**:

#### Case A: Azure DevOps Keywords
```
@snap Show me Azure DevOps work items
@snap List pull requests in DevOps
@snap What work items are assigned to me?
```

**Expected**: Routes to `azure-devops` server

#### Case B: Figma Keywords
```
@snap Show Figma designs
@snap List Figma components
@snap Get design files from Figma
```

**Expected**: Routes to `figma` server

#### Case C: No MCP Server Needed
```
@snap What is TypeScript?
@snap Explain how to write a function
```

**Expected**: Processes with Copilot directly (no MCP routing)

---

### Test 7: Error Handling

**Objective**: Verify helpful error messages

#### Test 7a: MCP Server Not Connected
```
@snap /azure show work items
```

*With azure-devops not connected*

**Expected Result**:
```
⚠️ The **azure-devops** MCP server is not connected. 
Please run the **MCP: Setup Servers** command first.

You can run it by:
- Opening Command Palette (Ctrl+Shift+P)
- Type "MCP: Setup Servers"
- Follow the setup wizard
```

---

## 🧪 Automated Testing Commands

```powershell
# Type check
npm run check-types

# Lint check
npm run lint

# Compile
npm run compile

# Run all checks
npm run compile

# Watch mode (recommended during development)
npm run watch
```

---

## 📋 Testing Checklist

Copy this checklist to verify all fixes:

```
✅ Chat Participant Registration
   ✅ @snap appears in chat
   ✅ Correct ID: snap-code-plugin.snap
   ✅ Shows fullName: "Snap Code Assistant"
   ✅ Description visible

✅ Message History (Step 7)
   ✅ Maintains conversation context
   ✅ Follow-up questions work
   ✅ No "I don't understand" on related questions

✅ Slash Commands (Step 8)
   ✅ /status command works
   ✅ /azure command works
   ✅ /figma command works
   ✅ Commands show in autocomplete

✅ Type Safety
   ✅ No 'any' types in handler
   ✅ Proper vscode.ChatRequestHandler type
   ✅ TypeScript compilation passes
   ✅ No type errors

✅ Error Handling
   ✅ Helpful messages when server not connected
   ✅ Actionable instructions provided
   ✅ Good formatting with emojis

✅ Context Collection
   ✅ Reads extension context files
   ✅ Shows "Gathering context..." progress
   ✅ Uses context in responses
```

---

## 🐛 Troubleshooting

### Issue: @snap doesn't appear

**Check**:
1. GitHub Copilot extension installed?
2. VS Code version >= 1.105.0?
3. Extension activated? Check Output panel

**Fix**: 
```powershell
# Restart Extension Development Host
# Check console logs
```

### Issue: Message history not working

**Check**:
1. `chatContext.history` being passed correctly?
2. TypeScript compilation successful?

**Debug**:
Add console log in `chatParticipant.ts`:
```typescript
console.log('History length:', chatContext.history.length);
```

### Issue: Slash commands not showing

**Check**:
1. `package.json` has `commands` array?
2. Extension reloaded after package.json change?

**Fix**: 
Press F5 again to reload extension

---

## 📊 Performance Testing

### Response Time Test
1. Send: `@snap /status`
2. Measure time to response
3. **Target**: < 500ms

### Context Loading Test
1. Send complex query requiring context
2. Watch "Gathering context..." progress
3. **Target**: Context loaded < 1 second

---

## 🎯 Test Results Template

```markdown
## Test Results - [Date]

### Environment
- VS Code Version: 1.105.x
- Node Version: 22.x
- Extension Version: 0.0.2

### Test Results
- [ ] Basic Registration: PASS/FAIL
- [ ] Message History: PASS/FAIL
- [ ] Slash Commands: PASS/FAIL
- [ ] Type Safety: PASS/FAIL
- [ ] Error Handling: PASS/FAIL
- [ ] Context Collection: PASS/FAIL

### Issues Found
1. [Issue description]
2. [Issue description]

### Notes
[Any additional observations]
```

---

## 🚀 Quick Test Command

Run this one-liner to test everything:

```powershell
npm run compile && code --extensionDevelopmentPath=$pwd
```

Then manually test chat participant in the new window.

---

**Ready to test? Press F5 and try: `@snap /status`** 🎉
