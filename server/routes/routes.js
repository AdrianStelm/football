const express = require("express");
const router = express.Router();
const path = require('path')

 const filePath = path.join(__dirname, "..", "..",'client','src', "public");

router.get("/", async (req, res) => {
  res.sendFile(path.join(filePath,'index.html'));
});

module.exports = router;
