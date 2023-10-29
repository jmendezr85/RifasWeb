import React from "react";

const Modal = ({ title, message, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-1/3 p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
