const express = require("express");
const passport = require("passport");
const router = express.Router();
const utils = require("../utils");
const bcrypt = require("bcrypt");

router.get("/users", async (req, res) => {
  const users = await req.db
    .collection("users")
    .find({})
    .toArray();
  res.json(users);
});

router.get("/profile", utils.ensureAuthenticated, (req, res) => {
  const user = { ...req.user };
  delete user["password"];
  res.json(user);
});

function authenticate(req, res, next) {
  passport.authenticate("local")(req, res, () => {
    if (!req.body.rememberMe) {
      return next();
    }

    utils.issueToken(req.user, function(err, token) {
      if (err) {
        return next(err);
      }
      res.cookie("rememberMe", token, {
        path: "/",
        httpOnly: true,
        maxAge: 604800000
      });
      return next();
    });
  }); 
}

router.post("/login", authenticate, (req, res) => {
  const user = { ...req.user };
  delete user["password"];
  res.json({ message: "Inicio de sesión exitoso.", user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("rememberMe");
  req.logout();
  res.json({ message: "Cierre de sesión exitoso." });
});

router.post("/register", async (req, res) => {
  for (let field of ["email", "name", "password"]) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
    }
  }
  const { email, name, password: passwordRaw } = req.body;
  try {
    const password = await bcrypt.hash(passwordRaw, 10);
    const users = await req.db
      .collection("users")
      .find({ email })
      .toArray();
    if (users.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe una cuenta con este correo." });
    } else {
      req.db
        .collection("users")
        .insertOne({ email, name, password }, (error, result) => {
          if (error) return res.status(500).json({ error });
          if (result.insertedCount === 1) {
            authenticate(req, res, () => {
              const user = result.ops[0];
              delete user["password"];
              return res.status(201).json({
                message: "Registro exitoso.",
                user
              });
            });
          } else {
            return res
              .status(500)
              .json({ error: "Error en el servidor, por favor vuelve a intentar más tarde." });
          }
        });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
