import React, { useEffect, useState } from "react";
import Axios from "axios";
import Tarjeta from "./tarjeta";

const Inicio = ({ userName, token }) => {
  const [tarjetas, setTarjetas] = useState([]);

  const obtenerTarjetas = () => {
    const authToken = localStorage.getItem("authToken");
    const url = authToken
      ? "https://rifas-web-m9rx.vercel.app/tarjetas/autenticados"
      : "https://rifas-web-m9rx.vercel.app/tarjetas/no-autenticados";

    Axios.get(url)
      .then((response) => {
        console.log("Datos de tarjetas obtenidos:", response.data);
        console.log("Número de tarjetas:", response.data.length);
        setTarjetas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las tarjetas:", error);
      });
  };

  const handleDelete = (tarjetaId) => {
    Axios.delete(`https://rifas-web-m9rx.vercel.app/delete/${tarjetaId}`)
      .then(() => {
        obtenerTarjetas(); // Actualiza la lista de tarjetas después de eliminar
        console.log("Tarjeta eliminada con éxito");
      })
      .catch((error) => {
        console.error("Error al eliminar la tarjeta:", error);
      });
  };

  useEffect(() => {
    obtenerTarjetas();
  }, []);

  return (
    <div className="container mx-auto my-4 px-4">
      <h2 className="text-2xl font-semibold mb-4">Talonarios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tarjetas.map((tarjeta) => (
          <div key={tarjeta.id} className="w-full">
            <Tarjeta tarjeta={tarjeta} onDelete={() => handleDelete(tarjeta.id)} isAuthenticated={Boolean(token)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;
