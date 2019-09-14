const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await req.db.collection("users").find({}).toArray();
  console.log(users);
  res.json(users);
});


module.exports = router;
