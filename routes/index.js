// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'The Movie DB' });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../database");
const { redirectToLogin } = require("../middleware");

router.get("/", redirectToLogin, (req, res) => {
  db.any(
    "SELECT \
            users.id, users.firstname, users.lastname, users.email,  \
            users.id_user, users.day, users.start_time, users.end_time \
        FROM \
            users \
        INNER JOIN \
            users \
        ON \
            users.id = users.id_user "
  )
  .then((users) => {
    console.log(users);
    res.render("pages/index", {
      user: users,
      id: req.session.userId,
    });
  })
  .catch((err) => {
    res.send(err);
  });
});



module.exports = router