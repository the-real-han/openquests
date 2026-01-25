import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Location from './pages/Location';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:id" element={<Location />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
