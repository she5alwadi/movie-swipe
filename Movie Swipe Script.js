JAVASCRIPT
const movieSwipeContainer = document.querySelector('.swiper-wrapper');
const watchLaterList = document.getElementById('watch-later-list');
const watchLaterUl = document.getElementById('watch-later-ul');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

let watchLaterMovies = [];

//Example of movie list (tittle/discription)
const movies = [
    { title: "Inception", description: "A thief who steals corporate secrets through the use of dream-sharing technology."
    { title: "Interstellar", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
    { title: "The Dark Knight", description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham."
];

// Swiper
const swiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Function to display movies
function displayMovies() {
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('swiper-slide', 'movie-card');
        movieCard.innerHTML 
