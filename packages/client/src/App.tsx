import { TimerGrid } from '@components/TimerGrid';
import { Header } from '@components/Header';
import { Welcome } from '@components/Welcome';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app-header">
        <Header />
      </div>
      <div className="app-content">
        <Welcome />
        <TimerGrid />
      </div>
    </div>
  );
}

export default App;
