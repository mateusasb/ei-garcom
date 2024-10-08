import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from "react-router-dom";
import ManagementPanel from '../../components/waiter-private/ManagementPanel';
import { getUserBySlug } from '../../services/controller/userController';
import User from '../../services/models/UserClass';

const WaiterPrivatePage = () => {
  const navigate = useNavigate()
  const { waiterSlug } = useParams()
  const [waiterInfo, setWaiterInfo] = useState(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserBySlug(waiterSlug);
      if(!userData) {
        navigate('/')
      }
      return setWaiterInfo(userData);
    };
    
    fetchUser();
    
    
  }, [waiterSlug, navigate])

  const waiter = new User(waiterInfo)
  return (
    <>
      {waiter ? (
        <h1>{`${waiter.firstName} ${waiter.lastName}`}</h1>
      ) : (
        <h1>Carregando...</h1>
      )}
      {/* Componente de gerenciamento dos atendimentos */}
      <ManagementPanel />
    </>
  );
  
};

export default WaiterPrivatePage;
