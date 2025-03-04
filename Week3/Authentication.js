const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const app = express();

const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

app.use(express.json())
function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
  const userExist = ALL_USERS.find((user)=> user.username === username && user.password === password)

  return userExist ? true:false;

}

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  
  /*
   + jwt.sign({},password) (Create JWTs)
      - {} --> Object to Parse Into JWT String
      - password --> Key or Password
  */
  var token = jwt.sign({ username: username }, jwtPassword);

  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    // return a list of users other than this username
    const otherUsers=ALL_USERS.filter(user=>user.username!==username);

    return res.json({users:otherUsers})

  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});


app.listen(3000,()=>{
 console.log("listening on Port 3000");
})