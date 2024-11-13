import React from 'react';
import { useLocation, useOutletContext } from "react-router-dom";
import ManagementPanel from '../../components/waiter-private/ManagementPanel';

const WaiterPrivatePage = () => {
  const { userData } = useOutletContext();

  return (
    <div>
      <ManagementPanel />
    </div>
  );
};

export default WaiterPrivatePage;
