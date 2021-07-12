const express = require('express')
const router = express.Router()
const db = require('../database')
const bcrypt = require('bcrypt')

// the login page is rendered
router.get('/', (req, res) => {
  res.render('pages/login', {
    message: req.query.message
  })
})


router.post('/', (req, res) => {
  // Check if the user has entered both email and password
  // here we are checking if the boxes are empty
  if (req.body.email === '' || req.body.psw === '') {
    return res.redirect('/login?message=Please%20insert%20both%20email%20and%20password.')
  }

  // does user exist?
  db.oneOrNone('SELECT * FROM users WHERE email = $1', [req.body.email.toLowerCase()])
    .then((existingUser) => {
      // if not, return error
      if (!existingUser) {
        return res.redirect('/login?message=Incorrect%20login%20details.')
      }

      const hash = existingUser.passwords
      // if so, does password match user password?
      bcrypt.compare(req.body.psw, hash, (err, result) => {
      if (result) {
        // if successful, create session and redirect
        console.log(req.session)
        req.session.userId = existingUser.id
        console.log(req.session)
        req.session.loggedin = true
        // res.redirect('/')
      } else {
        console.log(err)
        res.redirect('/login?message=Incorrect%20login%20details.')
      }
    })
  })
  .catch((err) => {
    // couldn't query the database properly
    res.send(err.message)
  })
})

module.exports = router;
