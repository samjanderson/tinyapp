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

const getExistingEmailID = (users, email) => {
  for (let id in users) {
    if (email === users[id].email) {
      return id;
    }
  }
  return false;
}


module.exports = {
  generateRandomString,
  getExistingEmailID
}