"use strict";

const container = document.querySelector(".container");
const submit = document.getElementById("submit");
let guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");
const array = document.querySelector(".array");
const poster = document.querySelector(".movie-poster");
const posterText = document.querySelector(".movie-poster-text");
let scoreText = document.querySelector(".score");
let score = 20;
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let page = getRandomNumber(0, 10);

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
  #game = {
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
      this.revealImage(this.#game.poster);
      submit.addEventListener("click", this.#revealGuessedLetters.bind(this));
      console.log(this.#game.poster, this.#game.title, this.#game.year);
    } catch (error) {
      console.error(error);
    }
    // this.log();
  }

  async getMovie() {
    try {
      this.#game.url = `https://rawg-video-games-database.p.rapidapi.com/games?key=829b60ddf5b8476987877051d2942836&page=${page}`;
      const options = {
        method: "GET",

        headers: {
          "X-RapidAPI-Key":
            "7d9954ff2dmsh27aa88166562f13p18cfa1jsnd6653dd96a44",
          "X-RapidAPI-Host": "rawg-video-games-database.p.rapidapi.com",
        },
      };
      const response = await fetch(this.#game.url, options);
      const result = await response.json();
      this.#game.totalResults = result.count;
      return result.results[getRandomNumber(0, 19)];
    } catch (error) {
      console.error(error);
    }
  }

  #initMovie(data) {
    this.#game.title = data.name;
    this.#game.poster = data.background_image;
    this.#game.year = data.released.split("-")[0];
    this.#game.formattedMovie = this.#game.title
      .toLowerCase()
      .trim()
      .split(" ");

    this.#game.page = getRandomNumber(
      0,
      Math.floor(this.#game.totalResults / 10)
    );
  }

  revealImage(data) {
    if (data === "N/A") {
      posterText.textContent = "No Image Available";
      posterText.style.fontSize = "3rem";
    } else {
      posterText.style.display = "none";
      poster.style.background = `url(${data}) no-repeat center center/ cover`;
    }
  }

  generateWordContainers() {
    this.#wordContainer = document.createElement("div");
    this.#wordContainer.classList.add("word-container");
    movieContainer.appendChild(this.#wordContainer);
    return this.#wordContainer;
  }

  generateWords() {
    this.#game.formattedMovie.forEach((word) => {
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
      !this.#game.title
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
