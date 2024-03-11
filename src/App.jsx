import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import useAuthentication from './hooks/useAuthentication'; // Ajuste o caminho conforme necessário
import MultiStepForm from './components/MultiStepForm';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/Home/AdminDashboard/AdminDashboard';
import FormConfigurator from './components/FormConfigurator';

function App() {
  const { user, login, loading } = useAuthentication();
  const [category, setCategory] = useState(null);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Carregando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          {!user ? (
            <Route path="/" element={<Login login={login} />} />
          ) : (
            <>
              <Route index element={
                <div>
                  <h2>Bem-vindo, {user.displayName}!</h2>
                  {category === null && (
                    // Aqui você pode adicionar seu seletor de categorias
                    // Exemplo: <CategorySelector onSelectCategory={setCategory} />
                    <p>Selecione sua categoria</p>
                  )}
                  <MultiStepForm user={user} category={category} />
                </div>
              }/>
              <Route path="/adminDashboard" element={<AdminDashboard />} />
              <Route path="/form-configurator" element={<FormConfigurator />} />
              {/* Adicione outras rotas protegidas aqui */}
            </>
          )}
          {/* Redirecionar para o login se nenhuma outra rota corresponder e o usuário não estiver logado */}
          <Route path="*" element={!user ? <Navigate to="/" /> : <Navigate to="/adminDashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
