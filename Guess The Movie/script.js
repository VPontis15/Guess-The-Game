const container = document.querySelector(".container");
const submit = document.getElementById("submit");
const guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");

class App {
  markup;
  #movie = "   Harry Potter And The Chamber of Secrets ";
  #formattedMovie = this.#movie.toLowerCase().trim().split(" ");
  #wordContainer;
  constructor() {
    this.generateWords(this.#formattedMovie);
  }

  generateWordContainers() {
    this.#wordContainer = document.createElement("div");
    this.#wordContainer.classList.add("word-container");
    movieContainer.appendChild(this.#wordContainer);
    return this.#wordContainer;
  }

  generateWords(l) {
    this.#formattedMovie.forEach((word) => {
      const boxes = this.generateWordContainers();
      [boxes].forEach((box) => {
        for (l of word) {
          this.markup = this.#generateMarkup(l);
          box.insertAdjacentHTML("beforeend", this.markup);
        }
      });
    });
  }

  #generateMarkup(letter) {
    return ` <div class="letter">
    <span>${letter}</span>
  </div>`;
  }

  log() {}
}

const app = new App();

// app.log();
