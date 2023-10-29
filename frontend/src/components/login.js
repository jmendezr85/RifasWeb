import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleContrasenaChange = (event) => {
    setContrasena(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        nombre: nombre,
        contrasena: contrasena,
      });

      const { data } = response;
      console.log("Datos devueltos desde el servidor:", data); // Imprimir la respuesta del servidor en la consola
      if (data.token) {
        localStorage.setItem("authToken", JSON.stringify(data.token));
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        onLogin(data.token, data.nombre);
        console.log("este es el usuario",data.nombre, "y este el token",data.token);
        setNombre("");
        setContrasena("");
        setError(null);
      } else {
        setError("Nombre de usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Nombre de usuario o contraseña incorrectos");
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Iniciar Sesión
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="text-gray-600">
              Nombre de Usuario:
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={handleNombreChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="contrasena" className="text-gray-600">
              Contraseña:
            </label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={handleContrasenaChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
