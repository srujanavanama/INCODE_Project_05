const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET genres list  http://localhost:3000/api/genre-list */
router.get('/', function(req, res, next) {
  axios.get(`/genre/movie/list${process.env.TMDB_API_KEY}`)
  .then((response) => {
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
});

module.exports = router;
