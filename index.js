import ancientsData from "./data/ancients.js";
import levelsData from "./data/levels.js";
import {blueCards, brownCards, greenCards} from "./data/mythicCards/index.js"


const step_1 = document.querySelector('.step_1');

const btnStartGame = document.querySelector('.btn__start-game');
btnStartGame.addEventListener('click', () => {
    step_1.classList.add('hidden');
    displayAncientsPicker();
});


let selectedAncient = null;

function pickAncient(ancient) {
    selectedAncient = ancient;
}

function displayAncientsPicker() {
    let html = `<div class="step_2"><h2 class="step__title step_2__title">Choose your card</h2><div class="cards">`
    for (const ancient of ancientsData) {
        html += `<button id="${ancient.id}" class="btn-card"><img class="img" src="${ancient.cardFace}" alt="${ancient.name}" width="300"></button>`
    }
    html += "</div></div>"
    document.getElementById("board").innerHTML = html

    for (const ancient of ancientsData) {
        document.getElementById(ancient.id).addEventListener('click', () => {
                pickAncient(ancient);
                displayLevelsPicker();
            }
        )
    }
}

function displayLevelsPicker() {
    let html = `<div class="step_3"><h2 class="step__title step_3__title">Choose your level</h2><div class="levels">`
    for (const level of levelsData) {
        html += `<button id="${level.id}" class="level">${level.name}</button>`
    }
    html += "</div></div>"
    document.getElementById("board").innerHTML = html

    for (const level of levelsData) {
        document.getElementById(level.id).addEventListener('click', () => {
                pickLevel(level);
                displayMixCard();
            }
        )
    }
}

let selectedLevel = null;

function pickLevel(level) {
    selectedLevel = level;
}

function displayMixCard() {
    document.getElementById("board").innerHTML = `<button class="mix-cards"> mix cards</button>`
    document.querySelector(".mix-cards").addEventListener('click', () => {
            mixCards();
            displayStages();
        }
    )
}

let cardsDeck = {
    firstStage: [],
    secondStage: [],
    thirdStage: [],
}

function mixCards() {
    greenCards.shuffle()
    brownCards.shuffle()
    blueCards.shuffle()

    const expectedGreenCount = selectedAncient.firstStage.greenCards + selectedAncient.secondStage.greenCards + selectedAncient.thirdStage.greenCards;
    const expectedBrownCount = selectedAncient.firstStage.brownCards + selectedAncient.secondStage.brownCards + selectedAncient.thirdStage.brownCards;
    const expectedBlueCount = selectedAncient.firstStage.blueCards + selectedAncient.secondStage.blueCards + selectedAncient.thirdStage.blueCards;

    let greenCardsDeck = null
    let brownCardsDeck = null
    let blueCardsDeck = null

    switch (selectedLevel.id) {
        case 'easier': {
            greenCardsDeck = pickEasierCards(expectedGreenCount, greenCards);
            brownCardsDeck = pickEasierCards(expectedBrownCount, brownCards);
            blueCardsDeck = pickEasierCards(expectedBlueCount, blueCards);

            function pickEasierCards(expectedCount, cards) {
                const cardDeck = [];
                let remaining = expectedCount
                for (let card of cards) {
                    if (card.difficulty === 'easy') {
                        cardDeck.push(card)
                        remaining--
                    }
                    if (remaining === 0) {
                        break
                    }
                }
                if (remaining > 0) {
                    for (let card of cards) {
                        if (card.difficulty === 'normal') {
                            cardDeck.push(card)
                            remaining--
                        }
                        if (remaining === 0) {
                            break
                        }
                    }
                }
                return cardDeck;
            }

            break;
        }
        case 'easy': {
            greenCardsDeck = pickEasyCards(expectedGreenCount, greenCards);
            brownCardsDeck = pickEasyCards(expectedBrownCount, brownCards);
            blueCardsDeck = pickEasyCards(expectedBlueCount, blueCards);

            function pickEasyCards(expectedCount, cards) {
                const cardDeck = [];
                let remaining = expectedCount
                for (let card of cards) {
                    if (card.difficulty !== 'hard') {
                        cardDeck.push(card)
                        remaining--
                    }
                    if (remaining === 0) {
                        break
                    }
                }
                return cardDeck;
            }

            break;
        }
        case 'normal': {
            greenCardsDeck = pickNormalCards(expectedGreenCount, greenCards);
            brownCardsDeck = pickNormalCards(expectedBrownCount, brownCards);
            blueCardsDeck = pickNormalCards(expectedBlueCount, blueCards);

            function pickNormalCards(expectedCount, cards) {
                const cardDeck = [];
                let remaining = expectedCount
                for (let card of cards) {
                    cardDeck.push(card)
                    remaining--
                    if (remaining === 0) {
                        break
                    }
                }
                return cardDeck;
            }

            break;
        }
        case 'hard': {
            greenCardsDeck = pickHardCards(expectedGreenCount, greenCards);
            brownCardsDeck = pickHardCards(expectedBrownCount, brownCards);
            blueCardsDeck = pickHardCards(expectedBlueCount, blueCards);

            function pickHardCards(expectedCount, cards) {
                const cardDeck = [];
                let remaining = expectedCount
                for (let card of cards) {
                    if (card.difficulty !== 'easy') {
                        cardDeck.push(card)
                        remaining--
                    }
                    if (remaining === 0) {
                        break
                    }
                }
                return cardDeck;
            }

            break;
        }
        case 'harder': {
            greenCardsDeck = pickHarderCards(expectedGreenCount, greenCards);
            brownCardsDeck = pickHarderCards(expectedBrownCount, brownCards);
            blueCardsDeck = pickHarderCards(expectedBlueCount, blueCards);

            function pickHarderCards(expectedCount, cards) {
                const cardDeck = [];
                let remaining = expectedCount
                for (let card of cards) {
                    if (card.difficulty === 'hard') {
                        cardDeck.push(card)
                        remaining--
                    }
                    if (remaining === 0) {
                        break
                    }
                }
                if (remaining > 0) {
                    for (let card of cards) {
                        if (card.difficulty === 'normal') {
                            cardDeck.push(card)
                            remaining--
                        }
                        if (remaining === 0) {
                            break
                        }
                    }
                }
                return cardDeck;
            }

            break;
        }
        default:
            throw new Error("Unsupported level:'" + selectedLevel.id + "'");
    }

    fillCards("greenCards", greenCardsDeck)
    fillCards("brownCards", brownCardsDeck)
    fillCards("blueCards", blueCardsDeck)

    cardsDeck.firstStage.shuffle()
    cardsDeck.secondStage.shuffle()
    cardsDeck.thirdStage.shuffle()
}

function fillCards(colorCards, colorCardsDesk) {
    let index = 0;
    cardsDeck.firstStage = cardsDeck.firstStage.concat(colorCardsDesk.slice(0, selectedAncient.firstStage[colorCards]))
    cardsDeck.secondStage = cardsDeck.secondStage.concat(colorCardsDesk.slice(selectedAncient.firstStage[colorCards], selectedAncient.firstStage[colorCards] + selectedAncient.secondStage[colorCards]))
    cardsDeck.thirdStage = cardsDeck.thirdStage.concat(colorCardsDesk.slice(selectedAncient.firstStage[colorCards] + selectedAncient.secondStage[colorCards]))
}

function displayStages() {
    document.getElementById("board").innerHTML =
        `<div class="stages">
            <div class="stage stage_1">
                <p class="stage__title"> First stage </p>
                <div class="circles">
                    <span id="first-green-count" class="circle green first-stage__green-cards">${selectedAncient.firstStage.greenCards}</span>
                    <span id="first-brown-count" class="circle red first-stage__red-cards">${selectedAncient.firstStage.brownCards}</span>
                    <span id="first-blue-count" class="circle blue first-stage__blue-cards">${selectedAncient.firstStage.blueCards}</span>
                </div>
            </div>
            <div class="stage stage_2">
                <p class="stage__title"> Second stage </p>
                <div class="circles">
                    <span id="second-green-count" class="circle green green-cards">${selectedAncient.secondStage.greenCards}</span>
                    <span id="second-brown-count" class="circle red">${selectedAncient.secondStage.brownCards}</span>
                    <span id="second-blue-count"  class="circle blue">${selectedAncient.secondStage.blueCards}</span>
                </div>
            </div>
            <div class="stage stage_3">
                <p class="stage__title"> Third stage </p>
                <div class="circles">
                    <span id="third-green-count" class="circle green green-cards">${selectedAncient.thirdStage.greenCards}</span>
                    <span id="third-brown-count" class="circle red">${selectedAncient.thirdStage.brownCards}</span>
                    <span id="third-blue-count"  class="circle blue">${selectedAncient.thirdStage.blueCards}</span>
                </div>
            </div>
          </div>
          <div id="deck">
              <button class="mythic-card-bg">
                <img class="img" src="./assets/mythicCardBackground.png" alt="mythic Card Background" width="250">
              </button>
          </div>
          <div id="open" class="card-open"></div>
`

    document.getElementById('deck').addEventListener('click', () => {
        retrieveCard();
    })

}

function retrieveCard() {
    function updateCount(stage, card) {
        let id = stage + "-" + card.color + "-count";
        let count = parseInt(document.getElementById(id).innerHTML);
        document.getElementById(id).innerHTML = (--count).toString()
    }

    if (cardsDeck.firstStage.length > 0) {
        let card = cardsDeck.firstStage.shift();
        updateCount("first", card)
        displayCard(card)
    } else if (cardsDeck.secondStage.length > 0) {
        let card = cardsDeck.secondStage.shift();
        updateCount("second", card)
        displayCard(card)
    } else if (cardsDeck.thirdStage.length > 0) {
        let card = cardsDeck.thirdStage.shift();
        updateCount("third", card)
        displayCard(card)
        if (cardsDeck.thirdStage.length === 0) {
            document.getElementById("deck").innerHTML = ""
        }
    }
}

function displayCard(card) {
    document.getElementById("open").innerHTML = `<img class="img" src="${card.cardFace}" alt="${card.cardFace}" width="250">`
}

Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i === 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}