import React, { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";

const Boletas = () => {
  const { talonarioId } = useParams();
  const [boletas, setBoletas] = useState([]);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [estadoEditado, setEstadoEditado] = useState("Disponible");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroNombre, setFiltroNombre] = useState("");

  const obtenerBoletas = useCallback(() => {
    Axios.get(`http://localhost:3001/boletas/${talonarioId}`)
      .then((response) => {
        setBoletas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las boletas:", error);
      });
  }, [talonarioId]);

  useEffect(() => {
    obtenerBoletas();
  }, [talonarioId, obtenerBoletas]);

  const mostrarModal = (boleta) => {
    setBoletaSeleccionada(boleta);
    setNombreEditado(boleta.nombre);
    setEstadoEditado(boleta.estado);
  };

  const actualizarBoleta = () => {
    const boletaId = boletaSeleccionada.id;
    Axios.put(`http://localhost:3001/boletas/${boletaId}`, {
      nombre: nombreEditado,
      estado: estadoEditado,
    })
      .then(() => {
        alert("Boleta actualizada con éxito");
        obtenerBoletas();
        setBoletaSeleccionada(null);
      })
      .catch((error) => {
        console.error("Error al actualizar la boleta:", error);
      });
  };

  const filtrarBoletas = () => {
    let boletasFiltradas = boletas;

    if (filtroEstado !== "Todos") {
      boletasFiltradas = boletasFiltradas.filter(
        (boleta) => boleta.estado === filtroEstado
      );
    }

    if (filtroNombre !== "") {
      boletasFiltradas = boletasFiltradas.filter((boleta) =>
        boleta.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    return boletasFiltradas;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg md:text-2xl font-semibold mb-4">Boletas</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
          Filtro por Estado:
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded text-sm md:text-base"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="Reservada">Reservada</option>
          <option value="Pagada">Pagada</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
          Buscar por Nombre:
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded text-sm md:text-base"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {filtrarBoletas().map((boleta) => (
          <div
            key={boleta.id}
            className={`${
              boleta.estado === "Disponible"
                ? "bg-blue-500 text-white"
                : boleta.estado === "Reservada"
                ? "bg-orange-500"
                : boleta.estado === "Pagada"
                ? "bg-green-500 text-white"
                : ""
            } p-4 rounded-lg cursor-pointer col-span-1`}
            onClick={() => mostrarModal(boleta)}
          >
            <div className="mb-2 text-xs md:text-sm overflow-hidden">{`Boleta: ${boleta.numeroBoleta}`}</div>
            <div className="mb-2 text-sm md:text-base overflow-hidden">{`Nombre: ${boleta.nombre}`}</div>
            <div className="text-xs md:text-sm overflow-hidden">{`Estado: ${boleta.estado}`}</div>
          </div>
        ))}
      </div>
      {boletaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Editar Boleta #{boletaSeleccionada.numeroBoleta}
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                  Nombre:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-sm md:text-base"
                  value={nombreEditado}
                  onChange={(e) => setNombreEditado(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                  Estado:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-sm md:text-base"
                  value={estadoEditado}
                  onChange={(e) => setEstadoEditado(e.target.value)}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Reservada">Reservada</option>
                  <option value="Pagada">Pagada</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-2 py-1 rounded mr-2"
                  onClick={actualizarBoleta}
                >
                  Guardar
                </button>
                <button
                  className="bg-gray-400 text-white font-semibold px-2 py-1 rounded"
                  onClick={() => setBoletaSeleccionada(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boletas;
