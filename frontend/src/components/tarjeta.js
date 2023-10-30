import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Tarjeta = ({ tarjeta, onDelete, isAuthenticated }) => {
  const baseUrl = "https://rifas-web-m9rx.vercel.app/uploads/";
  const imagenUrl = `${baseUrl}${tarjeta.imagen}`;
  const formattedDate = format(new Date(tarjeta.fecha), "dd/MM/yyyy");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div>
          <img
            className="object-cover rounded-t-lg w-full h-56"
            src={imagenUrl}
            alt={tarjeta.rifaDe}
          />
        </div>
        {showDeleteConfirmation && (
          <div className="bg-white p-4 rounded-lg mt-4">
            <p className="mb-2">¿Estás seguro de que quieres eliminar esta tarjeta?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded"
                onClick={confirmDelete}
              >
                Sí
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-2 rounded"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
        <div className="p-4">
          <h5 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">{tarjeta.rifaDe}</h5>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Fecha: {formattedDate}</p>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Vendedor: {tarjeta.vendedor}</p>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Valor de Boleta: {tarjeta.valorBoleta}</p>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">No. de Boletas: {tarjeta.noBoletas}</p>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Lotería: {tarjeta.loteria}</p>
          {isAuthenticated && (
            <div className="flex space-x-4 mt-4">
              <button
                className="bg-red-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Eliminar
              </button>
              <Link
                to={`/boletas/${tarjeta.id}`}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded"
              >
                Boletas
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tarjeta;
