const container = document.querySelector(".container");
const submit = document.getElementById("submit");
const guess = document.querySelector(".input--field");
const movieContainer = document.querySelector(".movie-container");
let wordContainer;
const movie = "   Harry Potter And The Chamber Of Secrets ";
const formattedMovie = movie.toLowerCase().trim().split(" ");
