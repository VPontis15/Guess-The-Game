"use strict";

const container = document.querySelector(".container");
const submit = document.getElementById("submit");
let guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");
const array = document.querySelector(".array");
let scoreText = document.querySelector(".score");
let score = 20;
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let page = getRandomNumber(0, 144);

function checkIfCharacterIsASymbol(letter) {
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
    return letter;
}

class App {
  #markup;
  #movie = {
    url: "",
    title: "",
    year: "",
    poster: "",
    formattedMovie: "",
    page: "",
  };

  #wrongGuessesArray = [];
  #allLetters;
  #wordContainer;
  constructor() {
    this.initApp();
  }

  async initApp() {
    try {
      guess.focus();
      const movie = await this.getMovie();
      this.#initMovie(movie);
      this.generateWords();
      submit.addEventListener(
        "click",
        this.#generateWrongGuessesArrayContent.bind(this)
      );
      submit.addEventListener("click", this.#revealGuessedLetters.bind(this));
    } catch (error) {
      console.error(error);
    }
    // this.log();
  }

  async getMovie() {
    try {
      this.#movie.url = `http://www.omdbapi.com/?s=evil&type=movie&page=${page}&apikey=5232240c`;
      const response = await fetch(this.#movie.url);
      const result = await response.json();
      this.#movie.totalResults = result.totalResults;
      return result.Search[getRandomNumber(0, 9)];
    } catch (error) {
      console.error(error);
    }
  }

  #initMovie(data) {
    this.#movie.title = data.Title;
    this.#movie.poster = data.Poster;
    this.#movie.year = data.Year;
    this.#movie.formattedMovie = this.#movie.title
      .toLowerCase()
      .trim()
      .split(" ");

    this.#movie.page = getRandomNumber(
      0,
      Math.floor(this.#movie.totalResults / 10)
    );
  }

  generateWordContainers() {
    this.#wordContainer = document.createElement("div");
    this.#wordContainer.classList.add("word-container");
    movieContainer.appendChild(this.#wordContainer);
    return this.#wordContainer;
  }

  generateWords() {
    this.#movie.formattedMovie.forEach((word) => {
      const boxes = this.generateWordContainers();
      for (let letter of word) {
        if (checkIfCharacterIsASymbol(letter)) return;
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

    guess.value = "";
  }

  #generateWrongGuessesMarkup(wrongGuess) {
    const markup = `<div><span class="array-letter">${wrongGuess}</span></div>`;
    array.insertAdjacentHTML("afterbegin", markup);
  }

  #generateWrongGuessesArrayContent() {
    let wrongGuess;
    if (
      !this.#movie.title
        .trim()
        .toLowerCase()
        .includes(guess.value.trim().toLowerCase())
    )
      wrongGuess = guess.value.trim().toLowerCase().slice(0);
    if (
      wrongGuess !== undefined &&
      !this.#wrongGuessesArray.includes(wrongGuess) &&
      !checkIfCharacterIsASymbol(guess.value.trim().toLowerCase()) &&
      typeof wrongGuess === "string"
    ) {
      this.#wrongGuessesArray.push(wrongGuess);
      this.#generateWrongGuessesMarkup(wrongGuess);
    }
  }
}

const app = new App();
