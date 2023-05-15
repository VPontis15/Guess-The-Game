"user strict";

const container = document.querySelector(".container");

const guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");
const test = movieContainer.children;
const submit = document.getElementById("submit");

submit.addEventListener("click", () => {});
class App {
  markup;
  #movie = " Harry Potter And the chamber of secrets";
  #formattedMovie = this.#movie.toLowerCase().trim().split(" ");
  #wordContainer;
  #allLetters;

  constructor() {
    this.generateWords(this.#formattedMovie);
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
      for (let l of word) {
        this.markup = this.#generateMarkup(l);
        boxes.insertAdjacentHTML("beforeend", this.markup);
      }
    });
  }

  #generateMarkup(letter) {
    return ` <div class="letter">
    <span class="hidden" >${letter}</span>
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
}

const app = new App();
