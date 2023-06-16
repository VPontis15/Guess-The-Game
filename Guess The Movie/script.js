"use strict";

const container = document.querySelector(".container");
const submit = document.getElementById("submit");
let guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");
const array = document.querySelector(".array");
const poster = document.querySelector(".movie-poster-image");
const posterText = document.querySelector(".movie-poster-text");
const gameName = document.querySelector(".game-name");
const overlay = document.querySelector(".overlay");
const helpContainer = document.querySelector(".movie-helper");
let scoreText = document.querySelector(".score");
const timer = document.querySelector(".timer");
let score = 20;
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let page = getRandomNumber(1, 50);

function checkIfCharacterIsASymbol(letter) {
  if (
    letter === ":" ||
    letter === "-" ||
    letter === "_" ||
    letter === ";" ||
    letter === "," ||
    letter === "." ||
    letter === '"' ||
    letter === "(" ||
    letter === ")"
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
    genre: "",
    helpArray: "",
  };

  #hasWon = false;
  #wrongGuessesArray = [];
  #allLetters;
  #wordContainer;
  constructor() {
    this.initApp();
  }

  async initApp() {
    try {
      guess.focus();
      this.#setTimer(20);
      const movie = await this.getMovie();
      console.log(movie);
      this.#initMovie(movie);
      this.generateWords();
      submit.addEventListener(
        "click",
        this.#generateWrongGuessesArrayContent.bind(this)
      );
      submit.addEventListener("click", this.#revealGuessedLetters.bind(this));
      console.log(this.#game.helpArray);
      this.#addHelp(this.#game.helpArray);
      this.#addHelp(this.#game.helpArray);
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
      console.log(page);
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
    this.#game.helpArray = [this.#getReleaseDate(data), this.#getGenre(data)];
  }

  revealImage(data) {
    if (data === "N/A") {
      posterText.textContent = "No Image Available";
      posterText.style.fontSize = "3rem";
    } else {
      // posterText.style.display = "none";
      poster.src = this.#game.poster;
      overlay.style.display = "none";
      gameName.innerText = this.#game.title;
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
        this.#allLetters[`${index}`].classList.add("checked");
      }
    }
    this.#checkWinCondition(this.#allLetters);

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

  #checkWinCondition(array) {
    if ([...array].every((letter) => letter.classList.contains("checked"))) {
      this.revealImage(this.#game.poster);
      this.#hasWon = true;
    }
    this.#checkIfWon(this.#hasWon);
  }

  #checkIfWon(winCondition) {
    if (winCondition) {
      movieContainer.innerHTML = "You have won!!!";
      movieContainer.style.fontSize = "3rem";
    }
  }

  #getGenre(data) {
    this.#game.genre = data.genres;

    return this.#game.genre[getRandomNumber(0, this.#game.genre.length - 1)]
      .name;
  }

  #getReleaseDate() {
    return this.#game.year;
  }

  #addHelp(data) {
    let markup = ` <p class="movie-helper--item"> ${
      data[getRandomNumber(0, data.length)]
    } </p>`;
    helpContainer.insertAdjacentHTML("beforeend", markup);
  }

  #setTimer(secs) {
    let minutes;
    let seconds;

    let message;
    timer.textContent = message;
    const intervalID = setInterval(() => {
      minutes = Math.floor(secs / 60);
      seconds = secs % 60;
      secs = secs - 1;
      message = `${minutes}:${
        seconds < 10 ? (seconds = `0${seconds}`) : (seconds = seconds)
      }`;
      timer.textContent = message;

      if (this.#hasWon || secs < 0) clearInterval(intervalID);
    }, 1000);
  }
}

const app = new App();
