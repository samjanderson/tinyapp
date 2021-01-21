const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    console.log(user);
    assert.equal(user.id, expectedOutput);
  });
  it('if we pass an email that is not in our users database it should return undefined', function() {
    const user = getUserByEmail(testUsers, "hello@example.com");
    const expectedOutput = undefined;
    console.log(user);
    assert.equal(user, expectedOutput);
  });
});



