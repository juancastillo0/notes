function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomString(len) {
  const buf = [],
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    charlen = chars.length;

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
  return buf.join("");
}
function issueToken(user, done) {
  var token = randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) {
      return done(err);
    }
    return done(null, token);
  });
}

/* Fake, in-memory database of remember me tokens */
var tokens = {};

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}
function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ error: "Debes estar autenticado para realizar esta petición." });
}

module.exports = {
  issueToken,
  consumeRememberMeToken,
  ensureAuthenticated
};