// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// const transport = new StdioClientTransport({
//   command: "node",
//   args: ["server.js"]
// });

// const client = new Client(
//   {
//     name: "example-client",
//     version: "1.0.0"
//   }
// );

// await client.connect(transport);

// // List prompts
// const prompts = await client.listPrompts();

// // Get a prompt
// const prompt = await client.getPrompt({
//   name: "example-prompt",
//   arguments: {
//     arg1: "value"
//   }
// });

// // List resources
// const resources = await client.listResources();

// // Read a resource
// const resource = await client.readResource({
//   uri: "file:///example.txt"
// });

// // Call a tool
// const result = await client.callTool({
//   name: "example-tool",
//   arguments: {
//     arg1: "value"
//   }
// });

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
let client: Client|undefined = undefined
const baseUrl = new URL("http://40404.site:3001/sse");
// try {
//   client = new Client({
//     name: 'streamable-http-client',
//     version: '1.0.0'
//   });
//   const transport = new StreamableHTTPClientTransport(
//     new URL(baseUrl)
//   );
//   await client.connect(transport);
//   console.log("Connected using Streamable HTTP transport");
// } catch (error) {
//   // If that fails with a 4xx error, try the older SSE transport
//   console.log("Streamable HTTP connection failed, falling back to SSE transport");
  client = new Client({
    name: 'sse-client',
    version: '1.0.0'
  });
  const sseTransport = new SSEClientTransport(baseUrl);
  await client.connect(sseTransport);
  console.log("Connected using SSE transport");
// }