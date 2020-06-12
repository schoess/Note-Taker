const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Express app setup
// =============================================================
var app = express();
var PORT = process.env.port || 3333;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Express handling data parseing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================



app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  try {
      let dataBase = readFileAsync(path.join(__dirname, "/db/db.json"), "utf-8");
      return res.json(JSON.parse(dataBase));
  } catch (err) {
      console.log(err);
  }
});

// app.post("/api/notes", (req, res) => {
//     let userInput = JSON.stringify(req.body);
//     console.log(JSON.parse(userInput));
// });






app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});



// Create New Characters - takes in JSON input

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
