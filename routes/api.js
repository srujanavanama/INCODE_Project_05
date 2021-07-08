const express = require('express');
const router = express.Router();

const popularMoviesRouter = require('./api/popularMovies.js');
const genreListRouter = require('./api/genreList');
const genreMoviesRouter = require('./api/genreMovie');
const movieDetailsRouter = require('./api/movieDetails');

router.use('/popular-movies', popularMoviesRouter);
router.use('/genre-list', genreListRouter);
router.use('/genre-movies', genreMoviesRouter)
router.use('/movie', movieDetailsRouter)

module.exports = router;