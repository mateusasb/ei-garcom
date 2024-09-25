import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from "react-router-dom";
import WaiterProfile from '../../components/waiter-public/WaiterProfile';
import waiterList from '../../services/waiterList.json';

const WaiterPublicPage = () => {
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
      <div>
        <h1>Página Pública do Garçom</h1>
        {/* Componente do perfil do garçom na versão pública */}
        <WaiterProfile />
      </div>  
    );  
  }
  
};

export default WaiterPublicPage;
