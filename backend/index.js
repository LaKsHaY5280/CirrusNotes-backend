const express = require("express");
const path = require("path");
require("dotenv").config();
const connectToMongo = require("./db");
var cors = require("cors");

const app = express();  
app.use(express.static(path.join(__dirname, "build")));

const port = process.env.PORT;
const hostd = process.env.NODE_ENV === "production" ? "163.53.252.211" : "localhost";
const host =
  process.env.NODE_ENV === "production"
    ? "https://cirrusnotes-backend.onrender.com"
    : `http://localhost:${port}`;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
  res.send("Hello Dev");
});

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/notes", require("./routes/notes"));

connectToMongo();
app.listen(port, hostd, () => {
  console.log(`CirrusNotes app listening at ${host}`);
});
