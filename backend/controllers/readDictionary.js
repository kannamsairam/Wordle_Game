const dictionary = require('../library/dictionary');

const length = dictionary.realDictionary.length
console.log(length);

const word = dictionary.realDictionary[Math.floor(Math.random() * dictionary.realDictionary.length)];
console.log(word);
