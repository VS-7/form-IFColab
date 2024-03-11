import React from 'react';
import styles from './Navbar.module.css'; // Supondo que você terá um arquivo CSS separado para a navbar

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_container}>
        <a href="/" className={styles.navbar_logo}>
         ifcolab.online
        </a>
         PET - Conexões Ciência da Computação
        {/* Adicione links adicionais ou elementos da navbar conforme necessário */}
        
      </div>
    </nav>
  );
};

export default Navbar;