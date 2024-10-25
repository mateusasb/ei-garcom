import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from "react-router-dom";
import ManagementPanel from '../../components/waiter-private/ManagementPanel';
import { auth } from '../../firebase';

const WaiterPrivatePage = () => {
  const { userData } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if(!auth.currentUser) {
      navigate('/sem-permissao')
    }

    if(!userData) {
      setTimeout(() => {
        console.error('Timeout: usuário não encontrado')
        navigate('/login')
      }, 20000)

    } else {
      setLoading(false)
    }

  }, [userData, navigate])

  if (loading) {
    return <LoadingScreen loading={loading}/>;
  }

  return (
    <div>
      <h1>{`${userData.first_name} ${userData.last_name}`}</h1>
      <ManagementPanel />
    </div>
  );
};

// Componente de tela de carregamento
const LoadingScreen = ( {loading} ) => (
  <div>
    {loading && <div className="loader-container"><div className="loader"/></div>}
  </div>
);

export default WaiterPrivatePage;
