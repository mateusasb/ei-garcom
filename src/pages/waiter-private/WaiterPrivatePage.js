import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from "react-router-dom";
import ManagementPanel from '../../components/waiter-private/ManagementPanel';
import waiterList from '../../services/waiterList.json';

const WaiterPrivatePage = () => {
  const navigate = useNavigate()
  const { waiterSlug } = useParams()
  const [waiterId, setWaiterId] = useState(null)
  
  const waiterInfo = waiterList.find((key) => key.slug === waiterSlug)
  useEffect(() => {
    if (!waiterInfo) {
      setTimeout(() => {
        navigate('/')
      })
    }

    return() => {
      setWaiterId(waiterSlug);
    }
  }, [waiterInfo, waiterSlug, navigate])

  if(waiterInfo) {
    return (
      <>
        <h1>Página Privada - {waiterInfo.nome}</h1>
        {/* Componente de gerenciamento dos atendimentos */}
        <ManagementPanel />
      </>  
    );  
  }
  
};

export default WaiterPrivatePage;
