const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['heyo'],

}));

const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers');


app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
// key is short URL and userID is unique cookie


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "sam.andersonnn@live.ca",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => { 
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => { 
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => { //have ejs file and its using render so it is looking for a template and rendering it with those variables
  const userID = req.session.userID;
  const filteredURLs = urlsForUser(userID, urlDatabase);
  const user = users[userID];
  const templateVars = {
    urls: filteredURLs,
    user,
    userID
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  const templateVars = {
    user
  };

  if (!userID) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: null
  };
  res.render("registration_page", templateVars);
});


app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const user = users[userID];
  let currentUsersUrls = urlsForUser(userID, urlDatabase);
  if (!user) {
    return res.status(401).send('Please log in to retrieve your URLs');
  } else if (!currentUsersUrls[shortURL]) {
    return res.status(401).send('This URL does not belong to this account'); 
  }

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user,
    userID
  };
  res.render("urls_show", templateVars); //res.render is like madlibs we call them templateVars because they are the variables that will end up in the template
});


app.get('/login', (req, res) => {
  // const userID = req.session.userID
  const templateVars = {
    user: null
  };
  res.render('login', templateVars);
});


app.post("/urls", (req, res) => {
  const userID = req.session.userID;
  let randomShortUrl = generateRandomString();
  urlDatabase[randomShortUrl] = { longURL: req.body.longURL, userID };
  res.redirect(`/urls/${randomShortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const user = users[userID];
  let currentUsersUrls = urlsForUser(userID, urlDatabase);
  if (!user) {
    return res.status(401).send('Please log in to delete your URLs');
  } else if (!currentUsersUrls[shortURL]) {
    return res.status(401).send('This URL does not belong to this account');
  } else {
    delete urlDatabase[req.params.shortURL]; //delete shortURL
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const user = users[userID];
  let currentUsersUrls = urlsForUser(userID, urlDatabase);
  if (!user) {
    return res.status(401).send('Please log in to retrieve your URLs');
  } else if (!currentUsersUrls[shortURL]) {
    return res.status(401).send('This URL does not belong to this account');
  } else {
    let newLongURL = req.body.longURL;
    urlDatabase[req.params.shortURL].longURL = newLongURL;
    res.redirect("/urls");
  }
});


app.post('/login', (req, res) => {

  const user = getUserByEmail(users, req.body.email);
  ///find the user by email... this should be a function
  //once the for loop is done we should have the user or it is not found
  if (!user) {
    res.status(403).send("Not found");
    return;
  }

  //at this point we know we have a user and we want to check their password
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.status(403).send('Invalid credentials');
    return;
  }

  //at this point we have the user and he has the right password so we have the right guy
  req.session.userID = user.id;
  res.redirect("/urls");

});

app.post("/logout", (req, res) => {
  req.session = null;
  //delete req.session.userID should also work
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const passwordText = req.body.password;

  //this new condition covers not only the empty string but also undefined
  if (!email || !passwordText) {
    res.status(400).send('Username or Password field is empty');
    return;
  }

  //do not continue if there is an existing user here getExistingEmailID is a good place for getUserByEmail() function to create
  if (getUserByEmail(users, email)) {
    res.status(400).send('Email already belongs to an existing account');
    return;
  }

  let id = generateRandomString();
  const password = bcrypt.hashSync(passwordText, 10);

  users[id] = { id, email, password };
  req.session.userID = id;
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//cookies is a variable that the browser keeps on the browser and  anytime you make a request it sends out the request and the cookie



