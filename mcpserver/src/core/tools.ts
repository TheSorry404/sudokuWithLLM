import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import OpenAI from "openai";
import { generate, solve } from "sudoku-core"; // Assuming you have a Sudoku solver function

/**
 * Register all tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  server.addTool({
    name: "request_llm",
    description: "A simple hello world tool",
    parameters: z.object({
      prompt: z.string().describe("Prompt to send to the LLM"),
      context: z.array(z.array(z.union([z.number().min(1).max(9), z.string().regex(/^\s$/)]).describe("Cell value: number 1-9 or space string for empty")).length(9)).length(9).describe("9x9 Sudoku board with numbers 1-9 or space strings for empty cells").optional(),
    }),
    execute: async (params) => {
      const openai = new OpenAI(
          {
              // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
              apiKey: process.env.DASHSCOPE_API_KEY,
              baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
          }
      );

      // Convert the 2D array to a string format for the LLM
      const boardString = params.context ? params.context.map(row => 
        row.map(cell => typeof cell === 'string' ? ' ' : cell.toString()).join(',')
      ).join('\n') : '';
      
      console.log("Received Sudoku Board:", boardString);

      async function main() {
        
          const completion = await openai.chat.completions.create({
              model: "qwen3-235b-a22b",
              messages: [
                  { role: "system",
                    content:"你是一个数独大师，现在用户遇到了数独问题需要你帮助解决。请根据提示和未完成的数独谜题来给出答案。你的答案应该是一个满足数独谜题需求的、符合空白位数要求的用逗号隔开的数独答案的数字串，有答案的情况下不可以输出中文，只可以输出符合规定的数字答案。如果要输出多行，注意使用“\n”换行符，并且不要在最后重新输出“答案”部分，只要输出的行和列。"
                  },
                    { role: "user", content: params.prompt + (boardString ? '\n' + boardString : '') }
              ],
              enable_thinking: false,
          });
          console.log(completion.choices[0].message.content);
          
          return {
            content: [{ type: "text", text: completion.choices[0].message.content }]
            // status: 'success'
          };
      }

      return await main();
    }
  });
}