const express = require("express"); //importing express
const Sequelize = require("sequelize"); //importing sequelize

const app = express(); //initializing express object
const port = 3000; //setting a variable
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./library.db"
});
app.get("/", (req, res) => res.send("Hello World!")); //set up a route path on my computer that gives me that response
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // starts the server on my computer on port 3000, console log callback function
