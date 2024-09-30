import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from "react-router-dom";
import WaiterProfile from '../../components/waiter-public/WaiterProfile';
import { getUserBySlug } from '../../services/controller/userController';
import User from '../../services/models/UserClass';

const WaiterPublicPage = () => {
  const navigate = useNavigate()
  const { waiterSlug } = useParams()
  const [waiterInfo, setWaiterInfo] = useState(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserBySlug(waiterSlug);
      if(!userData) {
        setTimeout(() => {
          navigate('/')
        })
      }
      return setWaiterInfo(userData);
    };
    
    fetchUser();
    
    
  }, [waiterSlug, navigate])

  const waiter = new User(waiterInfo)
  return (
    <>
      {waiter ? (
        <h1>Página Pública - {waiter.firstName}</h1>
      ) : (
        <h1>Carregando...</h1>
      )}
      {/* Componente do perfil do garçom na versão pública */}
      <WaiterProfile />
    </>
  );
  
};

export default WaiterPublicPage;
