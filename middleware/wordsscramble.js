const axios = require('axios');

async function wordsScrabbleResults(params, type) {
    let url;
    if (type === 'scrabbled_keywords') {
        url = siteApiEndpoint(params);
    } else if (type === 'words_that_start_with') {
        url = `https://fly.wordfinderapi.com/api/search?starts_with=${params.starts_with.toLowerCase()}&word_sorting=points&group_by_length=true&page_size=20000&dictionary=wwf2`;
    } else if (type === 'dictionary_finder_details') {
        url = `https://dict-api.com/api/od/${params.letters}/`;
    } else if (type === 'dictionary_finder') {
        url = `https://fly.wordfinderapi.com/api/dictionary?word=${params.letters}`;
    } else if (type === 'worda_and_wordb') {
        url = `https://v3.wordfinderapi.com/api/search?must_contain_char1=${params.must_contain_char1}&must_contain_char2=${params.must_contain_char2}&dictionary=otcwl&page_size=100`;
    } else if (type === 'words_by_letters_count') {
        const newParams = {
            page_size: 10000000,
            length: params.length,
            dictionary: determineDictionaryType(params.scrabble_type)
        };

        if (params.contains) newParams.contains = params.contains;
        if (params.ends_with) newParams.ends_with = params.ends_with;
        if (params.starts_with) newParams.starts_with = params.starts_with;

        let url = `https://v3.wordfinderapi.com/api/search?${new URLSearchParams(newParams)}`;
        } else if (type === 'wordle_records') {
        const dataHash = {
            length: 5,
            word_sorting: 'points',
            group_by_length: true,
            page_size: 2000,
            dictionary: 'wordle'
        };

        if (params.include_letters) dataHash.include_letters = params.include_letters.toLowerCase();
        if (params.exclude_letters) dataHash.exclude_letters = params.exclude_letters.toLowerCase();

        const containLettersAvailable = ['contains_1', 'contains_2', 'contains_3', 'contains_4', 'contains_5']
            .some(field => params[field]);

        if (containLettersAvailable) {
            let containsStr = '';
            containsStr += params.contains_1 || '_';
            containsStr += params.contains_2 || '_';
            containsStr += params.contains_3 || '_';
            containsStr += params.contains_4 || '_';
            containsStr += params.contains_5 || '_';
            dataHash.contains = containsStr.toLowerCase();
        }

        url = `https://fly.wordfinderapi.com/api/search?${dataHash.to_query}`;
    }

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function siteApiEndpoint(params) {
    const newParams = {
        page_size: 200,
        group_by_length: true,
        word_sorting: 'points',
        dictionary: determineDictionaryType(params.scrabble_type)
    };

    if (params.letters && params.letters.toLowerCase() !== '_') newParams.letters = params.letters.toLowerCase();
    if (params.length) newParams.length = params.length;
    if (params.contains) newParams.contains = params.contains;
    if (params.ends_with) newParams.ends_with = params.ends_with;
    if (params.starts_with) newParams.starts_with = params.starts_with;

    return `https://fly.wordfinderapi.com/api/search?${newParams.to_query}`;
}

function determineDictionaryType(type) {
    switch (type) {
        case 'wwf':
        case 'us':
        case 'uk':
            return type;
        default:
            return 'all_en';
    }
}
// In the module where wordsScrabbleResults is defined
module.exports.wordsScrabbleResults = wordsScrabbleResults;