var express = require('express');
var router = express.Router();

var queries = require('../db/queries');

/* GET users listing. */
router.get('/random', function(req, res) {
    queries.getRandomWordsWithSynonyms(req, res);
});

module.exports = router;
