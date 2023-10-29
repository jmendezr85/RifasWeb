import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Inicio from "./components/inicio";
import Talonarios from "./components/talonarios";
import Boletas from "./components/boletas";
import Registro from "./components/registro";
import Login from "./components/login";
import axios from "axios";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (typeof storedToken === "string") {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const handleLogin = (newToken, newUserName) => {
    setToken(newToken);
    setUserName(newUserName);
    localStorage.setItem("authToken", newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUserName(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-full lg:w-1/5 bg-gray-800 text-white p-4">
          <Link to="/" className="text-center lg:text-left">
            <img
              src="/images/IMG-02.png"
              alt="Mi Logo"
              className="w-48 mx-auto lg:mx-0 mb-4"
            />
          </Link>
          <nav className="mt-6">
            {token && (
              <p className="mt-4 text-center lg:text-left text-white font-semibold">
                ¡Bienvenido,{" "}
                <span role="img" aria-label="star" className="inline-block">
                  🌟
                </span>
                {userName}!
              </p>
            )}
            <ul>
              {token ? (
                <>
                  <li>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full">
                      <Link to="/talonarios">Crear Formulario</Link>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full">
                      <Link to="/registro">Regístrate</Link>
                    </button>
                  </li>
                  <li>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full">
                      <Link to="/login">Inicia Sesión</Link>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Contenido Principal */}
        <div className="w-full lg:w-4/5 p-4">
          <Routes>
            <Route
              path="/login"
              element={
                token ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route path="/registro" element={<Registro />} />
            <Route
              path="/talonarios"
              element={<Talonarios userName={userName} />}
            />
            <Route
              path="/"
              element={<Inicio userName={userName} token={token} />}
            />
            <Route path="/boletas/:talonarioId" element={<Boletas />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
