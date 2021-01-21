const generateRandomString = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    let randomNum = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomNum);
  }
  return result;
};


const getUserByEmail = (users, email) => { 
  for (let id in users) {
    if (email === users[id].email) {
      return users[id]; //that would return the whole particular
    }
  }
  return null;
}

//urlDatabase could be defined as anything here it is just a placeholder
const urlsForUser = (id, urlDatabase) => {
  let filteredURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      filteredURLs[shortURL] = { longURL: urlDatabase[shortURL].longURL, userID: id };
    }
  }
  return filteredURLs;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
}