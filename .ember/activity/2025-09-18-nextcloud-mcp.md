# Activity Log for 2025-09-18

## Nextcloud MCP Server Creation

Created n8n workflows for Nextcloud file operations as MCP servers that can be used by AI tools:

- Created **Nextcloud MCP - List Files** workflow (ID: aaSmiLcyZBbCYJTP) with MCP path `NextcloudList`
- Created **Nextcloud MCP - Read File** workflow (ID: LeWDg2dhcVoAsaV1) with MCP path `NextcloudRead`
- Created **Nextcloud MCP - Create File** workflow (ID: wTpxuAw0LQGCLFyQ) with MCP path `NextcloudCreate`
- Created **Nextcloud MCP - Update File** workflow (ID: isG3Aqk7dDrE63hT) with MCP path `NextcloudUpdate`
- Created **Nextcloud MCP - Delete File** workflow (ID: uIBKnSTzMEKS1vL2) with MCP path `NextcloudDelete`

All workflows use the existing NextCloud account credentials (ID: Bm4WyKllrnkmqNYI) and have been configured as MCP server endpoints using the MCP Server Trigger node.

Also produced comprehensive documentation at `docs/cascade-notes/2025-09-18-nextcloud-mcp-workflows.md` with examples of how to use each MCP endpoint.

Next steps:
- Activate workflows in n8n
- Test the MCP endpoints from an AI system
- Consider adding authentication to the MCP endpoints if needed
