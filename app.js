const express = require("express"); //importing express
const Sequelize = require("sequelize"); //importing sequelize
const pug = require("pug");

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

/*
 (i). Renamed new_book.html to new_book.pug 
 (ii) setup the pug view engine. 

*/

app.use(express.static("public"));

// setup pug view engine
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// setup body parser middle ware
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.json());

app.get("/", (req, res) => res.redirect("/books")); //set up a route path on my computer that gives me that response
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // starts the server on my computer on port 3000, console log callback function

app.get("/books", (req, res) => {
  Book.findAll().then(books =>
    res.send(
      pug.renderFile("./views/index.pug", {
        books: books
      })
    )
  );
});
// Book will be an array of all books instances

/*
  Shows the create new book form 
*/
app.get("/books/new", (req, res) => {
  //res.send("See new bbok");
  res.render("new_book", { isvalid: true });
});

/*
 Posts a new book to the database
*/
// app.post("/books/new", async (req, res) => {
//   Book.findAll().then(books => res.send("Hello World"));
//   // A book is stored in the database
//   console.log(req.body);
//   await Book.create(req.body);
// });
app.post("/books/new", async (req, res) => {
  //console.log(req.body);
  //res.send(req.body.title);
  //await sequelize.sync({ force: true });
  // validate that the title and author are not empty

  try {
    const book = await Book.build({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      year: req.body.year
    });
    // validate using sequelize
    const validated = await book.validate(); //validates to make sure there is not an empty field
    const savedBook = await book.save(); //saves changes to the database
    console.log(req.body);
    console.log(book.toJSON());
    //res.send("Succesfully created book " + book.title);
    res.redirect("/books"); // Redirecting the user to the home page after the book changes have been successfully made/updated
  } catch (error) {
    res.render("new_book", {
      isvalid: false
    });
  }
});

app.get("/books/:id", async (req, res, next) => {
  //await sequelize.sync({ force: true });
  const book_id = req.params["id"];
  const book_detail = await Book.findByPk(book_id); //.then(book => res.send(book.toJSON()));
  if (!book_detail) {
    const myErrorMessage = `Book with id ${book_id} does not exist`;
    console.log(res);
    //pug.render("error");
    //res.status(404).send(pug.renderFile("./views/error.pug"));
    res.render("page-not-found", {
      custom_message: myErrorMessage
    });
  } else {
    const book_json = book_detail.toJSON();
    res.render("update-book", {
      book: book_json
    });
  }
});
app.get("*", async (req, res, next) => {
  res.status(404).send(pug.renderFile("./views/page-not-found.pug"));
});
// Book will be an array of all books instances
//Updates book info in the datatbase
app.post("/books/:id", async (req, res) => {
  console.log("logging", req.body);
  try {
    const book_id = req.params["id"];
    // build a temporary copy first.
    const temp_book = await Book.build({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      year: req.body.year
    });
    // validate the inputs
    //Use Sequelize model validation for validating your form fields.
    const result = await temp_book.validate();

    // if (result) {
    //   console.log("This is the error", result);
    //   res.send("Update unsuccessful...Please Try Again with valid fields");
    // } else {
    const book_detail = await Book.findByPk(book_id);
    await book_detail.update({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      year: req.body.year
    });
    // }
    console.log("YAYYYYYYYYYYYYYY");
    res.redirect("/books"); //redirecting user to the home page after the book details have been successfully updated
  } catch (error) {
    console.log(error);
    res.send("Update unsuccessful...Please Try Again with valid fields");
    // res.render("error");
  }
  //res.redirect(`/books/{book_id}`);
});

app.post("/books/:id/delete", async (req, res) => {
  try {
    const book_id = req.params["id"];
    const book = await Book.findByPk(book_id);
    // copy the json
    book_json = book.toJSON();
    //delete book record
    await book.destroy();

    // send a response back
    console.log(book_json);
    //res.send("Successfully deleted " + book_json.title);
    res.redirect("/");
  } catch (error) {
    res.render("error");
  }
});

app.use(function(err, req, res, next) {
  if (err) {
    console.log("We Hit Our Error Handler");
    console.log(err);
    res.status(404).sendFile("./views/page_not_found.html");
  } else {
    next();
  }
});

//const request = new Request('https://example.com', {method: 'POST', body: '{"foo": "bar"}'});
