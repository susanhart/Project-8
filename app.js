const express = require("express"); //importing express
const Sequelize = require("sequelize"); //importing sequelize

const app = express(); //initializing express object
const port = 3000; //setting a variable
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./library.db"
});

class Book extends Sequelize.Model {} //created book class
Book.init(
  {
    //initializes the model object
    title: {
      type: Sequelize.STRING, //properties of the book
      validate: {
        notEmpty: true
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      }
    },
    genre: Sequelize.STRING, //key, value
    year: Sequelize.INTEGER
  },
  { sequelize, modelName: "book" }
); //second argument to the function
app.get("/", (req, res) => res.send("Hello World!")); //set up a route path on my computer that gives me that response
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // starts the server on my computer on port 3000, console log callback function
