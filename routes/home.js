const express = require('express')
const router = express.Router()
const db = require('../database')
const { redirectToLogin } = require('../middleware')
const { query } = require('../database')



router.get('/', redirectToLogin, (req, res) => {
  db.any('SELECT \
            users.id, users.firstname, users.lastname, users.email,  \
            users.id_user, users.day, users.start_time, users.end_time \
        FROM \
            users \
        INNER JOIN \
            users \
        ON \
            users.id = users.id_user ')
  .then((users) => {
   console.log(users)
  res.render('pages/index', {
    user: users,
    id:req.session.userId
  })
})
.catch((err) => {
   res.send(err)
})

})



module.exports = router