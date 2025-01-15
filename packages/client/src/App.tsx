import './App.css';
import { Room } from '@components/Room';
import { Header } from '@components/Header';
import { Welcome } from '@components/Welcome';
import { useRoomStore } from '@stores/useRoomStore';
import { RoomAccess } from '@lgs-timer/types';

function App() {
  const mode = useRoomStore((state) => state.mode);

  return (
    <div className="app">
      <div className="app-header">
        <Header />
      </div>
      <div className="app-content">{mode === RoomAccess.NONE ? <Welcome /> : <Room />}</div>
    </div>
  );
}

export default App;
