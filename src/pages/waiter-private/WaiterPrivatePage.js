import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import ManagementPanel from '../../components/waiter-private/ManagementPanel';
import { getUserBySlug } from '../../services/controller/userController';
import User from '../../services/models/UserClass';
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth';

const WaiterPrivatePage = () => {
  const navigate = useNavigate();
  const { waiterSlug } = useParams();
  
  const [waiterInfo, setWaiterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login')
      }

    });

    if (!waiterSlug) {
      setError('Slug de garçom inválido.');
      setLoading(false);
      return;
    };

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const userData = await getUserBySlug(waiterSlug);
        if (!userData) {
          navigate('/not-found');
        } else {
          setWaiterInfo(userData);
        }

      } catch(err) {
        setError('Erro ao carregar os dados do garçom.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [waiterSlug, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  const waiter = new User(waiterInfo);

  const handleLogout = async () => {
    if(auth.currentUser) {
      try {
        await auth.signOut();
        console.log("Usuário deslogado com sucesso!");
      } catch(error) {
        console.error('Erro ao deslogar', error)
      }

    };
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>{`${waiter.firstName} ${waiter.lastName}`}</h1>
      <ManagementPanel />
    </div>
  );
};

// Componente de tela de carregamento
const LoadingScreen = () => (
  <div>
    <h1>Carregando...</h1>
  </div>
);

// Componente de tela de erro
const ErrorScreen = ({ message }) => (
  <div>
    <h1>Erro: {message}</h1>
  </div>
);


export default WaiterPrivatePage;
