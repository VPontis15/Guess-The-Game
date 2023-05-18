const container = document.querySelector(".container");
const submit = document.getElementById("submit");
const guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");
let page = getRandomNumber(0, 100);
console.log(page);

const url = `http://www.omdbapi.com/?s=break&type=movie&page=${page}&apikey=5232240c`;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class App {
  markup;
  #movie;
  #movieTitle;
  #moviePoster;
  #movieYear;
  #formattedMovie;
  #allLetters;
  #wordContainer;
  constructor() {
    this.initApp();
  }

  async initApp() {
    guess.value = " ";
    this.#movie = await this.getMovie();
    this.#movieTitle = this.#movie.Title;
    this.#moviePoster = this.#movie.Poster;
    this.#movieYear = this.#movie.Year;
    this.#formattedMovie = this.#movieTitle.toLowerCase().trim().split(" ");
    this.generateWords();
    submit.addEventListener("click", this.#revealGuessedLetters.bind(this));

    // this.log();
  }

  async getMovie() {
    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result.Search[getRandomNumber(0, 9)]);
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
          letter === "."
        )
          return;
        this.markup = this.#generateMarkup(letter);
        boxes.insertAdjacentHTML("beforeend", this.markup);
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
    this.#allLetters = document.querySelectorAll(".letter");

    for (const [index, value] of this.#allLetters.entries()) {
      if (guess.value == " ") return;
      if (value.innerText === guess.value.trim().toLowerCase()) {
        this.#allLetters[`${index}`].children[0].classList.remove("hidden");
      }
    }
    guess.value = " ";
  }

  log() {
    console.log(this.#movieTitle);
  }
}

const app = new App();

// app.log();
