import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function Home({ user }) {
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const torneosCollection = collection(firestore, 'torneos');
        const torneosSnapshot = await getDocs(torneosCollection);
        const torneosData = torneosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(torneosData);
      } catch (error) {
        console.error('Error al obtener los torneos:', error);
      }
    };

    fetchTorneos();
  }, []);

  const handleRegistroTorneo = async (torneoId) => {
    try {
      // Actualizar el contador de participantes registrados en el torneo
      const torneoRef = doc(firestore, 'torneos', torneoId);
      await updateDoc(torneoRef, {
        participantesRegistrados: firebase.firestore.FieldValue.increment(1)
      });
      console.log(`Usuario ${user.uid} registrado en el torneo ${torneoId}`);
      // Mostrar una notificación de registro exitoso
      alert('¡Te has registrado en el torneo exitosamente!');
      // Actualizar la lista de torneos después del registro
      const torneosActualizados = torneos.map(torneo => {
        if (torneo.id === torneoId) {
          return { ...torneo, participantesRegistrados: torneo.participantesRegistrados + 1 };
        }
        return torneo;
      });
      setTorneos(torneosActualizados);
    } catch (error) {
      console.error('Error al registrar al usuario en el torneo:', error);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => signOut(auth)}>Cerrar sesión</button>
      {user.rol === 'admin' ? <AdminView /> : <UserView torneos={torneos} onRegistroTorneo={handleRegistroTorneo} />}
    </div>
  );
}

export default Home;
