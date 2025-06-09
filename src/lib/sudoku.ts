/**
 * Sudoku game logic
 * 
 * This module provides functionality for creating, validating, and solving Sudoku puzzles.
 */

// Type for a Sudoku board - a 9x9 grid where each cell can be a number 1-9 or null (empty)
export type SudokuBoard = (number | null)[][];

/**
 * Create an empty Sudoku board
 */
export function createEmptyBoard(): SudokuBoard {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}


// 生成一个完整的数独盘面
function generateFullSudoku(): SudokuBoard {
  const board: SudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(null));

  function isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  }

  function fillBoard(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            if (isValid(row, col, num)) {
              board[row][col] = num;
              if (fillBoard()) return true;
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillBoard();
  return board;
}

// 打乱数组
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 删除部分格子形成谜题（保留一定的数字）
function removeCells(board: SudokuBoard, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): SudokuBoard {
  const result: SudokuBoard = board.map(row => row.slice());
  let cellsToRemove = null;
  if (difficulty === 'easy') cellsToRemove = 30;
  else if (difficulty === 'medium') cellsToRemove = 45;
  else if (difficulty === 'hard') cellsToRemove = 55;

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (result[row][col] !== null) {
      result[row][col] = null;
      cellsToRemove--;
    }
  }
  return result;
}

// 主函数：生成一个带空格的随机数独盘面
export function createBoardFromString(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): SudokuBoard {
  const fullBoard = generateFullSudoku();
  return removeCells(fullBoard, difficulty);
}


/**
 * Check if a value is valid for a given cell
 */
export function isValidMove(board: SudokuBoard, row: number, col: number, value: number): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value) {
      return false;
    }
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === value) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === value) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Get all valid values for a given cell
 */
export function getValidValues(board: SudokuBoard, row: number, col: number): number[] {
  if (board[row][col] !== null) {
    return []; // Cell is already filled
  }
  
  const validValues = [];
  for (let value = 1; value <= 9; value++) {
    if (isValidMove(board, row, col, value)) {
      validValues.push(value);
    }
  }
  
  return validValues;
}

/**
 * Check if the board is valid (no conflicts)
 */
export function isValidBoard(board: SudokuBoard): boolean {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== null) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
  }
  
  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col];
      if (value !== null) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
  }
  
  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = boxRow * 3 + i;
          const col = boxCol * 3 + j;
          const value = board[row][col];
          if (value !== null) {
            if (seen.has(value)) {
              return false;
            }
            seen.add(value);
          }
        }
      }
    }
  }
  
  return true;
}

/**
 * Check if the board is complete (all cells filled and valid)
 */
export function isBoardComplete(board: SudokuBoard): boolean {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        return false;
      }
    }
  }
  
  // Check if the board is valid
  return isValidBoard(board);
}

/**
 * Convert a board to a string representation
 */
export function boardToString(board: SudokuBoard): string {
  return board.map(row => row.map(cell => cell === null ? ' ' : cell));
}