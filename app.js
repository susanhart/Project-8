const express = require("express"); //importing express
const Sequelize = require("sequelize"); //importing sequelize

const app = express(); //initializing express object
//app.use(express.bodyParser());
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

app.get("/books", (req, res) => {
  Book.findAll().then(books => res.send(books));
}); // Book will be an array of all books instances

app.get("/books/new", (req, res) => {
  res.send("A Form Will Go Here!");
});
app.post("/books/new", async (req, res) => {
  Book.findAll().then(books => res.send("Hello World"));
  // A book is stored in the database
  console.log(req.body);
  await Book.create(req.body);
});
//const request = new Request('https://example.com', {method: 'POST', body: '{"foo": "bar"}'});
