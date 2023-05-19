const container = document.querySelector(".container");
const submit = document.getElementById("submit");
let guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");
const array = document.querySelector(".array");
let page = getRandomNumber(0, 100);
let scoreText = document.querySelector(".score");
let score = 20;
const url = `http://www.omdbapi.com/?s=park&type=movie&page=${page}&apikey=5232240c`;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class App {
  #markup;
  #movie;
  #movieTitle;
  #moviePoster;
  #movieYear;
  #wrongGuessesArray = [];
  #formattedMovie;
  #allLetters;
  #wordContainer;
  constructor() {
    this.initApp();
  }

  async initApp() {
    guess.focus();
    this.#movie = await this.getMovie();
    this.#movieTitle = this.#movie.Title;
    this.#moviePoster = this.#movie.Poster;
    this.#movieYear = this.#movie.Year;
    this.#formattedMovie = this.#movieTitle.toLowerCase().trim().split(" ");
    this.generateWords();
    submit.addEventListener(
      "click",
      this.#generateWrongGuessesArray.bind(this)
    );
    submit.addEventListener("click", this.#revealGuessedLetters.bind(this));

    // this.log();
  }

  async getMovie() {
    try {
      const response = await fetch(url);
      const result = await response.json();
      return result.Search[getRandomNumber(0, 9)];
    } catch (error) {
      console.error(error);
    }
  }

  generateWordContainers() {
    this.#wordContainer = document.createElement("div");
    this.#wordContainer.classList.add("word-container");
    movieContainer.appendChild(this.#wordContainer);
    return this.#wordContainer;
  }

  generateWords() {
    this.#formattedMovie.forEach((word) => {
      const boxes = this.generateWordContainers();
      for (let letter of word) {
        if (
          letter === ":" ||
          letter === "-" ||
          letter === "_" ||
          letter === ";" ||
          letter === "," ||
          letter === "." ||
          letter === "'" ||
          letter === '"'
        )
          return;
        this.#markup = this.#generateMarkup(letter);
        boxes.insertAdjacentHTML("beforeend", this.#markup);
      }
    });
  }

  #generateMarkup(letter) {
    return ` <div class="letter">
    <span class="hidden">${letter}</span>
  </div>`;
  }

  #revealGuessedLetters(e) {
    e.preventDefault();
    guess.focus();
    this.#allLetters = document.querySelectorAll(".letter");

    for (const [index, value] of this.#allLetters.entries()) {
      if (guess.value == " ") return;
      if (value.innerText === guess.value.trim().toLowerCase()) {
        this.#allLetters[`${index}`].children[0].classList.remove("hidden");
      }
    }

    guess.value = " ";
  }

  #generateWrongGuessesMarkup(wrongGuess) {
    const markup = `<div><span class="array-letter">${wrongGuess}</span></div>`;
    array.insertAdjacentHTML("afterbegin", markup);
  }

  #generateWrongGuessesArray() {
    let wrongGuess;
    if (
      !this.#movieTitle
        .trim()
        .toLowerCase()
        .includes(guess.value.trim().toLowerCase())
    )
      wrongGuess = guess.value.trim().toLowerCase();
    if (
      wrongGuess !== undefined &&
      !this.#wrongGuessesArray.includes(wrongGuess)
    ) {
      this.#wrongGuessesArray.push(wrongGuess);
      this.#generateWrongGuessesMarkup(wrongGuess);
    }
  }
}

const app = new App();
