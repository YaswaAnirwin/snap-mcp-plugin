# Change Log

All notable changes to the "snap-code-plugin" extension will be documented in this file.

## [0.0.2] - 2025-10-21

### Fixed
- **CRITICAL**: Fixed chat participant ID mismatch (`snap-code-plugin.mcp` → `snap-code-plugin.snap`)
- Fixed type annotations for chat handler (removed `any` types, now using proper VS Code types)
- Improved error messages when MCP servers are not connected

### Added
- **Slash Commands**: Added `/azure`, `/figma`, and `/status` commands for chat participant
- **Message History**: Added conversational context by including chat history (per VS Code tutorial Step 7)
- **fullName**: Added "Snap Code Assistant" as the full display name in chat
- **Status Command Handler**: Added `/status` command to check MCP server connection status
- Better progress indicators and user feedback

### Changed
- Improved type safety with proper `vscode.ChatRequestHandler` type
- Enhanced prompt building to include conversation history
- Better server detection and routing logic
- Clearer error messages with actionable instructions

### Technical Details
- Aligned implementation with official VS Code Chat API tutorial
- Added message history filtering using `vscode.ChatResponseTurn`
- Improved handler signature to match VS Code API specifications

## [0.0.1] - 2025-10-21

- Initial release
- MCP server management for Azure DevOps and Figma
- Custom chat participant `@snap`
- Configuration commands for credentials
- Auto-connect functionality