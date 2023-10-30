import React, { useState } from "react";
import axios from "axios"; // Importa Axios

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleContrasenaChange = (event) => {
    setContrasena(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Envia los datos al servidor
    axios
      .post("https://rifas-web-m9rx.vercel.app//registro", {
        nombre: nombre,
        contrasena: contrasena,
      })
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        setMostrarModal(true);

        // Restablece el formulario y cierra el modal después de 1 segundo
        setTimeout(() => {
          setNombre("");
          setContrasena("");
          setMostrarModal(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });
  };

  return (
    <div className="bg-gray-100  flex items-center justify-center pt-8">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Registro
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="text-gray-600">
              Nombre:
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
              Registrarse
            </button>
          </div>
        </form>
      </div>
      {mostrarModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-green-500 text-center font-semibold">
              Registro exitoso. ¡Bienvenido!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro;
