import React, { useState, useEffect } from 'react';
import { createBoardFromString, isValidMove, isBoardComplete, boardToString } from '../../lib/sudoku';
import type { SudokuBoard as SudokuBoardType } from '../../lib/sudoku';
import MCPClient from '../../lib/mcp/mcpClient';
import './SudokuBoard.css';

interface SudokuBoardProps {
  initialBoard?: SudokuBoardType;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ initialBoard }) => {
  const [board, setBoard] = useState<SudokuBoardType>(initialBoard || createBoardFromString());
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [mcpClient] = useState<MCPClient>(new MCPClient());
  // const [mcpResponse, setMcpResponse] = useState<string>('');
  const [mcpResponse, setMcpResponse] = useState<MCPClient.Response | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mcpPrompt, setMcpPrompt] = useState<string>('');

  // Check if the board is complete whenever it changes
  useEffect(() => {
    setIsComplete(isBoardComplete(board));
  }, [board]);

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    // If the cell is part of the initial board, don't allow selection
    if (initialBoard && initialBoard[row][col] !== null) {
      return;
    }
    
    setSelectedCell([row, col]);
  };

  // Handle number input
  const handleNumberInput = (value: number | null) => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    
    // Create a new board with the updated value
    const newBoard = board.map((r: (number | null)[]) => [...r]);
    
    // If the value is null or the move is valid, update the board
    if (value === null || isValidMove(board, row, col, value)) {
      newBoard[row][col] = value;
      setBoard(newBoard);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;
    
    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleNumberInput(null);
    }
  };

  // Get cell class name based on its state
  const getCellClassName = (row: number, col: number) => {
    let className = 'sudoku-cell';
    
    // Add border classes
    if (row % 3 === 0) className += ' border-top';
    if (row === 8) className += ' border-bottom';
    if (col % 3 === 0) className += ' border-left';
    if (col === 8) className += ' border-right';
    
    // Add selected class
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      className += ' selected';
    }
    
    // Add initial class for cells that were part of the initial board
    if (initialBoard && initialBoard[row][col] !== null) {
      className += ' initial';
    }
    
    return className;
  };

  // Handle MCP prompt submission
  const handleMcpPromptSubmit = async () => {
    if (!mcpPrompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await mcpClient.sendRequest({
        prompt: mcpPrompt,
        context: boardToString(board)
      });
      setMcpResponse(response.text);
    } catch (error) {
      console.error('Error sending MCP request:', error);
      setMcpResponse('发生错误，请重试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sudoku-container" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="sudoku-board">
        {board.map((row: (number | null)[], rowIndex: number) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell: number | null, colIndex: number) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClassName(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== null ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} onClick={() => handleNumberInput(num)}>
            {num}
          </button>
        ))}
        <button onClick={() => handleNumberInput(null)}>Clear</button>
      </div>
      
      {isComplete && (
        <div className="completion-message">
          恭喜！您已成功完成数独！
        </div>
      )}
      
      <div className="mcp-interface">
        <h3>MCP 大语言模型交互</h3>
        <p>使用自然语言请求大模型帮助填写特定行或列</p>
        <div className="mcp-input">
          <input
            type="text"
            value={mcpPrompt}
            onChange={(e) => setMcpPrompt(e.target.value)}
            placeholder="例如：帮我填写第1行"
            disabled={isLoading}
          />
          <button onClick={handleMcpPromptSubmit} disabled={isLoading}>
            {isLoading ? '处理中...' : '发送'}
          </button>
        </div>
        {mcpResponse && (
          <div className="mcp-response">
            <h4>模型回复：</h4>
            <p>{mcpResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SudokuBoard;
