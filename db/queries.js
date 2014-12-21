/**
 * Created by andrey on 20/12/2014.
 */

var fs = require("fs");
var file = 'db/synonyms.sqlite';
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var utils = require('../util/utils');

var queries = {
    /**
     * Get random words with synonyms
     * @param req
     * @param res
     */
    getRandomWordsWithSynonyms: function (req, res) {
        var wordCount = req.query.wordCount ? req.query.wordCount : 10;
        var hintCount = req.query.hintCount ? req.query.hintCount : 3;

        var query = "SELECT * FROM synonyms WHERE length(word)<=10 ORDER BY RANDOM() LIMIT " + wordCount;
        var db = new sqlite3.Database(file);
        db.serialize(function () {
            db.all(query, function (err, rows) {
                var xmlResult = utils.prepare(rows, hintCount);
                res.set('Content-Type', 'text/xml');
                res.send(xmlResult);
            });
        });
        db.close();

    }
};


module.exports = queries;