const express = require('express')
const router = express.Router()
const db = require('../database')
const bcrypt = require('bcrypt')
const saltRounds = 10
const app = express()
const { check, validationResult, body } = require('express-validator')

// middleware for users that are already logged in
const loggedInMessage = (req, res, next) => {
  if (req.session.userId) {
    res.render('pages/signup', {
      message: req.query.message ? req.query.message : 'You are already logged in, are you sure you want to sign up?'
    })
  } else {
    next()
  }
}

router.get('/', loggedInMessage, (req, res) => {
  res.render('pages/signup', {
    message: req.query.message
  })
})

//Ant
// validate the fields

router.post('/', [
    check('firstName', 'Please enter Firstname')
    .exists()
    .notEmpty()
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.'),

      check('surName', 'Please enter Surname')
      .exists()
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.'),

    check('email', 'Email is not valid')
      .isEmail()
      .normalizeEmail(),
      
   check('psw', 'Plesae enter Password')
     .exists()
     .notEmpty()
   .matches(/^(?=.*[A-Za-z])(?=.*[!@#$&*])(?=.*[0-9]).{5,}$/).withMessage('Password must be min 5 char long. At least one character and number and least one special character.'),
     
    check('confirmPsw', 'Please enter Password')
    .exists()
    .notEmpty(),

    
      body('confirmPsw').custom((value, { req }) => {
        if (value !== req.body.psw) {
          throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      }),
      //(req, res) => {
        // Handle the request
      //},
    


  ], (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
   // return res.status(422).jsonp(errors.array())
     const alert = errors.array()
      res.render('pages/signup', {
      alert
    })
    }
    //check is the entered passwords are the same
//console.log(req.body.psw)
//if (req.body.psw != req.body.confirmPsw) {
  //return res.redirect("/signup?message=Passwords%20doesn't%20match.Please%20renenter.")
//}

//check: Is email in database?
db.oneOrNone('SELECT * FROM users WHERE email = $1;', [req.body.email.toLowerCase()])
  .then((existingUser) => {
    console.log(existingUser)
    if (existingUser) {
      // check if email already exists
      res.redirect("/signup?message=User%20already%20exists.")
    } else {
      // add to database

      const newUser = {
        surname: req.body.surName,
        firstname: req.body.firstName,
        email: req.body.email.toLowerCase(),
        passwords: bcrypt.hashSync(req.body.psw, saltRounds)
      }
console.log(newUser)

db.none('INSERT INTO users(surname, firstname, email, passwords) VALUES ($1, $2, $3, $4);', [newUser.surname, newUser.firstname, newUser.email, newUser.passwords])
      .then(() => {
        res.redirect('/signup/success?message=Signup%20success.')
     })
      .catch((err) => {
        // error if user hasn't been inserted into the db
        const message = err.message.replace(/ /g, '%20')
        res.redirect(`/signup?message=${message}`)
      })
    }
  })
  .catch((err) => {
    // failed to check whether user email exists or not
    res.send(err.message)
  })
})

router.get('/success', (req, res) => {
  res.render('pages/signup-success', {
    message: req.query.message
  })
})




module.exports = router