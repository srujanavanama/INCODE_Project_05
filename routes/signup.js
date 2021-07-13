const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { check, validationResult, body } = require("express-validator");
const { redirectToHome } = require('../middleware')


router.get('/', redirectToHome, 
  (req, res) => {
  res.render("pages/signup", {
    message: req.query.message
  });
});

// validate the fields

router.post(
  "/",
  [
    check("firstName", "Please enter Firstname")
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Name must be alphabetic."),

    check("lastName", "Please enter lastname")
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Name must be alphabetic."),

    check("email", "Email is not valid").isEmail().normalizeEmail(),

    check("psw", "Please enter Password")
      .exists()
      .notEmpty()
      .matches(/^(?=.*[A-Za-z])(?=.*[!@#$&*])(?=.*[0-9]).{5,}$/)
      .withMessage(
        "Password must be min 5 char long. At least one character and number and least one special character."
      ),

    check("confirmPsw", "Please enter Password").exists().notEmpty(),

    body("confirmPsw").custom((value, { req }) => {
      if (value !== req.body.psw) {
        throw new Error("Password confirmation does not match password");
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
    //(req, res) => {
    // Handle the request
    //},
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("pages/signup", {
        alert,
      });
    }

    //check: Is email in database?
    db.oneOrNone("SELECT * FROM users WHERE email = $1;", [
      req.body.email.toLowerCase(),
    ])
      .then((existingUser) => {
        console.log(existingUser);
        if (existingUser) {
          // check if email already exists
          res.redirect("/signup?message=User%20already%20exists.");
        } else {
          // add to database

          const newUser = {
            lastname: req.body.lastName,
            firstname: req.body.firstName,
            email: req.body.email.toLowerCase(),
            password: bcrypt.hashSync(req.body.psw, saltRounds),
          };
          console.log(newUser);

          db.none(
            "INSERT INTO users(lastname, firstname, email, password) VALUES ($1, $2, $3, $4);",
            [
              newUser.lastname,
              newUser.firstname,
              newUser.email,
              newUser.password,
            ]
          )
            .then(() => {
              res.redirect("/login?message=Signup%20success.%20Login?");
            })
            .catch((err) => {
              // error if user hasn't been inserted into the db
              const message = err.message.replace(/ /g, "%20");
              res.redirect(`/signup?message=${message}`);
            });
        }
      })
      .catch((err) => {
        // failed to check whether user email exists or not
        res.send(err.message);
      });
  }
);

module.exports = router;
