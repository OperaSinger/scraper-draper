var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// var exphbs = require("express-handlebars");
var path = require("path");

var handlebars = require('express-handlebars');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// pass the port into a variable
var PORT = 3000;

// Initialize Express
var app = express();

// Setup Handlebars templating engine
app.engine('handlebars', handlebars({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI;

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI || "mongodb://localhost/draper", { useNewUrlParser: true });


// setting up routes:
app.get("/", function (req, res) {

  // Call the scrape function on home-page load:
  scrape();

  db.Article.find({}, function (err, data) {
    console.log(data);
    res.render('index', { Articles: data });
  })
});

app.get("/notes", function (req, res) {
  db.Note.find({})
    .sort({
      _id: -1
    })
    .exec(function (err, data) {
      // console.log(data);
      if (err) {
        // console.log(err);
      }
      res.json(data);
    })
});

app.post("/submit", (req, res) => {
  // console.log(req.body);
  db.Note.create(req.body)
    .then(function (note) {
      db.Note.find({}).sort({
        _id: -1
      })
        .then(function (note) {
          // console.log(note);
          res.json(note);
        })
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

// A GET route for scraping the NY TIMES website

const scrape = function () {

  const url = "https://www.nytimes.com/section/us?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=U.S.&WT.nav=page";

  // First, we grab the body of the html with request
  axios.get(url).then(function $(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    const results = [];
    // Now, we grab every div with class 'story-body', and do the following:
    $("div.story-body").each(function (i, element) {

      var title = $(this).children("a").text();
      var link = $(this).children("a").attr("href");

      results.push({
        title: title,
        link: link
      });

    });

    let articles = [];
// Since the first 9 objects are empty, we need to start at index 9 and get 10 articles
    for (i = 9; i < 19; i++) {

      var filterTitle = results[i].title.split(" ");
      var filterUrl = results[i].link.split(" ");

      // these next steps are to clear whitespace and the line breaks
      function filterFunction(x) {
        return x != "" && x != "\n";
      }

      const titleFinal = (filterTitle.filter(filterFunction).join(" ").replace(/\\n/g, ''));
      const linkFinal = (filterUrl.filter(filterFunction).join(" ").replace(/\\n/g, ''));

      let article = {
        title: titleFinal,
        link: linkFinal
      };

      articles.push(article);

    }

    // Create a new Article using the `articles` object [] built from scraping
    db.Article.remove({})
      .then(function () {
        db.Article.create(articles)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      })

  });
}

// // Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


