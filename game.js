class Card {
  constructor(element) {
    this.element = element;
    this.backText = element.querySelector(".card-back .card-text");
  }

  set problem(mathProblem) {
    this.mathProblem = mathProblem;
    this.backText.innerText = mathProblem.text;
    this.backText.classList.toggle("question", mathProblem.isQuestion);
  }

  get isFlipped() {
    return this.element.classList.contains("flipped");
  }

  flip() {
    this.element.classList.toggle("flipped");
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function randomEl(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const OPERATORS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  x: (a, b) => a * b,
  ":": (a, b) => a / b,
};

function createMathProblem(operator, excludedSet) {
  let question, answer;
  do {
    let a, b;
    switch (operator) {
      case "+":
        a = Math.floor(Math.random() * 19 + 1);
        b = Math.floor(Math.random() * 9 + 1);
        break;
      case "-":
        a = Math.floor(Math.random() * 30 + 1);
        b = Math.floor(Math.random() * 9 + 1);
        [a, b] = [Math.max(a, b), Math.min(a, b)];
        break;
      case "x":
        a = Math.floor(Math.random() * 10 + 1);
        b = Math.floor(Math.random() * 10 + 1);
        break;
      case ":":
        a = Math.floor(Math.random() * 10 + 1);
        b = Math.floor(Math.random() * 10 + 1);
        [a, b] = [Math.max(a, b), Math.min(a, b)];
        a = a * b;
        break;
    }
    question = `${a}${operator}${b}`;
    answer = OPERATORS[operator](a, b);
  } while (excludedSet.has(answer));
  excludedSet.add(answer);
  const id = Symbol();
  return [
    { text: question, id, isQuestion: true },
    { text: answer, id, isQuestion: false },
  ];
}

function createMathProblems(count) {
  const includedSet = new Set();
  const mathProblems = [];
  const operators = Object.keys(OPERATORS);
  for (let i = 0; i < count; i++) {
    const operator = randomEl(operators);
    mathProblems.push(...createMathProblem(operator, includedSet));
  }
  shuffleArray(mathProblems);
  return mathProblems;
}

const cardsElements = document.querySelectorAll(".card-container");
const endPanel = document.getElementById("endpanel");
const numTries = document.getElementById("num-tries");
const numTriesValue = document.getElementById("num-tries-value");
const playAgainBtn = document.getElementById("btn-play-again");
const successMessage = document.getElementById("success-message");

const SUCCESS_MESSAGES = [
  "Fantastisch!",
  "Super!",
  "Hervorragend!",
  "Klasse!",
  "Großartig!",
  "Genial!",
  "Wunderbar!",
];

const cards = [...cardsElements].map(element => new Card(element));

let numPairsSolved = 0;
const pair = [];

// add click events to all cards
for (const card of cards) {
  card.element.addEventListener("click", () => onCardClicked(card));
}

function reset() {
  numPairsSolved = 0;
  numTries.innerText = "0";
  pair.length = 0;
  const mathProblems = createMathProblems(cards.length / 2);
  for (const card of cards) {
    card.problem = mathProblems.pop();
  }
}

function onCardClicked(card) {
  if (!card.isFlipped) {
    card.flip();
    pair.push(card);

    if (pair.length === 2) {
      const [card1, card2] = pair;
      if (card1.mathProblem.id === card2.mathProblem.id) {
        numPairsSolved++;
        setTimeout(() => {
          card1.element.classList.toggle("solved", true);
          card2.element.classList.toggle("solved", true);
          if (numPairsSolved === cards.length / 2) {
            endPanel.classList.toggle("show", true);
            successMessage.innerText = randomEl(SUCCESS_MESSAGES);
            numTriesValue.innerText = numTries.innerText;
          }
        }, 800);
      } else {
        setTimeout(() => {
          numTries.innerText = +numTries.innerText + 1;
          card1.flip();
          card2.flip();
        }, 3500);
      }
      pair.length = 0;
    }
  }
}

playAgainBtn.addEventListener("click", () => {
  for (const card of cards) {
    card.flip();
  }
  endPanel.classList.toggle("show", false);
  setTimeout(() => {
    for (const card of cards) {
      card.element.classList.toggle("solved", false);
    }
    // reset
    reset();
  }, 800);
});

reset();
