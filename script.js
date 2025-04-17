// DOM Elements
const movieSwipeContainer = document.getElementById('movie-swipe-container');
const watchLaterUl = document.getElementById('watch-later-ul');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const clearWatchLaterBtn = document.getElementById('clear-watch-later');

// Movie list with 6 movies
const movies = [
    { title: "Inception", description: "A thief steals secrets via dream-sharing technology." },
    { title: "Interstellar", description: "Explorers travel through a wormhole to save humanity." },
    { title: "The Dark Knight", description: "Batman faces the Joker in Gotham." },
    { title: "The Matrix", description: "A hacker discovers a simulated reality." },
    { title: "Inglourious Basterds", description: "A group plots to assassinate Nazi leaders." },
    { title: "The Shawshank Redemption", description: "Two prisoners form a bond over decades." }
];

let currentMovies = [...movies];

// Load watch later movies from localStorage and ensure it's an array
let watchLaterMovies = Array.isArray(JSON.parse(localStorage.getItem('watchLaterMovies'))) ? JSON.parse(localStorage.getItem('watchLaterMovies')) : [];

// Check if Swiper is available before proceeding
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Swiper === 'undefined') {
        console.error('Swiper library not loaded. Ensure swiper-bundle.min.js is included and loaded before script.js');
        return;
    }

    // Determine the current page
    const isIndexPage = document.location.pathname.includes('index.html') || !document.location.pathname.includes('watch-later.html');
    console.log('Is index page:', isIndexPage);

    let swiper;

    // Initialize Swiper only on index.html
    if (isIndexPage) {
        swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            allowTouchMove: true,
            grabCursor: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                touchMove: (swiper) => {
                    const slide = swiper.slides[swiper.activeIndex];
                    if (!slide) return;
                    const offset = swiper.touches.diff;
                    const addedOverlay = slide.querySelector('.overlay.added');
                    const skippedOverlay = slide.querySelector('.overlay.skipped');

                    if (offset > 50) {
                        addedOverlay.style.opacity = Math.min(offset / 100, 1);
                        skippedOverlay.style.opacity = 0;
                    } else if (offset < -50) {
                        skippedOverlay.style.opacity = Math.min(Math.abs(offset) / 100, 1);
                        addedOverlay.style.opacity = 0;
                    } else {
                        addedOverlay.style.opacity = 0;
                        skippedOverlay.style.opacity = 0;
                    }
                },
                touchEnd: (swiper) => {
                    const slide = swiper.slides[swiper.activeIndex];
                    if (!slide) return;
                    const movieTitle = slide.querySelector('h3').textContent;
                    const movie = currentMovies.find(m => m.title === movieTitle);
                    const offset = swiper.touches.diff;
                    console.log(`Swipe offset: ${offset}, Movie: ${movieTitle}`);

                    if (offset > 100) { // Swipe right to add
                        if (movie && !watchLaterMovies.some(m => m.title === movieTitle)) {
                            watchLaterMovies.push(movie);
                            localStorage.setItem('watchLaterMovies', JSON.stringify(watchLaterMovies));
                            updateWatchLaterList();
                            console.log(`Added ${movieTitle} to Watch Later via swipe`);
                        }
                        removeCurrentSlide(swiper);
                    } else if (offset < -100) { // Swipe left to skip
                        removeCurrentSlide(swiper);
                        console.log(`Skipped ${movieTitle} via swipe`);
                    }

                    const addedOverlay = slide.querySelector('.overlay.added');
                    const skippedOverlay = slide.querySelector('.overlay.skipped');
                    addedOverlay.style.opacity = 0;
                    skippedOverlay.style.opacity = 0;
                },
            }
        });
    }

    // Function to remove the current slide and update the carousel
    function removeCurrentSlide(swiper) {
        const currentIndex = swiper.activeIndex;
        currentMovies.splice(currentIndex, 1);
        swiper.removeSlide(currentIndex);

        if (currentMovies.length === 0) {
            currentMovies = [...movies];
            displayMovies();
        }
    }

    // Function to display movies in the Swiper container
    function displayMovies() {
        if (!movieSwipeContainer) {
            console.log('movieSwipeContainer not found, likely not on index.html');
            return;
        }
        movieSwipeContainer.innerHTML = '';
        if (currentMovies.length === 0) {
            currentMovies = [...movies];
        }

        currentMovies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('swiper-slide');
            movieCard.innerHTML = `
                <div class="movie-card">
                    <h3>${movie.title}</h3>
                    <p>${movie.description}</p>
                    <div class="overlay added">Added</div>
                    <div class="overlay skipped">Skipped</div>
                    <button class="add-btn">Add</button>
                    <button class="skip-btn">Skip</button>
                </div>
            `;
            movieSwipeContainer.appendChild(movieCard);
        });

        swiper.update();
        console.log('Buttons re-rendered, checking DOM:', movieSwipeContainer.querySelector('.add-btn') !== null);
    }

    // Function to attach event listeners using delegation on the document
    function setupButtonListeners() {
        if (!movieSwipeContainer) {
            console.error('movieSwipeContainer not found in DOM, likely not on index.html');
            return;
        }

        document.body.addEventListener('click', (e) => {
            console.log('Click event detected on body, target:', e.target.tagName, e.target.className);
            const addBtn = e.target.className === 'add-btn' ? e.target : e.target.closest('.add-btn');
            const skipBtn = e.target.className === 'skip-btn' ? e.target : e.target.closest('.skip-btn');

            if (addBtn) {
                console.log('Add button found, processing...');
                const slide = addBtn.closest('.swiper-slide');
                if (!slide) {
                    console.error('No slide found for add button');
                    return;
                }
                const movieTitle = slide.querySelector('h3').textContent;
                console.log('Movie title identified:', movieTitle);
                const movie = currentMovies.find(m => m.title === movieTitle);
                if (movie) {
                    console.log('Movie object found:', movie);
                    if (!watchLaterMovies.some(m => m.title === movieTitle)) {
                        console.log('Adding movie to watchLaterMovies:', movie);
                        watchLaterMovies.push(movie);
                        const storageResult = localStorage.setItem('watchLaterMovies', JSON.stringify(watchLaterMovies));
                        console.log('Local storage updated, result:', storageResult);
                        updateWatchLaterList();
                        console.log(`Added ${movieTitle} to Watch Later via button`);
                    } else {
                        console.log(' personally in watchLaterMovies');
                    }
                } else {
                    console.error('No movie found in currentMovies for:', movieTitle);
                }
                removeCurrentSlide(swiper);
            } else if (skipBtn) {
                console.log('Skip button found, processing...');
                const slide = skipBtn.closest('.swiper-slide');
                if (!slide) {
                    console.error('No slide found for skip button');
                    return;
                }
                const movieTitle = slide.querySelector('h3').textContent;
                removeCurrentSlide(swiper);
                console.log(`Skipped ${movieTitle} via button`);
            }
        });
    }

    // Function to update the "Watch Later" list
    function updateWatchLaterList() {
        if (!watchLaterUl) {
            console.log('watchLaterUl not found, likely not on watch-later.html');
            return;
        }
        console.log('Attempting to update watch later list');
        watchLaterUl.innerHTML = '';
        // Reload watchLaterMovies from localStorage to ensure sync
        watchLaterMovies = JSON.parse(localStorage.getItem('watchLaterMovies')) || [];
        console.log('Updating watch later list with:', watchLaterMovies);
        if (watchLaterMovies.length === 0) {
            watchLaterUl.innerHTML = '<li>No movies in your Watch Later list.</li>';
        } else {
            watchLaterMovies.forEach(movie => {
                console.log('Adding movie to list:', movie.title);
                const li = document.createElement('li');
                li.innerHTML = `
                    ${movie.title}
                    <button class="remove-btn" data-title="${movie.title}">Remove</button>
                `;
                watchLaterUl.appendChild(li);
            });

            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const movieTitle = e.target.getAttribute('data-title');
                    watchLaterMovies = watchLaterMovies.filter(m => m.title !== movieTitle);
                    localStorage.setItem('watchLaterMovies', JSON.stringify(watchLaterMovies));
                    updateWatchLaterList();
                    console.log(`Removed ${movieTitle} from Watch Later`);
                });
            });
        }
        console.log('Watch later list updated, current DOM:', watchLaterUl.innerHTML);
    }

    // Function to clear watch later list
    function clearWatchLater() {
        watchLaterMovies = [];
        localStorage.setItem('watchLaterMovies', JSON.stringify(watchLaterMovies));
        updateWatchLaterList();
        console.log('Cleared Watch Later list');
    }

    if (clearWatchLaterBtn) {
        clearWatchLaterBtn.addEventListener('click', clearWatchLater);
    }

    // Function to handle search
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!searchInput || !searchResults) return;

        if (query === '') {
            searchResults.innerHTML = '<p>Enter a search term.</p>';
            return;
        }

        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(query) || 
            movie.description.toLowerCase().includes(query)
        );

        if (filteredMovies.length === 0) {
            searchResults.innerHTML = '<p>No movies found.</p>';
        } else {
            filteredMovies.forEach(movie => {
                const resultDiv = document.createElement('div');
                resultDiv.classList.add('search-result');
                resultDiv.innerHTML = `
                    <h3>${movie.title}</h3>
                    <p>${movie.description}</p>
                `;
                searchResults.appendChild(resultDiv);
            });
        }
    }

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Initial setup based on page
    if (isIndexPage) {
        console.log('Running index.html setup');
        displayMovies();
        setupButtonListeners();
    }
    if (document.location.pathname.includes('watch-later.html')) {
        console.log('Detected watch-later.html, updating list on load');
        updateWatchLaterList();
    }
});