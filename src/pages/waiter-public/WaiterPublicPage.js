import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import WaiterPublicInterface from '../../components/waiter-public/WaiterPublicInterface';
import { getUserBySlug } from '../../services/controller/userController';
import { saveVisitorId } from '../../services/controller/visitorController';
import User from '../../services/models/UserClass';

const WaiterPublicPage = () => {
  const navigate = useNavigate()
  const { waiterSlug } = useParams()
  const [waiterInfo, setWaiterInfo] = useState(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserBySlug(waiterSlug);
      if(!userData) {
        navigate('/')
      }
      
      saveVisitorId()
      return setWaiterInfo(userData);
    };
    
    fetchUser();
    
  }, [waiterSlug, navigate])

  const waiter = new User(waiterInfo)
  return (
    <div>
      {/* Componente do perfil do garçom na versão pública */}
      <WaiterPublicInterface 
        waiterData = {{
          waiter_first_name: waiter.firstName,
          waiter_last_name: waiter.lastName,
          waiter_location: waiter.currentServiceLocation,
          waiter_slug: waiter.slug,
          waiter_pic_url: waiter.profilePictureUrl
        }}
      />
    </div>
  );
  
};

export default WaiterPublicPage;
