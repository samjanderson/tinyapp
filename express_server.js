const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //says these two lines need to come before all other routes is that what it means?
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    let randomNum = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomNum);
  }
  return result;
};


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//users object can take out examples later
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
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => { //this is showing you your object
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => { //hello route anything you type into the browser bar will be seen as a get request
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// //passed here old working version
// app.get("/urls", (req, res) => { //have ejs file and its using render so it is looking for a template and rendering it with those variables
//   const templateVars = {
//     urls: urlDatabase,
//     username: req.cookies["username"],
//   };
//   res.render("urls_index", templateVars);
// });

//new attempt
app.get("/urls", (req, res) => { //have ejs file and its using render so it is looking for a template and rendering it with those variables
  const userID = req.cookies["userID"];
  console.log(req.cookies)
  // console.log(users)
  const user = users[userID]
  console.log(user)
  const templateVars = {
    urls: urlDatabase,
    user
  };
  res.render("urls_index", templateVars);
});


//passed here old working version
// app.get("/urls/new", (req, res) => {
//   const templateVars = {
//     username: req.cookies["username"],
//   };
//   res.render("urls_new", templateVars);
// });

//new attempt
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["userID"];
  const user = users[userID]
  const templateVars = {
    user
  };
  res.render("urls_new", templateVars);
});

// //passed here old working version
// app.get("/register", (req, res) => { 
//   const templateVars = {
//     username: req.cookies["username"],
//   };
//   res.render("registration_page", templateVars)
// })

//new attempt
app.get("/register", (req, res) => { 
  const userID = req.cookies["userID"];
  const user = users[userID];
  const templateVars = {
    user
  };
  res.render("registration_page", templateVars)
})


app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]); //the dynamic key is a parameter so we can access it using req.params.whateveritis
});

// // passed here original working attempt
// app.get("/urls/:shortURL", (req, res) => {  //think of the : as a parameter denotes that shortURL is a dynamic parameter req.params is like saying what is in the URL it will be the 2xnb etc, object with keys you define in the HTML
//   const templateVars = {
//     shortURL: req.params.shortURL,
//     longURL: urlDatabase[req.params.shortURL],
//     username: req.cookies["username"], 
//   };
//   res.render("urls_show", templateVars); //res.render is like madlibs we call them templateVars because they are the variables that will end up in the template
// }); ///res.render sends something back to the browser

//new version attempt
app.get("/urls/:shortURL", (req, res) => {  //think of the : as a parameter denotes that shortURL is a dynamic parameter req.params is like saying what is in the URL it will be the 2xnb etc, object with keys you define in the HTML
  const userID = req.cookies["userID"];
  const user = users[userID];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user
  };
  res.render("urls_show", templateVars); //res.render is like madlibs we call them templateVars because they are the variables that will end up in the template
}); ///res.render sends something back to the browser


app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]); //the dynamic key is a parameter so we can access it using req.params.whateveritis
});

app.get('/login', (req, res) => {
  res.render('login')
})


app.post("/urls", (req, res) => {
  let randomShortUrl = generateRandomString();
  urlDatabase[randomShortUrl] = req.body.longURL;
  res.redirect(`/urls/${randomShortUrl}`) 
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL] //delete shortURL
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL] //delete shortURL
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
});

// //passed here this was old working version
// app.post('/login', (req, res) => {
//   const { username } = req.body //destructuring watch a video get the username value out of the object and assign it to the variable
//   res.cookie('username', username);
//   res.redirect("/urls");
// });

//new attempt with Taylor
app.post('/login', (req, res) => {
  //  res.cookie('userID', userID);
  // res.redirect("/urls");
  for (let id in users) {
    console.log(users[id])
    if (req.body.email === users[id].email) {
      console.log("found correct user")
      if (req.body.password === users[id].password) {
        console.log('password matches')
        res.cookie('userID', id) 
        return res.redirect("/urls")
      }
    }
  }
  res.send("Invalid credentials")
});

app.post("/logout", (req, res) => {
  res.clearCookie('userID'); //this accepts the key we dont need the value
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.send("400 Error, username or password is empty")
  }
  for (let id in users) {
    if (req.body.email === users[id].email) {
      res.send("400 Error, email already belongs to an existing account")
    }
  }
  let randomUserID = generateRandomString();
  users[randomUserID] = {
    id: randomUserID, 
    email: req.body.email, 
    password: req.body.password,
  }
  res.cookie('userID', randomUserID); //give the user this cookie(like a business card) you will get a cookie with a random user ID
  res.redirect("/urls")
  })
  


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//cookies is a variable that the browser keeps on the browser and  anytime you make a request it sends out the request and the cookie



