const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3000;

//CORS
app.use(cors());

//JSON en requests
app.use(express.json());

//Conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "likeme",
  password: "12345",
  port: 5432,
});

//Ruta GET
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    console.error("Error en GET /posts", err);
    res.status(500).send("Error al obtener posts");
  }
});

//Ruta POST
app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)",
      [titulo, img, descripcion]
    );
    res.status(201).send("Post creado");
  } catch (err) {
    console.error("Error en POST /posts", err);
    res.status(500).send("Error al crear post");
  }
});

//Inicio servidor
app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
});
