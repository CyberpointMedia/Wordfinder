// middleware/generateAllLettersMiddleware.js
const generateAllLetters = () => {
    const allLetters = [];

    // Add single letters from 'a' to 'z'
    for (let i = 0; i < 26; i++) {
        allLetters.push(String.fromCharCode(97 + i));
    }

    // Add combinations of two letters from 'AA' to 'ZZ'
    for (let i = 0; i < 26; i++) {
        for (let j = 0; j < 26; j++) {
            allLetters.push(String.fromCharCode(97 + i) + String.fromCharCode(97 + j));
        }
    }

    // Add combinations of three letters from 'AAA' to 'ZZZ'
    for (let i = 0; i < 26; i++) {
        for (let j = 0; j < 26; j++) {
            for (let k = 0; k < 26; k++) {
                allLetters.push(String.fromCharCode(97 + i) + String.fromCharCode(97 + j) + String.fromCharCode(97 + k));
            }
        }
    }

    return allLetters;
};

const generateAllLettersMiddleware = (req, res, next) => {
    res.locals.allLetters = generateAllLetters();
    next();
};

module.exports = generateAllLettersMiddleware;
