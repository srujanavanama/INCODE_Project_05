const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET popular movies list http://localhost:3000/api/popular-movies */
// 'https://api.themoviedb.org/3/discover/movie?api_key=e8acfdb67529c2dd28472a1397887892
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
