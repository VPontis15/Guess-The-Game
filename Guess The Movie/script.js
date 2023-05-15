const container = document.querySelector(".container");
const submit = document.getElementById("submit");
const guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");

const url = "https://moviesdatabase.p.rapidapi.com/titles";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "7d9954ff2dmsh27aa88166562f13p18cfa1jsnd6653dd96a44",
    "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
  },
};

const getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

submit.addEventListener("click", () => {});
class App {
  markup;
  #movie;
  #formattedMovie;
  #allLetters;
  #wordContainer;
  constructor() {
    this.initApp();
  }

  async initApp() {
    this.#movie = await this.getMovie();
    this.#formattedMovie = this.#movie.toLowerCase().trim().split(" ");
    this.generateWords();
    submit.addEventListener("click", this.#revealGuessedLetters.bind(this));

    // this.log();
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

  async getMovie() {
    try {
      const response = await fetch(url, options);
      const result = await response.json();

      return result.results[getRandomNumber(0, result.results.length - 1)]
        .titleText.text;
    } catch (error) {
      console.error(error);
    }
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
    console.log(this.#movie);
  }
}

const app = new App();

// app.log();
