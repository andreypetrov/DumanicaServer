/**
 * Created by andrey on 20/12/2014.
 */
var MIN_WORD_LENGTH_TO_CENSOR = 3;
var CENSOR_SYMBOL = '*';

var utils = {
    prepare: function (rows, maxSynonymsCount) {
        console.log(rows);
        shuffleTrimAndCensorSynonyms(rows, maxSynonymsCount);
        var rowsXml = convertToXml(rows);
        console.log(rowsXml);
        return rowsXml;
    }
}


/**
 * Get the synonyms into an array, shuffle, trim, and put them back in a string
 * In-place shuffling and trimming of synonyms
 * @param rows
 * @param maxSynonymsCount
 */
var  shuffleTrimAndCensorSynonyms = function(rows, maxSynonymsCount) {
    for (var i = 0; i < rows.length; i++) {
        var synonyms = rows[i].synonyms.split(', ');
        shuffle(synonyms);
        synonyms = synonyms.slice(0, maxSynonymsCount); //trim down to max count
        censorSynonyms(rows[i].word, synonyms);
        rows[i].synonyms = synonyms.join(', ');
    }
}

/**
 * Remove the occurences of word inside every synonym
 * @param word
 * @param synonyms
 */
var censorSynonyms = function (word, synonyms) {
    for (var i = 0; i < synonyms.length; i++) {
        synonyms[i] = censorString(word, synonyms[i], MIN_WORD_LENGTH_TO_CENSOR, CENSOR_SYMBOL);
    }
}

/**
 * In-place O(n)
 * Fisher–Yates Shuffle
 *
 * http://bost.ocks.org/mike/shuffle/
 * @param array
 * @returns {*}
 */
var shuffle = function(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}


/**
 * Замества срещанията на wordToBeCensored в string параметъра с низове от censoreSymbol символи със същата дължината като премахнатата дума,
 * но само ако wordToBeCensored е по-дълга от minimumWordToCensoreLength на брой символи.
 * @param wordToBeCensored
 * @param string
 * @param minimumWordToCensorLength
 * @returns цензуриран низ.
 */
var censorString = function (wordToBeCensored, string, minimumWordToCensorLength, censorSymbol) {
    var wordLength = wordToBeCensored.length;
    if (wordLength >= minimumWordToCensorLength) {
        //взима низ с толкова censorSymbol, колкото заместената дума има
        var replacementString = getStringWithLengthAndFilledWithCharacter(wordLength, censorSymbol);
        var regex = new RegExp(wordToBeCensored, 'g'); //match all occurrences
        var censoredString = string.replace(regex, replacementString);
        return censoredString;
    } else return string;

}

/**
 * Създава заместителен низ от символи charToFill с дадената дължина length
 * http://stackoverflow.com/questions/16885297/how-to-create-a-string-with-n-characters-how-to-create-a-string-with-specific-l
 * @param length
 * @param charToFill
 * @returns
 */
var getStringWithLengthAndFilledWithCharacter = function(length,charToFill) {
    var result = length > 0 ? Array(length+1).join(charToFill) : "";
    return result;
}

/**
 * Convert the rows to xml
 * @param rows
 * @returns {string}
 */
var convertToXml = function (rows) {
    var xmlDeclaration = "<?xml version='1.0' encoding='UTF-8'?>";
    var wordsOpeningTag = "<words>";
    var wordsClosingTag = "</words>";
    var newLine = "\n";
    var tab = "\t";

    var xml = xmlDeclaration + newLine + wordsOpeningTag + newLine;

    //преминаваме през всички думи и записваме тях и техните синоними
    for (var i = 0; i < rows.length; i++) {
        var currentRow = rows[i];
        xml += "<word name='" + currentRow.word + "'>" + newLine;
        xml += tab + "<synonyms>" + newLine;
        xml += tab + tab + "<![CDATA[" + currentRow.synonyms + "]]>" + newLine;
        xml += tab + "</synonyms>" + newLine;
        xml += "</word>";
    }
    xml += newLine + wordsClosingTag;
    return xml;
}


module.exports = utils;