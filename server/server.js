const express = require("express");
const MongoClient = require("mongodb").MongoClient;
//const bodyParser = require("body-parser");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const url = "mongodb://localhost:27017";
let client;
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(clientP => (client = clientP))
  .catch(err => {
    throw err;
  });

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// Make database global
app.use((req, res, next) => {
  req.db = client.db("test");
  next();
});

// passport config
// require("./config/passport.js")(passport, client);
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.authenticate("remember-me"));



app.get("/api/", (req, res) => {
  res.send("The backend is working");
});

app.use("/api/users", require("./routes/users"));

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(clientP => {
    client = clientP;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    throw err;
  });
