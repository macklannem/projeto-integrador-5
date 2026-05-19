/**
 * PERCHÉ: Componente di navigazione principale dell'applicazione.
 *         Permette all'utente di navigare tra le 3 pagine del sistema.
 * UTILIZZO: Renderizzato in App.jsx come header persistente.
 * DIPENDENZE: react-router-dom (NavLink).
 */

import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">📦</span>
        <h1 className="navbar-title">Controle de Estoque</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Produtos
          </NavLink>
        </li>
        <li>
          <NavLink to="/fornecedores" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Fornecedores
          </NavLink>
        </li>
        <li>
          <NavLink to="/associacao" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Associação
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
