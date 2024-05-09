import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase/credenciales';

const firestore = getFirestore(firebaseApp);
const auth = getAuth();

function AdminPanel() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const torneosCollection = collection(firestore, 'torneos');
        const torneosSnapshot = await getDocs(torneosCollection);
        const torneosData = torneosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(torneosData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los torneos:', error);
      }
    };

    fetchData();
  }, []);

  const handleCrearTorneo = async () => {
    try {
      const nuevoTorneo = {
        nombre: 'Nuevo Torneo',
        fechaLimite: '2024-12-31', // Cambia según tu formato de fecha
        imagenUrl: '',
        maxParticipantes: 0,
        participantesRegistrados: 0
      };

      const docRef = await addDoc(collection(firestore, 'torneos'), nuevoTorneo);
      setTorneos(prevTorneos => [...prevTorneos, { id: docRef.id, ...nuevoTorneo }]);
    } catch (error) {
      console.error('Error al crear el torneo:', error);
    }
  };

  const handleEliminarTorneo = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'torneos', id));
      setTorneos(prevTorneos => prevTorneos.filter(torneo => torneo.id !== id));
    } catch (error) {
      console.error('Error al eliminar el torneo:', error);
    }
  };

  // Otras funciones para actualizar y eliminar torneos

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      <button onClick={handleCrearTorneo}>Crear Nuevo Torneo</button>
      <h2>Torneos</h2>
      <ul>
        {torneos.map(torneo => (
          <li key={torneo.id}>
            <h3>{torneo.nombre}</h3>
            <p>Fecha límite de inscripción: {torneo.fechaLimite}</p>
            <p>Cantidad máxima de participantes: {torneo.maxParticipantes}</p>
            <p>Participantes registrados: {torneo.participantesRegistrados}</p>
            <img src={torneo.imagenUrl} alt={torneo.nombre} />
            <button onClick={() => handleEliminarTorneo(torneo.id)}>Eliminar</button>
            {/* Agrega botones y lógica para actualizar torneos */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;


