const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //says these two lines need to come before all other routes is that what it means?
app.use(bodyParser.urlencoded({ extended: true }));

function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    let randomNum = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomNum);
  }
  return result;
}


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => { //this is showing you your object
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => { //hello route anything you type into the browser bar will be seen as a get request
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => { //have ejs file and its using render so it is looking for a template and rendering it with those variables
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { 
  res.render("urls_new");
});

// localhost:8080:/urls/hello/world
// :shortURL = 'hello'
// :otherThing = 'world'

//myFunc('hello', 'world')
//myFunc(shortURL, otherThing) but the actual values are the req.params.otherThing and req.params.shortUrl

//req.params only includes the value that were given as part of the URL itself(represented by the variable shortURL in this case)
app.get("/urls/:shortURL", (req, res) => {  //think of the : as a parameter denotes that shortURL is a dynamic parameter req.params is like saying what is in the URL it will be the 2xnb etc, object with keys you define in the HTML
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }; //gets defined when you make a request by going into the website
  // console.log(templateVars)
  res.render("urls_show", templateVars); //res.render is like madlibs we call them templateVars because they are the variables that will end up in the template
}); ///res.render sends something back to the browser

// localhost:8080/urls, POST
//wendys/tim hortons same building is the server -> there is a valet and you tell them if you want to go to tims or wendys (like get and post here)

app.post("/urls", (req, res) => {
  // console.log(req)
  //  console.log(req.body);  // Log the POST request body to the console, this will hold the content
  let randomShortUrl = generateRandomString();
  urlDatabase[randomShortUrl] = req.body.longURL;
  // res.redirect(req.body.longURL); //redirect to the other route so the url/ short url like an edit page for the short URL status code of 301, 301 and 302 are redirects that are widely used
  // console.log(urlDatabase)
  res.redirect(`/urls/${randomShortUrl}`) // localhost:8080/urls/123abc
  // res.send("Ok");         // Respond with 'Ok' (we will replace this) sends an HTTP status of 200 and then in the body here it is sending ok
  //redirect is going back to the browser
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params.shortURL)
  delete urlDatabase[req.params.shortURL] //delete shortURL
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params.shortURL)
  delete urlDatabase[req.params.shortURL] //delete shortURL
  res.redirect("/urls");
});

//add a post route that updates a URL resource; POST /urls/:id
app.post("/urls/:shortURL", (req, res) => {
  let newLongURL = req.body.longURL;
  //update in the database
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
});

// localhost:8080/u/9sm5xK -> "http://www.google.com"
app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]); //the dynamic key is a parameter so we can access it using req.params.whateveritis
});

//google.ca you make a browser request to google who sends back HTML to your browser
//get, post, alot of it is just semantics

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});