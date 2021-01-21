const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //says these two lines need to come before all other routes is that what it means?
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const { generateRandomString, getExistingEmailID } = require('./helpers')


app.set("view engine", "ejs");


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
// key is short URL and userID is unique cookie

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

// app.get("/urls.json", (req, res) => { //this is showing you your object
//   res.json(urlDatabase);
// });

app.get("/hello", (req, res) => { //hello route anything you type into the browser bar will be seen as a get request
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => { //have ejs file and its using render so it is looking for a template and rendering it with those variables
  const userID = req.cookies["userID"];
  const user = users[userID]
  let filteredURLs = {}
  for (let shortURL in urlDatabase) {
   if (urlDatabase[shortURL].userID === userID ) { //looping through links in url database to see if the person who created it is trying to access
      filteredURLs[shortURL] = {longURL: urlDatabase[shortURL].longURL, userID: userID}
   } 
  }
  const templateVars = {
    urls: filteredURLs,
    user,
    userID
  };

  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const userID = req.cookies["userID"];
  const user = users[userID]
  const templateVars = {
    user
  };

  if(!userID) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.cookies["userID"];
  const user = users[userID];
  const templateVars = {
    user
  };
  res.render("registration_page", templateVars)
})


app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL); 
});

//NOT SURE IF I NEED THIS ONE OR NOT
// app.get("/u/:id", (req, res) => {
//   const shortURL = req.params.id;
//   const longURL = urlDatabase[shortURL]['longURL'];
//   res.redirect(longURL);
// });

app.get("/urls/:shortURL", (req, res) => {  
  const userID = req.cookies["userID"];
  const user = users[userID];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user,
    userID
  };
  res.render("urls_show", templateVars); //res.render is like madlibs we call them templateVars because they are the variables that will end up in the template
}); ///res.render sends something back to the browser

app.get('/login', (req, res) => {
  const userID = req.cookies["userID"];
  const templateVars = {
    user: null
  }
  res.render('login', templateVars)
});


app.post("/urls", (req, res) => {
  const userID = req.cookies["userID"];
  let randomShortUrl = generateRandomString();
  urlDatabase[randomShortUrl] = { longURL: req.body.longURL, userID }
  res.redirect(`/urls/${randomShortUrl}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL] //delete shortURL
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.shortURL].longURL = newLongURL;
  res.redirect("/urls");
});

// //passed here this was old working version
// app.post('/login', (req, res) => {
//   const { username } = req.body //destructuring watch a video get the username value out of the object and assign it to the variable
//   res.cookie('username', username);
//   res.redirect("/urls");
// });

app.post('/login', (req, res) => {
  //  res.cookie('userID', userID);
  // res.redirect("/urls");
  // const { email, password } = req.body
  // const userID = getExistingEmailID(users, email)
  // if (userID) {
  //   if (req.body.password === users[userID].password) {
  //     console.log('password matches');
  //     res.cookie('userID', userID)
  //     res.redirect("/urls")
  //     return;
  //   }
  // }
  
  //this was here instead of helper function before
  for (let id in users) {
    // console.log(users[id])
    if (req.body.email !== users[id].email) {
      return res.status(403).send('Incorrect email. That email cannot be found in our system');
    }

    if (req.body.email === users[id].email) {
      console.log("found correct user")
      if (req.body.password !== users[id].password) {
        return res.status(403).send('Incorrect password');
      } else {
        res.cookie('userID', id) 
        return res.redirect("/urls");
      }
    }


    // if (req.body.email === users[id].email) {
    //   console.log("found correct user")
    //   if (req.body.password === users[id].password) {
    //     console.log('password matches')
    //     res.cookie('userID', id) 
    //     return res.redirect("/urls")
    //   }
    // }
  }
  res.send("Invalid credentials")
});

app.post("/logout", (req, res) => {
  res.clearCookie('userID'); //this accepts the key we dont need the value
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Username or Password field is empty');
    return;
  }
  if (getExistingEmailID(users, req.body.email)) {
    res.status(400).send('Email already belongs to an existing account');
    return;
  }
  //this was here instead of the helper function before
  // for (let id in users) {
  //   if (req.body.email === users[id].email) {
  //     res.status(400).send('Email already belongs to an existing account')
  //     return
  //   }
  // }
  let randomUserID = generateRandomString();
  users[randomUserID] = {
    id: randomUserID,
    email: req.body.email,
    password: req.body.password,
  }
  res.cookie('userID', randomUserID); //give the user this cookie(like a business card) you will get a cookie with a random user ID
  res.redirect("/urls");
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//cookies is a variable that the browser keeps on the browser and  anytime you make a request it sends out the request and the cookie



