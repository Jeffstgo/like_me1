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
    const result = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error en GET /posts", err);
    res.status(500).send("Error al obtener posts");
  }
});


//Ruta POST
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error en GET /posts", err);
    res.status(500).send("Error al obtener posts");
  }
});


// Ruta PUT para dar like
app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Post no encontrado");
    }
    res.send("Like registrado");
  } catch (err) {
    console.error("Error en PUT /posts/like/:id", err);
    res.status(500).send("Error al registrar like");
  }
});

// Ruta DELETE para eliminar post
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Post no encontrado");
    }
    res.send("Post eliminado");
  } catch (err) {
    console.error("Error en DELETE /posts/:id", err);
    res.status(500).send("Error al eliminar post");
  }
});


//Inicio servidor
app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
});
