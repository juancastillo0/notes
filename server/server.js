const express = require("express");

const PORT = 5000;
const app = express();

app.get("/", (req, res)=>{
  res.send("The backend is working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});