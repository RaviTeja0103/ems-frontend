var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");

// get req on homepage
router.get("/", function (req, res) {
  res.render("index");
});

router.get("/tables", async function (req, res) {
  let dataSet = await fetch(process.env.API_URL + "/api/v1/hello");
  console.log(dataSet.msg);
  res.render("table");
});

module.exports = router;
