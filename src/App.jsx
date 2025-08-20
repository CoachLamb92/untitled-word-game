import { useState } from 'react';
import AddLetter from './add_letter';
import Anagram from './anagram';
import ExchangeLetter from './exchange_letter';
import LetterGenerator from './letter_generator';
import MaybeChecker from './maybe_checker';
import RemoveLetter from './remove_letter';
import './App.css';
import starting_words_easy from './starting_words_easy';

function App() {
  const starting_word = starting_words_easy[Math.floor(Math.random() * starting_words_easy.length)]
  const [data, setData] = useState(starting_word);
  const [allData, setAllData] = useState([starting_word]);
  const [history, setHistory] = useState(new Map());
  const [currentPage, setPage] = useState(0);

  const contents = {
    "MainMenuPage": 0,
    "PowerupPage": 1,
    "AddLetterPage": 2,
    "AnagramPage": 3,
    "ExchangeLetterPage": 4,
    "RemoveLetterPage": 5,
    "GameOverPage": 6,
    "RulesPage": 7
  };

  function resetGame() {
    const new_word = starting_words_easy[Math.floor(Math.random() * starting_words_easy.length)]
    setData(new_word);
    setAllData([new_word]);
    setHistory(new Map());
    setPage(0);
  };

  function updateHistory(word, powerup, letter_or_anagram) {
    let new_entry = [word, powerup, letter_or_anagram];
    let updated_map = history.set(history.size+1, new_entry);
    setHistory(updated_map);
  };

  function handleLetter(letter, letter_map) {
    if (letter_map.get(letter).length !== 0) {
      let random_word = letter_map.get(letter)[Math.floor(Math.random() * letter_map.get(letter).length)]
      setData(random_word);
      setAllData([...allData, random_word]);
      setPage(1);
    } else {
      // Game Over
      setPage(6);
    }
  }

  function handleSubmit(e) {
    let maybe_words = Anagram(data);
    let wordList = MaybeChecker(maybe_words, allData);
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    
    let anagram = formJson["anagram"].toLowerCase().trim();
    updateHistory(data, "anagram", anagram);

    if (new Set(wordList).has(anagram)) {
      setData(anagram);
      setAllData([...allData, anagram]);
      setPage(1);
    } else {
      setPage(6);
    }
  }

  function AddLetterPage() {
    let items = [];
    let maybe_words = AddLetter(data);
    let wordList = MaybeChecker(maybe_words, allData);
    let letter_map = LetterGenerator(data, wordList, "add");
    let letters = Array.from(letter_map.keys()).sort();

    let map_string = "";
    letter_map.forEach (function(value, key) {
      map_string += key + ': ' + value.join(", ") + " | ";
    })

    for (let tl of letters) {
      items.push(<button 
      className='playButton'
      key={letters.indexOf(tl)}
      value={tl}
      onClick={() => { handleLetter(tl, letter_map); updateHistory(data, "add letter", tl)}}
      >
        {tl}
      </button>)
    }

    return (
    <>
      <h2>Add a letter</h2>

      <p>Current word:<br></br><b>{data}</b></p>
      <p>Words used so far:<br></br><b>{allData.join(" | ")}</b></p>

      {/* Possible words (including used words): {maybe_words.join(" | ")}<br></br> */}
      {/* Possible words (not including used words): {wordList.join(" | ")}<br></br>
      Letter choices: {letters.join(", ")}<br></br>
      Letter map: {map_string}<br></br> */}
      {items}
    </>
   );
  }

  function AnagramPage() {
    return (
      <>
        <h2>Anagram</h2>

        <p>Current word:<br></br><b>{data}</b></p>
        <p>Words used so far:<br></br><b>{allData.join(" | ")}</b></p>

        <form onSubmit={handleSubmit}>
          <label> Enter an anagram for "{data}":<br></br>
            <input name="anagram" defaultValue="" />
          </label>
          <button type="submit">Submit anagram</button>
        </form>
      </>
    )
  }
  
  function ExchangeLetterPage() {
    let items = [];
    let maybe_words = ExchangeLetter(data);
    let wordList = MaybeChecker(maybe_words, allData);
    let letter_map = LetterGenerator(data, wordList, "exchange");
    let letters = Array.from(letter_map.keys()).sort();

    let map_string = "";
    letter_map.forEach (function(value, key) {
      map_string += key + ': ' + value.join(", ") + " | ";
    })

    for (let tl of letters) {
      items.push(<button 
      className='playButton'
      key={letters.indexOf(tl)}
      value={tl}
      onClick={() => { handleLetter(tl, letter_map); updateHistory(data, "exchange letter", tl); }}
      >
        {tl}
      </button>)
    }

    return (
    <>
      <h2>Exchange a letter</h2>

      <p>Current word:<br></br><b>{data}</b></p>
      <p>Words used so far:<br></br><b>{allData.join(" | ")}</b></p>
  
      {/* Possible words (including used words): {maybe_words.join(" | ")}<br></br> */}
      {/* Possible words (not including used words): {wordList.join(" | ")}<br></br>
      Letter choices: {letters.join(", ")}<br></br>
      Letter map: {map_string}<br></br> */}

      {items}
    </>
   );
  }

  function GameOverPage() {

    function ScoreMessage() {
      let plural = "";
      if (allData.length > 1) {
        plural = "s";
      }
      return (<p><b>You scored {allData.length} point{plural}!</b></p>)
    };

    function ReadableHistory() {
      let items = []

      history.forEach (function(value, key) {
        let l_a = ", Letter: "
        if (value[1] == "anagram") {
          l_a = ", Anagram: "
        }
        let round = "Round " + key + ": Word: " + value[0] + ", Powerup: " + value[1] + l_a + value[2] + " |";
        items.push(<div key={key}>{round}</div>);
      })
    
      return items;
    };
  
    return (
      <>
        <h2>GAME OVER</h2>
        <p>You lost on this word:<br></br><b>{data}</b></p>
        <p>These are all the words you used:<br></br><b>{allData.join(" | ")}</b></p>
        {ScoreMessage()}
        {/* <p>History:<br></br></p>
        <b>{ReadableHistory()}</b> */}
        <br></br>
        <button onClick={() => resetGame()}>Back to main menu</button>
      </>
    )
  }

  function PowerupPage() {
    return (
      <>
        <h2>Choose from one of the powerups</h2>
        <p>Current word:<br></br><b>{data}</b></p>
        <p>Words used so far:<br></br><b>{allData.join(" | ")}</b></p>

        <button onClick={() => setPage(2)}>Add Letter</button>
        <button onClick={() => setPage(3)}>Anagram</button>
        <button onClick={() => setPage(4)}>Exchange Letter</button>
        <button onClick={() => setPage(5)}>Remove Letter</button>
      </>
    );
  }
  
  function RemoveLetterPage() {
    let items = [];
    let maybe_words = RemoveLetter(data);
    let wordList = MaybeChecker(maybe_words, allData);
    let letter_map = LetterGenerator(data, wordList, "remove");
    let letters = Array.from(letter_map.keys()).sort();

    let map_string = "";
    letter_map.forEach (function(value, key) {
      map_string += key + ': ' + value.join(", ") + " | ";
    })

    for (let tl of letters) {
      items.push(<button 
      className='playButton'
      key={letters.indexOf(tl)}
      value={tl}
      onClick={() => {handleLetter(tl, letter_map); updateHistory(data, "remove letter", tl); }}
      >
        {tl}
      </button>)
    }

    return (
    <>
      <h2>Remove a letter</h2>

      <p>Current word:<br></br><b>{data}</b></p>
      <p>Words used so far:<br></br><b>{allData.join(" | ")}</b></p>
      
      {/* Possible words (including used words): {maybe_words.join(" | ")}<br></br> */}
      {/* Possible words (not including used words): {wordList.join(" | ")}<br></br>
      Letter choices: {letters.join(", ")}<br></br>
      Letter map: {map_string}<br></br> */}

      {items}
    </>
   );
  }

  function MainMenuPage() {
    return (
      <>
        <h2 className=''>Welcome to Untitled Word Game!</h2>
          <h3>I hope it plays well and looks good!</h3>
        <h4>You randomly start with a 4-letter word.<br></br>
        Your goal is to choose an option to conitune your word chain, without reusing any words!
        </h4>
          <button onClick={() => setPage(1)}>Play Game!</button>
          <br></br>
          <button onClick={() => setPage(7)}>Rules</button>

        <h3> Disclaimer:</h3>
        <p>The set of allowed words is vast, including hundreds of simple words from other languages,
        as well hundreds of super-specific scientific, medical, and outdated words. There are also quite a few swear words,
        and I can imagine worse dangers in there. So apologies if anything heinous rears its head, this dictionary remains unvetted.</p>
        <p>Eventually, I'd like to reduce the dictionary to a more specific set of allowed words,
          perhaps whatever is allowed in Scrabble.</p>
      </>
    )
  }

  function RulesPage() {
    return (
      <>
        <h2>Rules</h2>
        <div className='grid-container'>
          <div className='grid-box'>
            <h4>Add Letters</h4>
            <h4>You will be offered 5 letters to choose from to add to your current word<br></br>
            The letter order of the current word does not change<br></br>
            You should always be offered viable options, where possible<br></br>
            The game only offers incorrect letters if there are less than 5 viable options</h4>
            <p>Example: If the only letter that can be added to "handicap" is "s", then "s" will be one of the five options provided on the buttons.<br></br>
            Example: If there are no viable letters for the current word, 5 random letters will be provided<br></br>
            Example: If the letter you choose provides multiple options, such as "nail" and "s" ("snail" and "nails"), the game will randomly choose between them</p>
          </div>

          <div className='grid-box'>
            <h4>Anagram</h4>
            <h4>You must enter an anagram into the text field provided<br></br>
            Pressing the return button on your keyboard, or clicking the "Submit Anagram" button will submit exactly what is written, including grammar, and other non-alphabtical characters</h4>
            <p>Example: The current word is "pan". You type in "na" and prematurely submit. This is an immediate game over<br></br>
            The button takes no prisoners, so double-check before you submit</p>
          </div>

          <div className='grid-box'>
            <h4>Exchange Letters</h4>
            <h4>You will be offered (at most) 5 letters to choose from. These letters are in your current word, and will be exchanged, if viable, with a random letter to form a new word<br></br>
            You should always be offered viable options, where possible<br></br>
            The game only offers letters from your current word. If there are less than 5 viable options in your word, you will be offered letters from your word at random that will lead to a game over<br></br>
            If your current word has 5 or less unique letters, all letters will be displayed as options, regardless of viability</h4>
            <p>Example: If the only letter that can be exchanged in "sharing" is "h", then "h" will be one of the 5 letters to choose from. The other 4 will be a random selection of "s", "a", "r", "i", "n" and "g". Selecting "h" will return "scaring" or "staring" or any other viable options.<br></br>
            Example: If the letter you choose provides multiple options, such as "hell" and "l" ("heel" and "held"), the game will randomly choose between them</p>
          </div>
          
          <div className='grid-box'>
            <h4>Remove Letters</h4>
            <h4>You will be offered (at most) 5 letters to choose from. These letters are in your current word, and will be exchanged, if viable, with a random letter to form a new word<br></br>
            You should always be offered viable options, where possible<br></br>
            The game only offers letters from your current word. If there are less than 5 viable options in your word, you will be offered letters from your word at random that will lead to a game over<br></br>
            If your current word has 5 or less unique letters, all letters will be displayed as options, regardless of viability</h4>
            <p>Example: If the only letter that can be removed from "shallower" is "h", then "h" will be one of the 5 letters to choose from. The other 4 will be a random selection of "s", "a", "l", "o", "w", "e" and "r". Selecting "h" will return "sallower".</p>
          </div>
        </div>
        <button onClick={() => setPage(0)}>Main Menu</button>
      </>
    )
  }

  switch(currentPage) {
    case 0:
      return (<><MainMenuPage /></>);
    case 1:
      return (<><PowerupPage /></>);
    case 2:
      return (<><AddLetterPage /></>);
    case 3:
      return (<><AnagramPage /></>);
    case 4:
      return (<><ExchangeLetterPage /></>);
    case 5:
      return (<><RemoveLetterPage /></>);
    case 6:
      return (<><GameOverPage /></>);
    case 7:
      return (<><RulesPage /></>);
    default:
      return (<><h1>ERROR. REFRESH PAGE</h1></>)
  }
}

export default App;
