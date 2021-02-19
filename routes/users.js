const { response } = require("express");
var express = require("express");
const { check, validationResult } = require("express-validator");
var router = express.Router();
var fetch = require("node-fetch");

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register",
  check("empcode")
    .isEmail()
    .withMessage("Emp code must be an email")
    .bail(),
  check("username")
    .isLength({ min: 5 })
    .withMessage("Username must be min 5 characters long")
    .bail()
    .isLength({ max: 20 })
    .withMessage("Username cannot be more than 20 characters long")
    .bail(),
  check("password").isLength({min: 5})
    .withMessage("Password atleast 5 characters long")
    .bail()
    .not()
    .isIn("12345", "password", "00000")
    .withMessage("Never have i ever met someone who enters passwords like this")
    .bail()
    .custom((val, { req, location, path }) => {
      return val == req.body.confirmPassword;
    })
    .withMessage("Passwords don't match"),
  async function (req, res) {
    var { errors } = validationResult(req);
    var {empcode, username, password, confirmPassword} = req.body;
    var authData = {
      empcode: empcode,
      username: username,
      password: password
    };
    if (errors.length) {
      res.render("register", { errors: errors, empcode: empcode, username: username });
    }else{
      req.flash("register_success", "Registered Successfully!");
      res.redirect("login");
    }
  });

router.post(
  "/login",
  check("username")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long")
    .bail()
    .isLength({ max: 20 })
    .withMessage("Username cannot be longer than 20 characters")
    .bail(),
  async function (req, res) {
    var { username, password } = req.body;
    var authData = {
      username: username,
      password: password,
    };
    var { errors } = validationResult(req);
    if (errors.length) {
      res.render("login", { errors: errors, username: username });
    } else {
      let data = await fetch(process.env.API_URL + "/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      res.render("login", data);
    }
  }
);

module.exports = router;
