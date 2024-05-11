import React, { useState } from 'react';
import AdminPanel from '../screens/AdminPanel';

function AdminView() {
  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);

  const handleVolver = () => {
    setMostrarFormularioCrear(false);
  };

  return (
    <div>
      {mostrarFormularioCrear ? (
        <AdminPanel onVolver={handleVolver} />
      ) : (
        <div>
          <h2>Panel de Administración</h2>
          <button onClick={() => setMostrarFormularioCrear(true)}>Crear Torneo</button>
        </div>
      )}
    </div>
  );
}

export default AdminView;
