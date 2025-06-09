/**
 * MCP (Model Context Protocol) Client
 * 
 * This module provides functionality to interact with large language models
 * using the Model Context Protocol.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { string } from "zod";

interface MCPRequest {
  prompt: string;
  context?: string;
  options?: {
    temperature?: number;
    max_tokens?: number;
  };
}

interface MCPResponse {
  text: string;
  status: 'success' | 'error';
  error?: string;
}

let client: Client|undefined = undefined
const baseUrl = new URL("http://40404.site:3001/sse");
client = new Client({
    name: 'sse-client',
    version: '1.0.0'
  });
  const sseTransport = new SSEClientTransport(baseUrl);
  await client.connect(sseTransport);
console.log("Connected using SSE transport");

class MCPClient {
  async sendRequest(request: MCPRequest): Promise<MCPResponse> {
    console.log('Sending MCP request:', request);
    const result = await client.callTool({
      name: "request_llm",
      arguments: {
        prompt: request.prompt,
        context: request.context || '',
      }
    });

    console.log('Status:', result);

    if (1) {
      result.content?.[0]?.text?.replace(/\\n/g, '\n')
      return {
        text: result.content?.[0]?.text || '',
        status: 'success'
      };
    } else {
      return {
        text: '',
        status: 'error',
        error: result.error || 'Unknown error'
      };
    }
  }
  
  /**
   * Send a Sudoku-specific request to get help filling a row or column
   */
  async getSudokuHelp(board: (number | null)[][], rowOrCol: 'row' | 'column', index: number): Promise<number[]> {
    // Convert the board to a string representation for the context
    const boardString = board.map(row => 
      row.map(cell => cell === null ? '0' : cell).join(', ')
    ).join('\n');
    
    const prompt = `帮我填写数独中第${index + 1}${rowOrCol === 'row' ? '行' : '列'}。`;
    
    const response = await this.sendRequest({
      prompt,
      context: boardString,
      options: {
        temperature: 0.2,
        max_tokens: 100
      }
    });
    
    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to get Sudoku help');
    }
    
    // Parse the response to extract numbers
    // This is a simplified implementation - in reality, you'd need more robust parsing
    const numbers = response.text.match(/\d+/g)?.map(Number) || [];
    return numbers.filter(n => n >= 1 && n <= 9);
  }

}

export default MCPClient;
