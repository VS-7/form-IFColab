import React, { useState } from 'react';
import CategorySelector from '../../components/CategorySelector'; // Ajuste o caminho conforme necessário
import MultiStepForm from '../../components/MultiStepForm'; // Ajuste o caminho conforme necessário

function Home() {
  const [userCategory, setUserCategory] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Aqui você integraria com seu estado de login real

  const handleCategorySelected = (category) => {
    setUserCategory(category);
  };

  if (!isLoggedIn) {
    return <p>Por favor, faça login para continuar.</p>;
  }

  return (
    <div>
      {!userCategory ? (
        <CategorySelector onCategorySelected={handleCategorySelected} />
      ) : (
        <MultiStepForm userCategory={userCategory} />
      )}
    </div>
  );
}

export default Home;