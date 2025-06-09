import './App.css';
import SudokuBoard from './components/Sudoku/SudokuBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>数独游戏 - MCP交互</h1>
        <p>使用MCP协议与大语言模型交互，获取行/列填写帮助</p>
      </header>
      <main>
        <SudokuBoard />
      </main>
      <footer>
        <p>基于React和MCP协议实现</p>
      </footer>
    </div>
  );
}

export default App;
