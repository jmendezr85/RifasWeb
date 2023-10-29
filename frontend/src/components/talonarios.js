import React, { useState, } from "react";
import Axios from "axios";

const Talonarios = () => {
  const [rifaDe, setRifaDe] = useState("");
  const [fecha, setFecha] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [valorBoleta, setValorBoleta] = useState("0");
  const [noBoletas, setNoBoletas] = useState("0");
  const [loteria, setLoteria] = useState("");
  const [imagen, setImagenPath] = useState("null");



   // Obtener el token almacenado en el almacenamiento local cuando el componente se mont
  
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImagenPath(selectedImage);
  };

  const resetForm = () => {
    setRifaDe("");
    setFecha("");
    setVendedor("");
    setValorBoleta("0");
    setNoBoletas("0");
    setLoteria("");
    setImagenPath("null");
  };

  const add = () => {
    const formData = new FormData();
    formData.append("rifaDe", rifaDe);
    formData.append("fecha", fecha);
    formData.append("vendedor", vendedor);
    formData.append("valorBoleta", valorBoleta);
    formData.append("noBoletas", noBoletas);
    formData.append("loteria", loteria);
    formData.append("imagen", imagen); // Cambiado a "imagenPath"

    Axios.post("http://localhost:3001/create", formData)
      .then(() => {
        alert("Talonario creado");
        resetForm(); // Restablece los campos después de enviar los datos con éxito
      })
      .catch((error) => {
        console.error("Error al crear el talonario:", error);
      });
  };

  return (
    <div className="bg-gray-200 w-full min-h-screen flex items-center justify-center">
      <div className="w-full py-8">
        <div className="bg-white w-5/6 md:w-3/4 lg:w-2/3 xl:w-[500px] 2xl:w-[550px] mt-8 mx-auto px-16 py-8 rounded-lg shadow-2xl">
          <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
            Talonarios
          </h2>
          <p className="text-center text-sm text-gray-600 mt-2">
           Crea tu talonario de Rifa{" "}
          </p>

          <form className="my-8 text-sm">
            <div className="flex flex-col my-4">
              <label className="text-gray-700">Rifa de</label>
              <input
                type="text"
                name="rifaDe"
                id="rifaDe"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                onChange={(event) => setRifaDe(event.target.value)}
                value={rifaDe}
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="text-gray-700">Fecha</label>
              <input
                type="date"
                name="fecha"
                id="fecha"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                onChange={(event) => setFecha(event.target.value)}
                value={fecha}
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="text-gray-700">Vendedor</label>
              <input
                type="text"
                name="vendedor"
                id="vendedor"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                onChange={(event) => setVendedor(event.target.value)}
                value={vendedor}
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="text-gray-700">Valor Boleta</label>
              <input
                type="number"
                name="valorBoleta"
                id="valorBoleta"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                onChange={(event) => setValorBoleta(event.target.value)}
                value={valorBoleta}
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="text-gray-700">No. Boletas</label>
              <input
                type="number"
                name="noBoletas"
                id="noBoletas"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                placeholder="Enter the vendor's name"
                onChange={(event) => setNoBoletas(event.target.value)}
                value={noBoletas}
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="text-gray-700">Loteria</label>
              <input
                type="text"
                name="loteria"
                id="loteria"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                onChange={(event) => setLoteria(event.target.value)}
                value={loteria}
              />
            </div>

            <div className="flex flex-col my-4">
              <label className="text-gray-700">Imagen</label>
              <input
                type="file"
                name="imagen"
                id="imagen"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                placeholder="Enter the vendor's name"
                onChange={handleImageChange}
              />
            </div>
          </form>

          <div className="my-4 flex items-center justify-end space-x-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase"
              onClick={add}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Talonarios;
