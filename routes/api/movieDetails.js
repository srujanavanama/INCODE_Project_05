const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET details of a movie with given id http://localhost:3000/api/movie/508943 */
router.get('/:id', function(req, res, next) {
    const movieId = req.params.id
  axios.get(`/movie/${movieId}${process.env.TMDB_API_KEY}`)
  .then((response) => {
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
});

module.exports = router;