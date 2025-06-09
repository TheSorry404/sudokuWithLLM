# Sudoku With LLM & MCP
## What does this do?

It's a simple sudoku game developed for the system theory course's bonus project which was required to combine MCP and LLM into it for assists.

This whole project was created and laid the foundation of the logic and front-end UI by the Manus agent, using React AND Vue for better implement. You could easily find that there're some functions may never used but not being removed. These functions were mostly used by the Manus for a local demo and had been replaced with active MCP modules.

## What did this use?

React, Vue, Typescript, Tailwind, etc.

Also a template of MCP server, which has a repo in GitHub here https://github.com/mcpdotdirect/template-mcp-server

Inside them, the MCP part this server template chose FastMCP as this project used official MCP SDK.

## How to Use?

1. Clone this repo
2. Run a terminal/bash and jump into the root directory, run `npm install --force` as the Manus may made something wrong.
3. As I used Qwen China API, you may need to add an API-key global variable. You can visit the Qwen, Aliyun China web in need.
4. Clone the MCP server template repo, install it, install the `bun` script executer and start the HTTP server `npm install && npm run start:http`.
5. Copy the `tools.ts` in the `mcpserver/src/core` into the server's `/src/core/` directory and replace the original one.
6. Start this project with `npm run dev`, keep it hang on, and play the sudoku now!
