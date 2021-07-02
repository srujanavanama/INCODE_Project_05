const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET movies of a particular genre http://localhost:3000/api/genre-movies/12 */
router.get('/:id', function(req, res, next) {
    const genreId = req.params.id
  axios.get(`/discover/movie${process.env.TMDB_API_KEY}&with_genres=${genreId}`)
  .then((response) => {
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
});

module.exports = router;
