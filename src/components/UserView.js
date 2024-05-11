import React from "react";

function UserView({ torneos, onRegistroTorneo }) {
  return (
    <div>
      <h2>Interfaz de Usuario</h2>
      <h3>Lista de Torneos Disponibles:</h3>
      <ul>
        {torneos.map(torneo => (
          <li key={torneo.id}>
            <div>Nombre: {torneo.nombre}</div>
            <div>Fecha límite de inscripción: {torneo.fechaLimite}</div>
            <div>Imagen: <img src={torneo.imagenURL} alt="Imagen del torneo" /></div>
            <div>Cantidad máxima de participantes: {torneo.maxParticipantes}</div>
            <div>Participantes registrados: {torneo.participantesRegistrados}</div>
            <button onClick={() => onRegistroTorneo(torneo.id)}>Registrarse</button>
          </li>
        ))}
      </ul>
      <h3>Torneos Registrados:</h3>
      {/* Aquí puedes mostrar los torneos a los que se ha inscrito el usuario */}
    </div>
  );
}

export default UserView;
