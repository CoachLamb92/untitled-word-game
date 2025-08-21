import all_words from './all_words';

function RemoveLetter(word) {
    //Define length of argument "word"
    let word_length = word.length - 1;
    
    //Array of words of shorter length
    let shorterWords = [];

    for (let fileWords of all_words) {
        if (fileWords.length === word_length) {
            shorterWords.push(fileWords);
        }
    }

    let relevant_choices = [];
    for (let sLWord of shorterWords) {
        for (let i = 0; i <= word_length; i++) {
            if (sLWord.startsWith(word.slice(0, i)) && sLWord.endsWith(word.slice(i+1))) {
                relevant_choices.push(sLWord);
                break;
            }
        }
    }
    return relevant_choices;
}

export default RemoveLetter;
