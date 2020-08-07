const GameContainer = document.querySelector("#game");

const loadingHTML = "<h1>Loading game...</h1>";
const errorHTML = "<h1>Sorry, an error occured</h1>";
const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-again');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

function emptyContainer() {
	GameContainer.innerHTML = "";
}

function renderLoading() {
	emptyContainer();
    GameContainer.innerHTML = loadingHTML;
}
function renderError() {
    emptyContainer();
    GameContainer.innerHTML = errorHTML;
}

function renderGame(randomWords) {
  const words = randomWords
  console.log(words)
  let selectedWord = words[Math.floor(Math.random() * words.length)];
  console.log(selectedWord)

  const correctLetters = [];
  const wrongLetters = [];

  // Show hidden word
  function displayWord() {
    wordEl.innerHTML = `
        ${selectedWord
            .split('')
            .map(letter => ` 
                <span class="letter">
                    ${correctLetters.includes(letter) ? letter : ''} 
                </span>
            `).join('')
        }
    `;
    
    const innerWord = wordEl.innerText.replace(/\n/g, '')
    
    if(innerWord === selectedWord) {
        finalMessage.innerText = 'Congratulations, you have won! 😇'
        popup.style.display = 'flex'
    }

  }

// Update wrong letters
function updateWrongLettersEl() {
  // update wrong-letters
  wrongLettersEl.innerHTML = `
      ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
      ${wrongLetters
          .map((letter) => `<span>${letter}</span>`)} 
  `;
// Display Parts
  figureParts.forEach((part, index) => {
      const errors = wrongLetters.length;

      if(index < errors) {
          part.style.display = 'block';
      } else {
          part.style.display = 'none';
      }
  })
// See if you've lost show popup
  if (wrongLetters.length === figureParts.length) {
      finalMessage.innerText = 'You Lose!'
      popup.style.display = 'flex'
  }
}

// Show notification
function showNotification() {
  notification.classList.add('show')
  setTimeout(() => {
      notification.classList.remove('show')
  }, 2000)
}

//keydown letter press 
window.addEventListener('keydown' , e => {
  if(e.keyCode >=65 && e.keyCode <=90) {
      const letter = e.key

      if(selectedWord.includes(letter)) {
          if(!correctLetters.includes(letter)) {
              correctLetters.push(letter);
              displayWord()

          } else {
              showNotification()
          }
      } else {
          if(!wrongLetters.includes(letter)) {
              wrongLetters.push(letter);
              
              updateWrongLettersEl();
          } else {
              showNotification();
          }
      }
  }
})

// Restart game
playAgainBtn.addEventListener('click', () => {
  // Empty arrays
  correctLetters.splice(0)
  wrongLetters.splice(0)
  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayWord()
  updateWrongLettersEl()
  popup.style.display = 'none'
})

  displayWord()
}

async function loadNewGame() {
	// renderLoading();
	try {
    	const randomWordAPIResponse = await fetch('https://random-word-api.herokuapp.com/word?number=10');
        const randomWordArray = await randomWordAPIResponse.json();

        if (randomWordArray.length === 0) renderError();
        else renderGame(randomWordArray);
    } catch (e) {
    	renderError();
    }
}

loadNewGame();