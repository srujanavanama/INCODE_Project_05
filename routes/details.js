var express = require('express');
var router = express.Router();

// details route
router.get('/', (req, res) => {
  res.render('pages/details', {
  });
});

module.exports = router;