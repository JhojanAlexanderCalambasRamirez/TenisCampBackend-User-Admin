import React, { useState } from "react";
import firebaseApp from "../firebase/credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Advertencias from "../components/Advertencias";

const auth = getAuth(firebaseApp);

function Login() {
  const firestore = getFirestore(firebaseApp);
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [advertencias, setAdvertencias] = useState({ rolIncorrecto: false, errorCredenciales: false, errorContraseña: false, camposIncompletos: false });
  const [feedback, setFeedback] = useState(""); // Nuevo estado para el feedback

  async function registrarUsuario(email, password, rol) {
    const infoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log(infoUsuario.user.uid);
    const docuRef = doc(firestore, `usuarios/${infoUsuario.user.uid}`);
    setDoc(docuRef, { correo: email, rol: rol });
  }

  async function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const rol = e.target.elements.rol ? e.target.elements.rol.value : null;

    if (!email || !password) { // Verifica si todos los campos están completos
      setFeedback("Por favor, complete todos los campos.");
      return;
    }

    if (rol && !["admin", "user"].includes(rol)) {
      setFeedback("Por favor, seleccione un rol válido.");
      return;
    }

    if (isRegistrando) {
      // registrar
      try {
        await registrarUsuario(email, password, rol);
        setFeedback("Usuario registrado exitosamente.");
      } catch (error) {
        console.error(error);
        setFeedback("Ocurrió un error al registrar el usuario.");
      }
    } else {
      // login
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setFeedback("Inicio de sesión exitoso.");
      } catch (error) {
        console.error(error);
        if (error.code === "auth/wrong-password") {
          setFeedback("La contraseña es incorrecta.");
        } else if (error.code === "auth/user-not-found") {
          setFeedback("El usuario no existe.");
        } else {
          setFeedback("Rectifica los datos, correo o contraseña.");
        }
      }
    }
  }

  return (
    <div>
      <h1>{isRegistrando ? "Regístrate" : "Inicia sesión"}</h1>

      {feedback && <p>{feedback}</p>} {/* Mostrar feedback si está definido */}

      <Advertencias {...advertencias} />

      <form onSubmit={submitHandler}>
        <label>
          Correo electrónico:
          <input type="email" id="email" />
        </label>

        <label>
          Contraseña:
          <input type="password" id="password" />
        </label>

        {isRegistrando && (
          <label>
            Rol:
            <select id="rol">
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </label>
        )}

        <input
          type="submit"
          value={isRegistrando ? "Registrar" : "Iniciar sesión"}
        />
      </form>

      <button onClick={() => setIsRegistrando(!isRegistrando)}>
        {isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"}
      </button>
    </div>
  );
}

export default Login;
