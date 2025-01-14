import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CsvUtils from './pages/CsvUtils';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/csv-utils" element={<CsvUtils />} />
      </Routes>
    </Router>
  );
}

export default App;