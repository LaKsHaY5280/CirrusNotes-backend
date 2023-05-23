const express = require("express");
const connectToMongo = require("./db");
var cors = require("cors");
 
const app = express();
app.use(express.static("public")); 

const port = 5000;

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
  res.send("Hello Dev");
});

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/notes", require("./routes/notes"));

connectToMongo();
app.listen(port, () => {
  console.log(`CirrusNotes app listening at http://localhost:${port}`);
});
 