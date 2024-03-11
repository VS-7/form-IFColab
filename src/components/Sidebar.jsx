import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Ajuste o caminho conforme necessário
import { FiMap } from "react-icons/fi";
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={styles.menuButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav>
          <ul>
            <li>
              <NavLink to="/adminDashboard" activeClassName={styles.active}>
             Dashboard <FiMap /> 
              </NavLink>
            </li>
            <li>
              <NavLink to="/form-configurator" activeClassName={styles.active}>
                Criar formulário
              </NavLink>
            </li>
            <li>
              <NavLink to="/form-configurator" activeClassName={styles.active}>
                Formulário
              </NavLink>
            </li>
            <li>
              <NavLink to="/form-configurator" activeClassName={styles.active}>
                Criar formulário
              </NavLink>
            </li>
            <li>
              <NavLink to="/someOtherAdminPage" activeClassName={styles.active}>
                Outra Página
              </NavLink>
            </li>
           
          </ul>

        </nav>

      </div>
    </>
  );
};

export default Sidebar;