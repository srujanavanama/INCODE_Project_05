const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET popular movies list http://localhost:3000/api/popular-movies */
router.get('/', function(req, res, next) {
  axios.get(`/discover/movie${process.env.TMDB_API_KEY}`)
  .then((response) => {
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
});

module.exports = router;
