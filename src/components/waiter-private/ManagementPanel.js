import React from 'react';
import { socket } from '../../socket'

const ManagementPanel = () => {
  console.log(socket);

  return (
    <div>
      <h2>Painel de Gerenciamento</h2>
      {/* Aqui virão os atendimentos em curso */}
      <p>Cliente: João - Mesa 5</p>
      <button>Finalizar Atendimento</button>
    </div>
  );
};

export default ManagementPanel;
