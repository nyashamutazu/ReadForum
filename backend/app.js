const express = require("express"), bodyParser = require("body-parser"), path = require("path"), mongoose = require("mongoose"), cors = require("cors"), passport = require("passport")

const indexRoutes = require("./routes/index");

require("./config/passport");

const environment = require("./environment/environment-prod");

const app = express();

const production = true || process.env.NODE_ENV === "production";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/api", indexRoutes);

app.use(express.static(__dirname + "./ReadForum"))

mongoose
  .connect(environment.DATABASE_URL)
  .then(response => {
    if (production) {
      console.log("Successfully connected to database");
    }
  })
  .catch(err => {
    if (production) {
      console.log("Failed to connect to database");
      console.log(err)
    }
  });

  app.get("/*", (req, res, next) => {
    res.sendFile(path.join(__dirname + "./ReadForum/index.html"))
  })

module.exports = app;