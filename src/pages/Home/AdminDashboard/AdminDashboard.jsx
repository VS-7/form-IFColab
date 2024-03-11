import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, getDocs } from 'firebase/firestore';
import styles from './AdminDashboard.module.css'; // Supondo que você tenha um arquivo CSS para estilização
import Sidebar from '../../../components/Sidebar';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissionsRef = collection(db, 'submissions');
      const q = query(submissionsRef);
      const querySnapshot = await getDocs(q);
      const submissionsData = [];
      querySnapshot.forEach((doc) => {
        submissionsData.push({ id: doc.id, ...doc.data() });
      });
      setSubmissions(submissionsData);
    };

    fetchSubmissions();
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  // Agrupa submissões por userId para criar a lista de usuários
  const userSubmissions = submissions.reduce((acc, curr) => {
    if (acc[curr.userId]) {
      acc[curr.userId].push(curr);
    } else {
      acc[curr.userId] = [curr];
    }
    return acc;
  }, {});

  return (
    <div className={styles.adminDashboard}>
         <Sidebar />
     <h2>Dashboard</h2>
      <div className={styles.userList}>
        <h4>Usuários</h4>
        <ul>
          {Object.keys(userSubmissions).map((userId) => (
            <li key={userId}>
              {/* Assume-se que o primeiro elemento contenha o nome para simplificar */}
              <button onClick={() => handleUserSelect(userId)} className={styles.btnList}>
                Nome: {userSubmissions[userId][0].name || "Usuário Desconhecido"} {/* Mudança para 'name' */}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div className={styles.userSubmissions}>
          {/* Mudança para 'name' */}
          <h4>Respostas do Usuário: {userSubmissions[selectedUser][0].name}</h4>
          {userSubmissions[selectedUser].map((submission, index) => (
            <div key={index} className={styles.submission}>
              <ul className={styles.cardDetail}>
                {/* Itera sobre as chaves dos objetos de submissão para exibir os dados */}
                {Object.keys(submission).map((key) => {
                  if (key !== 'id' && key !== 'userId') { // Exclui campos que não deseja exibir
                    return <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {submission[key]}</li>;
                  }
                  return null;
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
