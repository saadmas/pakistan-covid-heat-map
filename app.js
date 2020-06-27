const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'hbs');

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.PORT || 3000);
