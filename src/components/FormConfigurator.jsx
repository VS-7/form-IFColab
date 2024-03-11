import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import styles from './FormConfigurator.module.css'
import Sidebar from '../components/Sidebar';

const FormConfigurator = () => {
  const [newStep, setNewStep] = useState({ title: '', fields: [] });
  const [newField, setNewField] = useState({ label: '', type: 'text' });

  const handleAddField = () => {
    setNewStep((prevState) => ({
      ...prevState,
      fields: [...prevState.fields, newField]
    }));
    setNewField({ label: '', type: 'text' }); // Reset field input
  };

  const handleRemoveField = (indexToRemove) => {
    setNewStep((prevState) => ({
      ...prevState,
      fields: prevState.fields.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddStep = async () => {
    const docRef = doc(db, "formConfig", "configuration");
    const docSnap = await getDoc(docRef);
  
    let currentSteps = [];
  
    if (docSnap.exists()) {
      currentSteps = docSnap.data().steps || [];
    }
  
    const updatedSteps = [...currentSteps, newStep];
  
    await setDoc(docRef, { steps: updatedSteps });
  
    setNewStep({ title: '', fields: [] }); // Reset step input
  };

  return (
    <div>
      <Sidebar />
      <h2>Configuração do Formulário</h2>
      <input
        value={newStep.title}
        onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
        placeholder="Título da Etapa"
      />
      {newStep.fields.map((field, index) => (
        <div key={index}>
          <span>{field.label} ({field.type}) </span>
          <FiTrash2 onClick={() => handleRemoveField(index)} />
        </div>
      ))}
      <input
        value={newField.label}
        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        placeholder="Label do Campo"
      />
      <div className={styles.selectContainer}>
      <select
        className={styles.optionContainer}
        value={newField.type}
        onChange={(e) => setNewField({ ...newField, type: e.target.value })}
      >
        <option value="text">Texto</option>
        <option value="email">Email</option>
        <option value="number">Número</option>
      </select>
      <FiPlusCircle onClick={handleAddField} className={styles.btnForm}/>
      </div>
      <button onClick={handleAddStep} className={styles.btnForm}>Adicionar Etapa</button>
      
    </div>
  );
};

export default FormConfigurator;