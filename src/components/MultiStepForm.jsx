import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from './MultiStepForm.module.css'
import { FaStar, FaMedal, FaUserGraduate } from 'react-icons/fa';
import { FiArrowRightCircle, FiArrowLeftCircle, FiCheckCircle } from "react-icons/fi";


// Componente de Card com Barra de Progresso na Borda
const ProgressCard = ({ step, totalSteps, userPhoto, userCategory }) => {
    const progressPercentage = ((step / totalSteps) * 100).toFixed(2);
  
    return (
      <div style={{
          position: 'relative',
          margin: '80px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none', // Cor da borda base
          borderRadius: '8px',
          backgroundColor: '#fff', // Cor de fundo do card
        }}>
        {/* Elemento para o progresso da borda */}
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            borderRadius: '5px',
            border: '2px solid black', // Cor da borda de progresso
            clipPath: `polygon(0 0, ${progressPercentage}% 0, ${progressPercentage}% 100%, 0% 100%)`, // Recorta a borda de progresso
          }} />
        <img src={userPhoto} alt="User" style={{ borderRadius: '50%', width: '80px', height: '80px', zIndex: 1 }} />
        <span style={{ marginTop: '10px', zIndex: 1 }}>{userCategory}</span>
      </div>
    );
  };

  function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formSteps, setFormSteps] = useState([]);
    const [formData, setFormData] = useState({});
    const [userId, setUserId] = useState(null);
    const [userPhoto, setUserPhoto] = useState('');
    const [userCategory, setUserCategory] = useState('');
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, user => {
        if (user) {
          setUserId(user.uid);
          setUserPhoto(user.photoURL);
        } else {
          setUserId(null);
          setUserPhoto('');
          setUserCategory('');
          setIsCategorySelected(false);
        }
      });
      const fetchFormConfig = async () => {
        const docRef = doc(db, "formConfig", "configuration");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormSteps(docSnap.data().steps);
          // Inicializa formData com chaves vazias para cada campo
          const initialFormData = {};
          docSnap.data().steps.forEach(step => {
            step.fields.forEach(field => {
              initialFormData[field.label] = '';
            });
          });
          setFormData(initialFormData);
        } else {
          console.log("No form config found!");
        }
      };
      fetchFormConfig();
    }, []);
  
    const handleCategorySelection = (category) => {
      setUserCategory(category);
      setIsCategorySelected(true);
    };

  if (!userId) {
    return <div>Por favor, faça login para continuar.</div>;
  }

  if (!isCategorySelected) {
    return (
        <div>
            <h2>Escolha sua categoria:</h2>
            <button onClick={() => handleCategorySelection('Iniciante')} className={styles.btnCategory}>
                <div className={styles.btnContainer}>
                    <FaUserGraduate className={styles.icon}/> {/* Ícone para Iniciante */}
                    <div>
                        <strong>Iniciante</strong>
                        <p>Você é novo na programação ou tem menos de um ano de experiência.</p>
                    </div>
                </div>
            </button>
            <button onClick={() => handleCategorySelection('Sei alguma coisa')} className={styles.btnCategory}>
                <div className={styles.btnContainer}>
                    <FaMedal className={styles.icon}/> {/* Ícone para Moderado */}
                    <div>
                        <strong>Moderado</strong>
                        <p>Você tem experiência básica e compreende conceitos fundamentais.</p>
                    </div>
                </div>
            </button>
            <button onClick={() => handleCategorySelection('Sou experiente')} className={styles.btnCategory}>
                <div className={styles.btnContainer}>
                    <FaStar className={styles.icon}/> {/* Ícone para Experiente */}
                    <div>
                        <strong>Experiente</strong>
                        <p>Você tem vários anos de experiência e dominou várias tecnologias.</p>
                    </div>
                </div>
            </button>
        </div>
    );
  }
  
    const updateField = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (error) setError('');
    };
  
    const validateCurrentStep = () => {
      const currentFields = formSteps[currentStep]?.fields || [];
      for (let field of currentFields) {
        if (!formData[field.label]) {
          setError(`Por favor, preencha o campo ${field.label}.`);
          return false;
        }
      }
      return true;
    };
  
    const handleNext = (e) => {
      e.preventDefault();
      if (validateCurrentStep()) {
        setCurrentStep(prev => prev + 1);
      }
    };
  
    const handleBack = (e) => {
      e.preventDefault();
      setCurrentStep(prev => prev - 1);
      setError('');
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!userId) {
        setError('Erro: Usuário não está logado.');
        return;
      }
      if (validateCurrentStep()) {
        try {
          await addDoc(collection(db, 'submissions'), {
            ...formData,
            userId,
          });
          alert('Formulário enviado com sucesso!');
        } catch (error) {
          console.error('Erro ao enviar o formulário: ', error);
          setError('Erro ao enviar o formulário.');
        }
      }
    };
  
    const renderFormFields = () => {
      const currentFields = formSteps[currentStep]?.fields || [];
      return currentFields.map(field => (
        <div key={field.label}>
          <label>
            {field.label}
            <input
              type={field.type}
              placeholder={field.label}
              value={formData[field.label] || ''}
              onChange={(e) => updateField(field.label, e.target.value)}
            />
          </label>
        </div>
      ));
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
          <ProgressCard
            step={currentStep + 1}
            totalSteps={formSteps.length}
            userPhoto={userPhoto}
            userCategory={userCategory}
          />
          <div className={styles.formStep}>
            <h2>{formSteps[currentStep]?.title || 'Título da Etapa'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={styles.fields}>
              {renderFormFields()}
            </div>
          </div>
          <div className={styles.btnForm}>
            {currentStep > 0 && (
              <button type="button" onClick={handleBack} className={styles.btnContainerForm}>
                <FiArrowLeftCircle style={{ marginRight: '5px' }}/> Voltar
              </button>
            )}
            {currentStep < formSteps.length - 1 ? (
              <button type="button" onClick={handleNext} className={styles.btnContainerForm}>
                Próximo <FiArrowRightCircle style={{ marginLeft: '5px' }}/>
              </button>
            ) : (
              <button type="submit" className={styles.btnContainerForm}>
                Enviar <FiCheckCircle style={{ marginLeft: '5px' }}/>
              </button>
            )}
          </div>
        </form>
      );
}

export default MultiStepForm;
