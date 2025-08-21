import Atomise from './atomise';

function LetterGenerator(word, list, choice) {
    const output = new Map();
    let word_set = new Set(word);
    let alphabet = "qwertyuiopasdfghjklzxcvbnm";

    if (choice === "add") {
        let word_map = Atomise(word);
        for (let list_word of list) {

            let list_word_map = Atomise(list_word);

            for (let [key, val] of list_word_map) {
                let testVal = word_map.get(key);
                if (testVal !== val) {
                    if (output.has(key)) {
                        let new_array = output.get(key);
                        new_array.push(list_word);
                        output.set(key, new_array);
                    } else {
                        output.set(key, [list_word]);
                    }
                }
            }
        }

        while (output.size < 5) {
            let random_letter = alphabet[Math.floor(Math.random()*26)];
            if (!output.has(random_letter)) {
                output.set(random_letter, []);
            }
        }

    } else if (choice === "exchange") {

        for (let list_word of list) {
            for (let i = 0; i < word.length; i++) {
                if (word.substring(i+1) == list_word.substring(i+1) && word.substring(0, i) == list_word.substring(0, i)) {
                    let key = word[i];
                    if (output.has(key)) {
                        let new_array = output.get(key);
                        new_array.push(list_word);
                        output.set(key, new_array);
                    } else {
                        output.set(key, [list_word]);
                    }
                }
            }
        }

        let remaining = Array.from(word_set.difference(new Set(output.keys())));

        while (output.size < 5 && remaining.length) {
            let random_letter = remaining[Math.floor(Math.random()*remaining.length)];
            if (!output.has(random_letter)) {
                output.set(random_letter, []);
            }
            remaining = Array.from(word_set.difference(new Set(output.keys())));
        }
        
    } else if (choice === "remove") {
        let word_map = Atomise(word);

        for (let list_word of list) {

            let list_word_map = Atomise(list_word);

            for (let [key, val] of word_map) {
                let testVal = list_word_map.get(key);
                if (testVal !== val) {
                    if (output.has(key)) {
                        let new_array = output.get(key);
                        new_array.push(list_word);
                        output.set(key, new_array);
                    } else {
                        output.set(key, [list_word]);
                    }
                }
            }
        }

        let remaining = Array.from(word_set.difference(new Set(output.keys())));

        while (output.size < 5 && remaining.length) {
            let random_letter = remaining[Math.floor(Math.random()*remaining.length)];
            if (!output.has(random_letter)) {
                output.set(random_letter, []);
            }
            remaining = Array.from(word_set.difference(new Set(output.keys())));
        }
    }

    while (output.size > 5) {
        let list_of_keys = Array.from(output.keys());
        let keys_length = list_of_keys.length;
        let random_index = Math.floor(Math.random()*(keys_length));
        output.delete(list_of_keys[random_index]);
    }

    return output;
}

export default LetterGenerator;