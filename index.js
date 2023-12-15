const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)");
  db.run("CREATE TABLE dogs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)");
});

app.post("/cats", (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).send("Houve um problema ao registar o candidato. Por favor revise os dados e tente novamente!");
    return;
  }

  if (typeof name !== "string") {
    res.status(400).send("Houve um problema ao registar o candidato. Por favor revise os dados e tente novamente!");
    return;
  }

  db.run(
    `INSERT INTO cats (name, votes) VALUES ('${name}', 0)`,
    function (err) {
      if (err) {
        res.status(500).send("Houve um problema com a sua requisição! Por favor tente novamente!");
      } else {
        res.status(201).json({ id: this.lastID, name, votes: 0 });
      }
    }
  );
});

app.post("/dogs", (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).send("Houve um problema ao registar o candidato. Por favor revise os dados e tente novamente!");
    return;
  }

  if (typeof name !== "string") {
    res.status(400).send("Houve um problema ao registar o candidato. Por favor revise os dados e tente novamente!");
    return;
  }

  db.run(
    `INSERT INTO dogs (name, votes) VALUES ('${name}', 0)`,
    function (err) {
      if (err) {
        res.status(500).send("Houve um problema com a sua requisição! Por favor tente novamente!");
      } else {
        res.status(201).json({ id: this.lastID, name, votes: 0 });
      }
    }
  );
});

app.post("/vote/:animalType/:id", async (req, res) => {
  const animalType = req.params.animalType;
  const id = Number(req.params.id);

  if (animalType !== "cats" && animalType !== "dogs") {
    res.status(400).send("Houve um problema ao registar o voto. Por favor revise os dados e tente novamente!");
    return;
  }

  if (typeof id !== "number") {
    res.status(400).send("Houve um problema ao registar o voto. Por favor revise os dados e tente novamente!");
    return;
  }

  //Verificar se o animal existe
  db.get(`SELECT * FROM ${animalType} WHERE id = ${id}`, (err, row) => {
    if (err) {
      res.status(500).send("Houve um problema com a sua requisição! Por favor tente novamente!");
    } else if (!row) {
      res.status(404).send("Houve um problema ao registar o voto. Por favor revise os dados e tente novamente!");
      return;
    } else {
      db.run(`UPDATE ${animalType} SET votes = votes + 1 WHERE id = ${id}`);
      res.status(200).send("Voto computado");
    }
  });
});

app.get("/cats", (req, res) => {
  db.all("SELECT * FROM cats", [], (err, rows) => {
    if (err) {
      res.status(500).send("Houve um problema com a sua requisição! Por favor tente novamente!");
    } else {
      res.json(rows);
    }
  });
});

app.get("/dogs", (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Houve um problema com a sua requisição! Por favor tente novamente!");
    } else {
      res.json(rows);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ocorreu um erro!");
});

app.listen(port, () => {
  console.log(`Cats and Dogs Vote app listening at http://localhost:${port}`);
});
