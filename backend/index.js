const express = require("express");
const app = express();
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const authenticate = require("./middlewares/authMiddleware");
const secretKey = 'test_1'

const corsOptions = {
  origin: 'https://rifas-web.vercel.app/', // Reemplaza con el dominio real de tu aplicación Vercel
  optionsSuccessStatus: 200 // Algunas versiones de cors requieren esto
};

app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/*const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rifasdb",
});*/

const db = mysql.createConnection({
  host: "www.virtualcopias.com",
  port: "3306",
  user: "u624538985_talonario",
  password: "jMendezr_1235689*-.",
  database: "u624538985_talonario_web",
});

setInterval(function () {
  db.query('SELECT 1');
}, 5000);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Ruta para obtener tarjetas de usuarios autenticados
app.get("/tarjetas/autenticados", authenticate, (req, res) => {
  const usuarioId = req.user.userId;
  db.query(
    "SELECT * FROM talonarios WHERE usuario_id = ?",
    [usuarioId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error al obtener las tarjetas", details: err.message });
      } else {
        const tarjetas = result.map((tarjeta) => ({
          ...tarjeta,
          imagen: path.basename(tarjeta.imagen),
        }));
        res.status(200).json(tarjetas);
      }
    }
  );
});

// Ruta para obtener tarjetas de usuarios no autenticados
app.get("/tarjetas/no-autenticados", (req, res) => {
  db.query("SELECT * FROM talonarios", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener las tarjetas", details: err.message });
    } else {
      const tarjetas = result.map((tarjeta) => ({
        ...tarjeta,
        imagen: path.basename(tarjeta.imagen),
      }));
      res.status(200).json(tarjetas);
    }
  });
});



app.post("/create", authenticate, upload.single("imagen"), (req, res) => {
  try {
    const usuarioId = req.user.userId; // Corrección: debe ser req.user.userId en lugar de req.user.id
    const rifaDe = req.body.rifaDe;
    const fecha = req.body.fecha;
    const vendedor = req.body.vendedor;
    const valorBoleta = req.body.valorBoleta;
    const noBoletas = req.body.noBoletas;
    const loteria = req.body.loteria;
    const imagenNombre = req.file ? req.file.filename : "IMG-01.png";

    db.beginTransaction((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error al crear el talonario" });
        return;
      }

      db.query(
        "INSERT INTO talonarios(usuario_id, rifaDe, fecha, vendedor, valorBoleta, noBoletas, loteria, imagen) VALUES(?,?,?,?,?,?,?,?)",
        [usuarioId, rifaDe, fecha, vendedor, valorBoleta, noBoletas, loteria, imagenNombre],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Error al crear el talonario" });
            db.rollback();
            return;
          }

          const talonarioId = result.insertId;

          for (let numeroBoleta = 1; numeroBoleta <= noBoletas; numeroBoleta++) {
            db.query(
              "INSERT INTO tickets(numeroBoleta, estado, nombre, talonario_id) VALUES(?,?,?,?)",
              [numeroBoleta, "Disponible", "", talonarioId],
              (err) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ error: "Error al crear las boletas" });
                  db.rollback();
                  return;
                }
              }
            );
          }

          db.commit((err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: "Error al crear el talonario" });
            } else {
              res.status(200).json({ message: "Talonario y boletas creados exitosamente" });
            }
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


app.post("/registro", (req, res) => {
  const nombre = req.body.nombre;
  const contrasena = req.body.contrasena;

  db.query(
    "INSERT INTO usuarios (nombre, contrasena) VALUES (?, ?)",
    [nombre, contrasena],
    (err, result) => {
      if (err) {
        console.error("Error al registrar:", err);
        res.status(500).json({ error: "Error al registrar el usuario" });
      } else {
        res.status(200).json({ message: "Registro exitoso" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const nombre = req.body.nombre;
  const contrasena = req.body.contrasena;
  const jwt = require('jsonwebtoken');

  db.query(
    "SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?",
    [nombre, contrasena],
    (err, results) => {
      if (err) {
        console.error("Error al autenticar:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        if (results.length > 0) {
          // El usuario existe, generamos un token
          const user = results[0]; // Obtenemos el primer resultado
          const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
          res.status(200).json({ message: "Autenticación exitosa", token: token, nombre: user.nombre });
        } else {
          // El usuario no existe o las credenciales son incorrectas
          res.status(401).json({ error: "Credenciales incorrectas" });
        }
      }
    }
  );
});


app.get("/boletas/:talonarioId", authenticate, (req, res) => {
  const usuarioId = req.user.id;
  const talonarioId = req.params.talonarioId;

  db.query(
    "SELECT * FROM tickets WHERE talonario_id = ?",
    [talonarioId, usuarioId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error al obtener las boletas" });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.put("/boletas/:id", authenticate, (req, res) => {
  const usuarioId = req.user.id;
  const boletaId = req.params.id;
  const { nombre, estado } = req.body;

  // Verifica si el usuario tiene permiso para editar esta boleta
  db.query(
    "SELECT * FROM tickets WHERE id = ?",
    [boletaId, usuarioId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error al verificar los permisos de la boleta" });
      } else {
        if (results.length > 0) {
          db.query(
            "UPDATE tickets SET nombre = ?, estado = ? WHERE id = ?",
            [nombre, estado, boletaId],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).json({ error: "Error al actualizar la boleta" });
              } else {
                res.status(200).json({ message: "Boleta actualizada exitosamente" });
              }
            }
          );
        } else {
          res.status(403).json({ error: "No tienes permiso para editar esta boleta" });
        }
      }
    }
  );
});

app.delete("/delete/:id", authenticate, (req, res) => {
  const usuarioId = req.user.id;
  const talonarioId = req.params.id;

  // Verifica si el usuario tiene permiso para eliminar este talonario
  db.query(
    "SELECT * FROM talonarios WHERE id = ? ",
    [talonarioId, usuarioId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error al verificar los permisos del talonario" });
      } else {
        if (results.length > 0) {
          db.beginTransaction((err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: "Error al eliminar el talonario" });
              return;
            }

            db.query(
              "DELETE FROM talonarios WHERE id = ?",
              [talonarioId],
              (err) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ error: "Error al eliminar el talonario" });
                  db.rollback();
                  return;
                }

                db.query(
                  "DELETE FROM tickets WHERE talonario_id = ?",
                  [talonarioId],
                  (err) => {
                    if (err) {
                      console.log(err);
                      res.status(500).json({ error: "Error al eliminar las boletas" });
                      db.rollback();
                      return;
                    }

                    db.commit((err) => {
                      if (err) {
                        console.log(err);
                        res.status(500).json({ error: "Error al eliminar el talonario" });
                      } else {
                        res.status(200).json({ message: "Talonario y boletas eliminados exitosamente" });
                      }
                    });
                  }
                );
              }
            );
          });
        } else {
          res.status(403).json({ error: "No tienes permiso para eliminar este talonario" });
        }
      }
    }
  );
});

app.listen(80, () => {
  console.log("Corriendo en el puerto 3001");
});
