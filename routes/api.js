const express = require('express');
const router = express.Router();

const popularMoviesRouter = require('./api/popularMovies.js');
const genreListRouter = require('./api/genreList');
const genreMoviesRouter = require('./api/genreMovie');

router.use('/popular-movies', popularMoviesRouter);
router.use('/genre-list', genreListRouter);
router.use('/genre-movies', genreMoviesRouter)

module.exports = router;