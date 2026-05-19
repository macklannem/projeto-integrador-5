/**
 * PERCHÉ: Componente radice dell'applicazione React.
 *         Configura il routing tra le pagine e il layout principale.
 * UTILIZZO: Renderizzato da main.jsx come componente principale.
 * DIPENDENZE: react-router-dom, components/Navbar, pages/*.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Produtos from './pages/Produtos';
import Fornecedores from './pages/Fornecedores';
import Associacao from './pages/Associacao';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/produtos" replace />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/associacao" element={<Associacao />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
